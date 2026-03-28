import os
import re
from typing import Any, Dict, Optional
import requests
from dotenv import load_dotenv

from database import execute_query
from schema import SCHEMA_DESCRIPTION

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
MAX_SQL_RETRIES = int(os.getenv("MAX_SQL_RETRIES", "3"))

# -------------------------
# Safety rules
# -------------------------
FORBIDDEN_SQL_PATTERNS = [
    r"\bDROP\b", r"\bDELETE\b", r"\bINSERT\b",
    r"\bUPDATE\b", r"\bALTER\b", r"\bTRUNCATE\b",
    r"\bCREATE\b", r"\bGRANT\b", r"\bREVOKE\b",
]

# -------------------------
# Helpers
# -------------------------
def extract_sql(text: str) -> str:
    match = re.search(r"```sql\s*(.*?)```", text, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

def is_safe_sql(sql: str) -> bool:
    sql_upper = sql.upper().strip()

    if not sql_upper.startswith("SELECT"):
        return False

    stripped = sql.strip().rstrip(";")
    if ";" in stripped:
        return False

    for pattern in FORBIDDEN_SQL_PATTERNS:
        if re.search(pattern, sql_upper, re.IGNORECASE):
            return False

    return True

# -------------------------
# DeepSeek call
# -------------------------
def call_deepseek(prompt: str) -> str:
    url = f"{DEEPSEEK_BASE_URL}/chat/completions"

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a PostgreSQL expert. Only return SQL inside ```sql``` block. No explanation."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)

    if resp.status_code != 200:
        raise Exception(f"DeepSeek API error: {resp.status_code}, {resp.text}")

    data = resp.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    if not content:
        raise Exception("Empty response from DeepSeek")

    return extract_sql(content)

# -------------------------
# SQL generation
# -------------------------
def generate_sql(question: str) -> str:
    prompt = f"""
{SCHEMA_DESCRIPTION}

Convert this question into a valid PostgreSQL SELECT query:

{question}
"""

    sql = call_deepseek(prompt)

    if not is_safe_sql(sql):
        raise ValueError(f"Unsafe SQL generated: {sql}")

    return sql

def fix_sql(question: str, bad_sql: str, error: str) -> str:
    prompt = f"""
The SQL query failed.

Question:
{question}

Bad SQL:
{bad_sql}

Error:
{error}

Fix it and return ONLY SQL inside ```sql``` block.
"""

    sql = call_deepseek(prompt)

    if not is_safe_sql(sql):
        raise ValueError("Unsafe corrected SQL")

    return sql

# -------------------------
# Answer generation
# -------------------------
def generate_answer(question: str, rows: list) -> str:
    if not rows:
        return "No data found."

    return f"Query returned {len(rows)} rows."

# -------------------------
# MAIN PIPELINE
# -------------------------
def run_text_to_sql(question: str) -> Dict[str, Any]:
    last_error: Optional[str] = None
    current_sql: Optional[str] = None

    for attempt in range(1, MAX_SQL_RETRIES + 1):
        try:
            if attempt == 1:
                current_sql = generate_sql(question)
            else:
                current_sql = fix_sql(question, current_sql, last_error)

            result = execute_query(current_sql)

            answer = generate_answer(question, result["rows"])

            return {
                "answer": answer,
                "sql": current_sql,
                "columns": result["columns"],
                "rows": result["rows"],
                "error": None,
            }

        except Exception as e:
            last_error = str(e)

    return {
        "answer": "",
        "sql": current_sql or "",
        "columns": [],
        "rows": [],
        "error": last_error,
    }
