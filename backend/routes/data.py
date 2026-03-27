from fastapi import APIRouter, HTTPException

from database import execute_query, execute_scalar

router = APIRouter(prefix="/api/data", tags=["data"])


@router.get("/summary")
def get_summary():
    try:
        total_businesses = execute_scalar("SELECT COUNT(*) FROM business;")
        avg_stars = execute_scalar("SELECT ROUND(AVG(stars)::numeric, 2) FROM business;")
        total_reviews = execute_scalar("SELECT COUNT(*) FROM review;")
        total_users = execute_scalar("SELECT COUNT(*) FROM users;")

        return {
            "total_businesses": total_businesses or 0,
            "avg_stars": float(avg_stars or 0),
            "total_reviews": total_reviews or 0,
            "total_users": total_users or 0,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/sales")
def get_sales():
    try:
        sql = """
        SELECT city, COUNT(*) AS business_count
        FROM business
        WHERE city IS NOT NULL AND city <> ''
        GROUP BY city
        ORDER BY business_count DESC
        LIMIT 20;
        """
        return execute_query(sql)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/daily")
def get_daily():
    try:
        sql = """
        SELECT rev_date, COUNT(*) AS review_count
        FROM review
        WHERE rev_date IS NOT NULL
        GROUP BY rev_date
        ORDER BY rev_date DESC
        LIMIT 30;
        """
        result = execute_query(sql)
        result["rows"] = list(reversed(result["rows"]))
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/products")
def get_products():
    try:
        sql = """
        SELECT name, city, review_count, stars
        FROM business
        WHERE name IS NOT NULL
        ORDER BY review_count DESC
        LIMIT 20;
        """
        return execute_query(sql)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
