import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from sql_runner import run_text_to_sql
from deepseek_integration import ask_deepseek_for_reasoning

load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AskRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_ai(payload: AskRequest):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        # 1️⃣ Convert user question into SQL
        result = run_text_to_sql(question)
        rows = result.get("rows")
        columns = result.get("columns")
        sql_query = result.get("sql")
        error = result.get("error")

        # 2️⃣ Format SQL results for readability
        if rows and columns:
            if len(rows) == 1 and len(rows[0]) == 1:
                col_name = columns[0].replace("_", " ").lower()
                answer_text = f"The {col_name} is {rows[0][0]}." \
                    if "count" not in col_name.lower() else f"There are {rows[0][0]} {col_name}."
            else:
                header = " | ".join([c.replace("_"," ").capitalize() for c in columns])
                separator = " | ".join(["---"]*len(columns))
                row_lines = [" | ".join([str(v) for v in r]) for r in rows]
                table_text = "\n".join([header, separator] + row_lines)
                answer_text = table_text
        else:
            answer_text = "No data found."

        # 3️⃣ Build system prompt for natural AI reasoning
        # Only include SQL results, not the full dataset (to save memory)
        system_prompt = f"""
You are a smart, conversational AI assistant for Ridoy's dataset.
User asked: "{question}"

SQL Query executed: {sql_query}
SQL Error (if any): {error}
SQL Result sample: {rows[:10] if rows else 'No rows returned'}
Columns: {columns}

Please respond naturally in full sentences.
- Explain trends, calculations, or insights if applicable.
- Format multi-row results as a Markdown table if needed.
- Keep answers concise and user-friendly for the frontend.
"""

        # 4️⃣ Call AI reasoning engine
        ai_response = ask_deepseek_for_reasoning(system_prompt)
        if ai_response:
            answer_text = ai_response  # override raw table with AI explanation

        return {
            "question": question,
            "answer": answer_text,
            "sql": sql_query,
            "columns": columns,
            "rows": rows,
            "error": error,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
