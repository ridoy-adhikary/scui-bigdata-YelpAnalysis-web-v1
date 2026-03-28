import os
from pathlib import Path
from typing import Any, Dict

from dotenv import load_dotenv
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import RealDictCursor

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

DB_HOST = os.getenv("POSTGRES_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "yelp_db")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "")
MAX_RETURN_ROWS = int(os.getenv("MAX_RETURN_ROWS", "500"))

pool = None


def init_db_pool():
    global pool
    if pool is None:
        if not DB_PASSWORD:
            raise ValueError("POSTGRES_PASSWORD is empty inside database.py")

        pool = SimpleConnectionPool(
            1,
            10,
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
        )


def close_db_pool():
    global pool
    if pool is not None:
        pool.closeall()
        pool = None


def execute_query(sql: str) -> Dict[str, Any]:
    global pool
    if pool is None:
        init_db_pool()

    conn = None
    try:
        conn = pool.getconn()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql)

            if cur.description is None:
                conn.commit()
                return {"columns": [], "rows": [], "row_count": 0}

            rows_raw = cur.fetchmany(MAX_RETURN_ROWS)
            columns = [desc.name for desc in cur.description]
            rows = [[row.get(col) for col in columns] for row in rows_raw]

            return {
                "columns": columns,
                "rows": rows,
                "row_count": len(rows),
            }
    finally:
        if conn is not None:
            pool.putconn(conn)


def execute_scalar(sql: str):
    global pool
    if pool is None:
        init_db_pool()

    conn = None
    try:
        conn = pool.getconn()
        with conn.cursor() as cur:
            cur.execute(sql)
            result = cur.fetchone()
            return result[0] if result else None
    finally:
        if conn is not None:
            pool.putconn(conn)
