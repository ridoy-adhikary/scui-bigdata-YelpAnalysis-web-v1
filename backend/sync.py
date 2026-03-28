import os
from pyhive import hive
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# ── CONNECTION SETTINGS ─────────────────────────────────────────────
HIVE_HOST = "localhost"
HIVE_PORT = 10000
HIVE_DB   = "default"

PG_HOST   = "127.0.0.1"
PG_PORT   = 5432
PG_DB     = "yelp_db"
PG_USER   = "postgres"
PG_PASS   = "ridoy127"

BATCH = 5000


# ── TABLE CONFIG ────────────────────────────────────────────────────
TABLES = [
    ("business", "business",
     """SELECT business_id, name, city, state, stars,
               review_count, is_open, categories,
               latitude, longitude
        FROM {table}""",
     "business_id"),

    ("review", "review",
     """SELECT review_id, rev_user_id, rev_business_id,
               rev_stars, rev_text, rev_date
        FROM {table}""",
     "review_id"),

    ("users", "users",
     """SELECT user_id, user_name, user_review_count, user_yelping_since,
               user_friends, user_useful, user_funny, user_cool, user_fans,
               user_elite, user_average_stars,
               user_compliment_hot, user_compliment_more,
               user_compliment_profile, user_compliment_cute,
               user_compliment_list, user_compliment_note,
               user_compliment_plain, user_compliment_cool,
               user_compliment_funny, user_compliment_writer,
               user_compliment_photos
        FROM {table}""",
     "user_id"),

    ("checkin", "checkin",
     """SELECT business_id, checkin_dates
        FROM {table}""",
     "business_id"),

    ("tip", "tip",
     """SELECT user_id, business_id, text, `date`, compliment_count
        FROM {table}""",
     None),  # TIP has composite unique key, handled separately
]


# ── CONNECTIONS ─────────────────────────────────────────────────────
def hive_conn():
    return hive.Connection(
        host=HIVE_HOST,
        port=HIVE_PORT,
        database=HIVE_DB,
        auth="NONE"
    )

def pg_conn():
    return psycopg2.connect(
        host=PG_HOST,
        port=PG_PORT,
        dbname=PG_DB,
        user=PG_USER,
        password=PG_PASS
    )


# ── CHECK IF TABLE HAS DATA ─────────────────────────────────────────
def table_has_data(pcur, table):
    try:
        pcur.execute(f"SELECT COUNT(*) FROM {table}")
        return pcur.fetchone()[0] > 0
    except:
        return False


# ── GET LAST TIP DATE (AUTO INCREMENTAL) ─────────────────────────────
def get_last_tip_date(pcur):
    try:
        pcur.execute("SELECT MAX(date) FROM tip")
        result = pcur.fetchone()[0]
        return result
    except:
        return None


# ── FIND TABLE DATABASE ─────────────────────────────────────────────
def find_table_db(hcur, table_name):
    hcur.execute("SHOW DATABASES")
    dbs = [row[0] for row in hcur.fetchall()]

    for db in dbs:
        try:
            hcur.execute(f"SHOW TABLES IN {db}")
            tables = [row[0] for row in hcur.fetchall()]
            if table_name in tables:
                return db
        except:
            continue
    return None


# ── ENSURE UNIQUE CONSTRAINT FOR TIP ────────────────────────────────
def ensure_tip_unique_constraint(pcur):
    try:
        # Only create if not exists
        pcur.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 
                FROM pg_constraint 
                WHERE conname = 'unique_tip'
            ) THEN
                ALTER TABLE tip
                ADD CONSTRAINT unique_tip UNIQUE (user_id, business_id, date);
            END IF;
        END$$;
        """)
    except Exception as e:
        print(f"  ❌ Error ensuring unique constraint: {e}")


# ── INSERT FUNCTION ─────────────────────────────────────────────────
def batch_insert(cur, table, cols, rows, pk=None):
    placeholders = ", ".join(["%s"] * len(cols))

    if pk:
        sql = f"""
        INSERT INTO {table} ({', '.join(cols)})
        VALUES ({placeholders})
        ON CONFLICT ({pk}) DO NOTHING
        """
    else:
        sql = f"""
        INSERT INTO {table} ({', '.join(cols)})
        VALUES ({placeholders})
        ON CONFLICT DO NOTHING
        """

    cur.executemany(sql, rows)


# ── MAIN SYNC ───────────────────────────────────────────────────────
def sync():
    print("Connecting to Hive…")
    hc = hive_conn()
    hcur = hc.cursor()

    print("Connecting to PostgreSQL…")
    pc = pg_conn()
    pcur = pc.cursor()

    for hive_table, pg_table, hive_sql, pk in TABLES:
        print(f"\n── Syncing {hive_table} → {pg_table} ──")

        # ✅ Skip already completed tables (except tip)
        if table_has_data(pcur, pg_table) and hive_table != "tip":
            print(f"  ⏩ Skipping {pg_table} (already done)")
            continue

        db = find_table_db(hcur, hive_table)
        if not db:
            print(f"  ❌ Table {hive_table} not found")
            continue

        full_table = f"`{db}`.`{hive_table}`"
        print(f"  ✅ Found in: {full_table}")

        # 🔥 Special logic for TIP (auto incremental)
        if hive_table == "tip":
            ensure_tip_unique_constraint(pcur)
            last_date = get_last_tip_date(pcur)
            if last_date:
                print(f"  ⏩ Loading only new TIP after {last_date}")
                hive_sql = f"""
                SELECT user_id, business_id, text, `date`, compliment_count
                FROM {full_table}
                WHERE `date` > '{last_date}'
                  AND user_id IS NOT NULL AND user_id != ''
                  AND business_id IS NOT NULL AND business_id != ''
                  AND `date` IS NOT NULL
                """
            else:
                print("  ⚠️ First time loading tip → using LIMIT")
                hive_sql = f"""
                SELECT user_id, business_id, text, `date`, compliment_count
                FROM {full_table}
                WHERE user_id IS NOT NULL AND user_id != ''
                  AND business_id IS NOT NULL AND business_id != ''
                  AND `date` IS NOT NULL
                LIMIT 100000
                """

        try:
            hcur.execute(hive_sql.format(table=full_table))
        except Exception as e:
            print(f"  ❌ Hive error: {e}")
            continue

        cols = [d[0].split(".")[-1] for d in hcur.description]

        total = 0
        while True:
            rows = hcur.fetchmany(BATCH)
            if not rows:
                break

            total += len(rows)

            try:
                batch_insert(pcur, pg_table, cols, rows, pk)
                pc.commit()
            except Exception as e:
                pc.rollback()
                print(f"  ❌ Insert error: {e}")
                break

            print(f"  Processed {total} rows...")

        print(f"  ✅ Done {pg_table}, total processed {total}")

    hc.close()
    pc.close()
    print("\n🎉 Sync complete!")


if __name__ == "__main__":
    sync()
