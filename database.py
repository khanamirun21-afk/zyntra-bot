import sqlite3
from datetime import datetime

DB = "zyntra.db"

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        zyn INTEGER DEFAULT 0,
        bttc INTEGER DEFAULT 0,
        referrals INTEGER DEFAULT 0,
        referred_by INTEGER,
        last_daily TEXT,
        last_spin TEXT,
        last_farm INTEGER DEFAULT 0,
        tap_count INTEGER DEFAULT 0
    )""")
    conn.commit()
    conn.close()
init_db()

def add_user(user_id, username, first_name, referred_by=None):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE id=?", (user_id,))
    if not c.fetchone():
        if referred_by and referred_by!= user_id:
            c.execute("INSERT INTO users (id, username, first_name, referred_by) VALUES (?,?,?,?)", (user_id, username, first_name, referred_by))
            c.execute("UPDATE users SET zyn = zyn + 100, referrals = referrals + 1 WHERE id=?", (referred_by,))
        else:
            c.execute("INSERT INTO users (id, username, first_name) VALUES (?,?,?)", (user_id, username, first_name))
    conn.commit()
    conn.close()

def get_wallet(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT zyn, bttc FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row if row else (0,0)

def get_referrals(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT referrals FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row[0] if row else 0

def add_zyn(user_id, amount):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("UPDATE users SET zyn = zyn +? WHERE id=?", (amount, user_id))
    conn.commit()
    conn.close()

def can_claim_daily_reward(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT last_daily FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    if not row or not row[0]: return True
    last = datetime.strptime(row[0], "%Y-%m-%d")
    return datetime.now().date() > last.date()

def update_daily_reward(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("UPDATE users SET last_daily=? WHERE id=?", (datetime.now().strftime("%Y-%m-%d"), user_id))
    conn.commit()
    conn.close()

def can_spin(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT last_spin FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    if not row or not row[0]: return True
    last = datetime.strptime(row[0], "%Y-%m-%d")
    return datetime.now().date() > last.date()

def update_lucky_spin(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("UPDATE users SET last_spin=? WHERE id=?", (datetime.now().strftime("%Y-%m-%d"), user_id))
    conn.commit()
    conn.close()

# TAP KE LIYE YE 3 NAYE FUNCTION - Yahi missing the
def add_tap(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("UPDATE users SET zyn = zyn + 1, tap_count = tap_count + 1 WHERE id=?", (user_id,))
    conn.commit()
    conn.close()

def can_show_tap_ad(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT tap_count FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    if not row: return False
    return row[0] % 15 == 0 and row[0]!= 0

def get_tap_count(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT tap_count FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row[0] if row else 0

def get_profile(user_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    conn.close()
    return row

def get_leaderboard():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT first_name, zyn FROM users ORDER BY zyn DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()
    return rows
