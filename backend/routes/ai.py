import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from sql_runner import run_text_to_sql
from deepseek_integration import ask_deepseek_for_reasoning  # we'll call AI to reason over SQL results

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
        # 1️⃣ Generate SQL using DeepSeek
        result = run_text_to_sql(question)
        rows = result.get("rows")
        columns = result.get("columns")

        # 2️⃣ Format multi-row data into Markdown table
        if rows and columns:
            if len(rows) == 1 and len(rows[0]) == 1:
                col_name = columns[0].replace("_", " ").lower()
                answer_text = f"The {col_name} is {rows[0][0]}." \
                    if "count" not in col_name.lower() else f"There are {rows[0][0]} {col_name}."
            else:
                # Markdown-style table
                header = " | ".join([c.replace("_"," ").capitalize() for c in columns])
                separator = " | ".join(["---"]*len(columns))
                row_lines = [" | ".join([str(v) for v in r]) for r in rows]
                table_text = "\n".join([header, separator] + row_lines)
                answer_text = table_text
        else:
            # 3️⃣ If SQL result empty, fallback to AI reasoning
            answer_text = result.get("answer", "")

        # 4️⃣ Send SQL + rows back to DeepSeek to generate natural explanation
        reasoning_prompt = f"""
You are a data asistent created by Ridoy.
The user asked: "{question}"
SQL result: {rows}
Columns: {columns}

Please generate a readable answer in full sentences. 
- Explain trends, calculations, or insights if applicable.
- Format multi-row results as a Markdown table if needed.
"""
        ai_reasoning = ask_deepseek_for_reasoning(reasoning_prompt)
        if ai_reasoning:
            answer_text = ai_reasoning  # override raw table with AI explanation

        return {
            "question": question,
            "answer": answer_text,
            "sql": result.get("sql"),
            "columns": result.get("columns"),
            "rows": result.get("rows"),
            "error": result.get("error"),
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
