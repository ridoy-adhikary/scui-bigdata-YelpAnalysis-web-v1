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
    tone: str = "friendly"  # optional: friendly, professional, casual
    session_id: str = None  # optional: multi-turn context

# In-memory conversation memory
conversation_memory = {}
custom_instructions = {}

# Utility: summarize answer
def summarize_answer(text: str, max_words: int = 50) -> str:
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return text

# Utility: convert rows to CSV link
def rows_to_csv(rows, columns):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(columns)
    writer.writerows(rows)
    csv_str = output.getvalue()
    return "data:text/csv;base64," + base64.b64encode(csv_str.encode()).decode()

# Detect query type
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

    # Initialize memory
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    if session_id not in custom_instructions:
        custom_instructions[session_id] = {}

    # Retrieve identity
    identity_text = custom_instructions[session_id].get(
        "identity",
        "I am a PostgreSQL Text-to-SQL assistant for Yelp analytics."
    )

    try:
        # 1️⃣ Convert question to SQL
        result = run_text_to_sql(question)
        rows = result.get("rows")
        columns = result.get("columns")
        sql_query = result.get("sql")
        error = result.get("error")

        answer_text = ""
        query_type = detect_query_type(question)

        # 2️⃣ Handle count/number queries with exact numbers
        if query_type == "count" and rows and len(rows) == 1 and len(rows[0]) == 1:
            answer_text = str(rows[0][0])

        # 3️⃣ Handle tables
        elif rows and columns:
            if len(rows) == 1 and len(rows[0]) == 1:
                answer_text = f"{columns[0].replace('_',' ').capitalize()}: {rows[0][0]}"
            else:
                header = " | ".join([c.replace("_"," ").capitalize() for c in columns])
                separator = " | ".join(["---"]*len(columns))
                row_lines = [" | ".join([str(v) for v in r]) for r in rows[:50]]
                table_text = "\n".join([header, separator] + row_lines)
                answer_text = table_text
                if len(rows) > 50:
                    answer_text += f"\n\n*Showing first 50 of {len(rows)} rows*"

        # 4️⃣ System prompt for DeepSeek reasoning
        context_history = conversation_memory[session_id][-3:]
        context_text = "\n".join([f"User: {h['question']}\nAI: {h['answer']}" for h in context_history])

        system_prompt = f"""
You are a smart AI assistant for Yelp analytics.
Answer in a {tone} way.

RULES:
- If SQL query returns a single number, give ONLY the number.
- If user asks for table, return table only.
- Max 4-5 lines for explanations.
- Respond naturally and clearly.

Context:
{context_text}

User question: "{question}"
SQL Query: {sql_query}
SQL Result sample: {rows[:10] if rows else 'No rows'}
Columns: {columns}
Query type: {query_type}
"""

        # 5️⃣ Call DeepSeek reasoning (skip if already exact number)
        if not answer_text or query_type != "count":
            ai_response = ask_deepseek_for_reasoning(system_prompt)
            if ai_response:
                answer_text = ai_response

        # 6️⃣ Summarize & CSV
        answer_summary = summarize_answer(answer_text)
        csv_link = rows_to_csv(rows, columns) if rows else None

        # 7️⃣ Update conversation
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
