import os
import time
import csv
from io import StringIO
import base64

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from sql_runner import run_text_to_sql
from deepseek_integration import ask_deepseek_for_reasoning

load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AskRequest(BaseModel):
    question: str
    tone: str = "friendly"  # optional: "friendly", "professional", "casual"
    session_id: str = None  # optional: for multi-turn context

# In-memory conversation memory (keyed by session_id)
conversation_memory = {}
# In-memory custom instructions per session
custom_instructions = {}

def summarize_answer(text: str, max_words: int = 50) -> str:
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return text

def rows_to_csv(rows, columns):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(columns)
    writer.writerows(rows)
    csv_str = output.getvalue()
    return "data:text/csv;base64," + base64.b64encode(csv_str.encode()).decode()

def detect_query_type(question: str) -> str:
    question_lower = question.lower()
    if any(word in question_lower for word in ["count", "total", "number of"]):
        return "count"
    elif any(word in question_lower for word in ["average", "mean"]):
        return "average"
    elif any(word in question_lower for word in ["trend", "increase", "decrease", "change"]):
        return "trend"
    return "general"

@router.post("/ask")
def ask_ai(payload: AskRequest):
    start_time = time.time()
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    tone = payload.tone
    session_id = payload.session_id or "default"

    # Initialize conversation memory for session
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    if session_id not in custom_instructions:
        custom_instructions[session_id] = {}

    # Check if user wants AI to remember something
    if "remember this" in question.lower():
        if "who are you" in question.lower() and "i am ridoy" in question.lower():
            custom_instructions[session_id]["identity"] = "I am ridoy"
            answer_text = "Got it! I will remember my identity as 'I am ridoy'."
            conversation_memory[session_id].append({"question": question, "answer": answer_text})
            return {"question": question, "answer": answer_text}

    # Retrieve remembered identity if any
    identity_text = custom_instructions[session_id].get(
        "identity",
        "The who am i is PostgreSQL Text-to-SQL assistant for a Yelp analytics application."
    )

    try:
        # 1️⃣ Convert user question into SQL
        result = run_text_to_sql(question)
        rows = result.get("rows")
        columns = result.get("columns")
        sql_query = result.get("sql")
        error = result.get("error")

        # 2️⃣ Format SQL results for readability
        table_text = None
        if rows and columns:
            if len(rows) == 1 and len(rows[0]) == 1:
                col_name = columns[0].replace("_", " ").lower()
                answer_text = f"The {col_name} is {rows[0][0]}." \
                    if "count" not in col_name.lower() else f"There are {rows[0][0]} {col_name}."
            else:
                header = " | ".join([c.replace("_"," ").capitalize() for c in columns])
                separator = " | ".join(["---"]*len(columns))
                row_lines = [" | ".join([str(v) for v in r]) for r in rows[:50]]  # show first 50 rows
                table_text = "\n".join([header, separator] + row_lines)
                answer_text = table_text
                if len(rows) > 50:
                    answer_text += f"\n\n*Showing first 50 of {len(rows)} rows*"

        # 2.5️⃣ Table-only request handling
        if "table" in question.lower() and table_text:
            answer_text = table_text

        # 3️⃣ Detect query type
        query_type = detect_query_type(question)

        # 4️⃣ Build system prompt for AI reasoning
        context_history = conversation_memory[session_id][-3:]  # last 3 interactions
        context_text = "\n".join([f"User: {h['question']}\nAI: {h['answer']}" for h in context_history])

        system_prompt = f"""
You are a smart AI assistant for Yelp analytics.

Respond in a {tone}, natural and human-like way.

IMPORTANT RULES:
- Keep answers SHORT and clear
- Do NOT over-explain
- If user asks for table → ONLY return table
- If user asks for number → give direct answer
- Explain SQL ONLY if user asks
- Max 4-5 lines unless necessary

Context:
{context_text}

User question: "{question}"

SQL Query: {sql_query}
SQL Result sample: {rows[:10] if rows else 'No rows'}
Columns: {columns}
Query type: {query_type}
"""

        # 5️⃣ Call AI reasoning engine
        ai_response = ask_deepseek_for_reasoning(system_prompt)
        if ai_response and "table" not in question.lower():
            answer_text = ai_response  # override raw table with AI explanation

        # 6️⃣ Add summarization
        answer_summary = summarize_answer(answer_text)

        # 7️⃣ Add CSV export
        csv_link = rows_to_csv(rows, columns) if rows else None

        # 8️⃣ Update conversation memory
        conversation_memory[session_id].append({"question": question, "answer": answer_text})

        end_time = time.time()
        execution_time = round(end_time - start_time, 2)

        return {
            "question": question,
            "answer": answer_text,
            "summary": answer_summary,
            "sql": sql_query,
            "columns": columns,
            "rows": rows,
            "error": error,
            "csv_link": csv_link,
            "query_type": query_type,
            "execution_time_seconds": execution_time
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
