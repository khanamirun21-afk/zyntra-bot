import sqlite3

conn = sqlite3.connect("zyntra.db", check_same_thread=False)
cursor = conn.cursor()

# Users Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    name TEXT,
    referrals INTEGER DEFAULT 0
)
""")

# Wallet Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS wallet (
    user_id INTEGER PRIMARY KEY,
    zyn INTEGER DEFAULT 0,
    bttc REAL DEFAULT 0,
    last_daily_reward TEXT DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)
""")

conn.commit()


def add_user(user_id, username, name):
    cursor.execute(
        "INSERT OR IGNORE INTO users (user_id, username, name) VALUES (?, ?, ?)",
        (user_id, username, name),
    )

    cursor.execute(
        "INSERT OR IGNORE INTO wallet (user_id) VALUES (?)",
        (user_id,),
    )

    conn.commit()


def get_wallet(user_id):
    cursor.execute(
        "SELECT zyn, bttc FROM wallet WHERE user_id=?",
        (user_id,),
    )
    return cursor.fetchone()


def add_zyn(user_id, amount):
    cursor.execute(
        "UPDATE wallet SET zyn = zyn + ? WHERE user_id=?",
        (amount, user_id),
    )
    conn.commit()


def update_daily_reward(user_id, date):
    cursor.execute(
        "UPDATE wallet SET last_daily_reward=? WHERE user_id=?",
        (date, user_id),
    )
    conn.commit()


def get_last_daily_reward(user_id):
    cursor.execute(
        "SELECT last_daily_reward FROM wallet WHERE user_id=?",
        (user_id,),
    )
    row = cursor.fetchone()
    return row[0] if row else None
