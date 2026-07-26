import sqlite3

conn = sqlite3.connect("zyntra.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    name TEXT,
    balance INTEGER DEFAULT 0,
    referrals INTEGER DEFAULT 0
)
""")

conn.commit()
conn.close()
