import sqlite3
from datetime import datetime

conn = sqlite3.connect("zyntra.db", check_same_thread=False)
cursor = conn.cursor()

# Users Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    name TEXT,
    referrals INTEGER DEFAULT 0,
    referred_by INTEGER DEFAULT NULL
)
""")

# Wallet Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS wallet (
    user_id INTEGER PRIMARY KEY,
    zyn INTEGER DEFAULT 0,
    bttc REAL DEFAULT 0,
    last_daily_reward TEXT DEFAULT NULL,
    last_lucky_spin TEXT DEFAULT NULL,
    farming_start TEXT DEFAULT NULL,
    farming_claim TEXT DEFAULT NULL,
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


# ---------- Daily Reward ----------

def update_daily_reward(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")

    cursor.execute(
        "UPDATE wallet SET last_daily_reward=? WHERE user_id=?",
        (today, user_id),
    )

    conn.commit()


def get_last_daily_reward(user_id):
    cursor.execute(
        "SELECT last_daily_reward FROM wallet WHERE user_id=?",
        (user_id,),
    )

    row = cursor.fetchone()

    if row:
        return row[0]

    return None


def can_claim_daily_reward(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")

    last = get_last_daily_reward(user_id)

    return last != today


# ---------- Referral System ----------

def add_referral(referrer_id):
    cursor.execute(
        "UPDATE users SET referrals = referrals + 1 WHERE user_id=?",
        (referrer_id,),
    )
    conn.commit()


def get_referrals(user_id):
    cursor.execute(
        "SELECT referrals FROM users WHERE user_id=?",
        (user_id,),
    )

    row = cursor.fetchone()

    if row:
        return row[0]

    return 0


def set_referred_by(user_id, referrer_id):
    cursor.execute(
        "UPDATE users SET referred_by=? WHERE user_id=?",
        (referrer_id, user_id),
    )
    conn.commit()


def get_referred_by(user_id):
    cursor.execute(
        "SELECT referred_by FROM users WHERE user_id=?",
        (user_id,),
    )

    row = cursor.fetchone()

    if row:
        return row[0]

    return None


# ---------- Lucky Spin ----------

def update_lucky_spin(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")

    cursor.execute(
        "UPDATE wallet SET last_lucky_spin=? WHERE user_id=?",
        (today, user_id),
    )

    conn.commit()


def get_last_lucky_spin(user_id):
    cursor.execute(
        "SELECT last_lucky_spin FROM wallet WHERE user_id=?",
        (user_id,),
    )

    row = cursor.fetchone()

    if row:
        return row[0]

    return None


def can_spin(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")

    last = get_last_lucky_spin(user_id)

    return last != today


# ---------- Farming ----------

def start_farming(user_id, start_time, claim_time):
    cursor.execute(
        "UPDATE wallet SET farming_start=?, farming_claim=? WHERE user_id=?",
        (start_time, claim_time, user_id),
    )
    conn.commit()


def get_farming(user_id):
    cursor.execute(
        "SELECT farming_start, farming_claim FROM wallet WHERE user_id=?",
        (user_id,),
    )
    return cursor.fetchone()


def reset_farming(user_id):
    cursor.execute(
        "UPDATE wallet SET farming_start=NULL, farming_claim=NULL WHERE user_id=?",
        (user_id,),
    )
    conn.commit()
