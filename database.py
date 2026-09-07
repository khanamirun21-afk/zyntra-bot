import sqlite3
from datetime import datetime

conn = sqlite3.connect("zyntra.db", check_same_thread=False)
cursor = conn.cursor()

# ---------- Users Table ----------
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    name TEXT,
    referrals INTEGER DEFAULT 0,
    referred_by INTEGER DEFAULT NULL
)
""")

# ---------- Wallet Table ----------
cursor.execute("""
CREATE TABLE IF NOT EXISTS wallet (
    user_id INTEGER PRIMARY KEY,
    zyn INTEGER DEFAULT 0,
    bttc REAL DEFAULT 0,
    last_daily_reward TEXT DEFAULT NULL,
    last_lucky_spin TEXT DEFAULT NULL,
    farming_start TEXT DEFAULT NULL,
    farming_claim TEXT DEFAULT NULL,
    taps INTEGER DEFAULT 0,
    ads_watched INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)
""")

# ---------- Missions Table ----------
cursor.execute("""
CREATE TABLE IF NOT EXISTS mission_claims (
    user_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    claimed INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, mission_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)
""")

# ---------- Social Tasks Tables ----------
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY,
    title TEXT,
    link TEXT,
    reward INTEGER,
    type TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS task_claims (
    user_id INTEGER,
    task_id INTEGER,
    claimed INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, task_id)
)
""")

# ---------- Migration ----------
def add_column_if_missing(table, column, definition):
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [row[1] for row in cursor.fetchall()]
    if column not in columns:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")

add_column_if_missing("wallet", "taps", "INTEGER DEFAULT 0")
add_column_if_missing("wallet", "ads_watched", "INTEGER DEFAULT 0")
conn.commit()

# ---------- Default Tasks With YOUR LINKS ----------
cursor.execute("SELECT COUNT(*) FROM tasks")
if cursor.fetchone()[0] == 0:
    default_tasks = [
        (1, "📢 Join Telegram Channel", "https://t.me/ZyntraBotOfficial", 200, "telegram"),
        (2, "🐦 Follow on Twitter", "https://x.com/FaisalKhan9h7", 200, "twitter"),
        (3, "▶️ Subscribe YouTube", "https://www.youtube.com/@ZyntraEarn", 300, "youtube"),
        (4, "📸 Follow Instagram", "https://www.instagram.com/zyntra_official_bot", 200, "instagram")
    ]
    cursor.executemany("INSERT INTO tasks (task_id, title, link, reward, type) VALUES (?,?,?,?,?)", default_tasks)
    conn.commit()

# ---------- User System ----------
def add_user(user_id, username, name):
    cursor.execute("INSERT OR IGNORE INTO users (user_id, username, name) VALUES (?,?,?)", (user_id, username, name))
    cursor.execute("INSERT OR IGNORE INTO wallet (user_id) VALUES (?)", (user_id,))
    conn.commit()

# ---------- Wallet ----------
def get_wallet(user_id):
    cursor.execute("SELECT zyn, bttc FROM wallet WHERE user_id=?", (user_id,))
    return cursor.fetchone()

def add_zyn(user_id, amount):
    cursor.execute("UPDATE wallet SET zyn = zyn +? WHERE user_id=?", (amount, user_id))
    conn.commit()

# ---------- Tap System ----------
def add_tap(user_id):
    cursor.execute("UPDATE wallet SET taps = taps + 1 WHERE user_id=?", (user_id,))
    conn.commit()
    cursor.execute("SELECT taps FROM wallet WHERE user_id=?", (user_id,))
    row = cursor.fetchone()
    return row[0] if row else 0

def get_taps(user_id):
    cursor.execute("SELECT taps FROM wallet WHERE user_id=?", (user_id,))
    row = cursor.fetchone()
    return row[0] if row else 0

# ---------- Ad Counter ----------
def get_ads_watched(user_id):
    cursor.execute("SELECT ads_watched FROM wallet WHERE user_id=?", (user_id,))
    row = cursor.fetchone()
    return row[0] if row else 0

def add_ad_watched(user_id):
    cursor.execute("UPDATE wallet SET ads_watched = ads_watched + 1 WHERE user_id=?", (user_id,))
    conn.commit()

def can_show_tap_ad(user_id):
    taps = get_taps(user_id)
    return taps > 0 and taps % 1000 == 0

# ---------- Tap Missions ----------
MISSIONS = [
    (1, "🌱 Tap Beginner", 5, 100),
    (2, "⚡ Tap Starter", 100, 1000),
    (3, "🔥 Tap Warrior", 1000, 10000),
    (4, "💎 Tap Master", 10000, 100000),
    (5, "👑 Tap Legend", 100000, 1000000),
    (6, "🚀 Tap Champion", 500000, 5000000),
    (7, "🌟 Tap Hero", 1000000, 10000000),
    (8, "🏆 Tap King", 5000000, 50000000),
    (9, "💫 Tap Titan", 10000000, 100000000),
    (10, "👑🔥 Zyntra God", 50000000, 500000000),
    (11, "☠️ Zyntra Immortal", 100000000, 1000000000),
]

def get_missions():
    return MISSIONS

def is_mission_claimed(user_id, mission_id):
    cursor.execute("SELECT claimed FROM mission_claims WHERE user_id=? AND mission_id=?", (user_id, mission_id))
    row = cursor.fetchone()
    return row and row[0]==1

def claim_mission(user_id, mission_id):
    if is_mission_claimed(user_id, mission_id):
        return False
    mission = next((x for x in MISSIONS if x[0]==mission_id), None)
    if not mission:
        return False
    _, name, required_taps, reward = mission
    if get_taps(user_id) < required_taps:
        return False
    cursor.execute("INSERT OR REPLACE INTO mission_claims (user_id, mission_id, claimed) VALUES (?,?,1)", (user_id, mission_id))
    cursor.execute("UPDATE wallet SET zyn = zyn +? WHERE user_id=?", (reward, user_id))
    conn.commit()
    return True

# ---------- Daily Reward ----------
def update_daily_reward(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    cursor.execute("UPDATE wallet SET last_daily_reward=? WHERE user_id=?", (today, user_id))
    conn.commit()

def get_last_daily_reward(user_id):
    cursor.execute("SELECT last_daily_reward FROM wallet WHERE user_id=?", (user_id,))
    row = cursor.fetchone()
    return row[0] if row else None

def can_claim_daily_reward(user_id):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    return get_last_daily_reward(user_id)!= today

# ---------- Referral System ----------
def add_referral(referrer_id):
    cursor.execute("UPDATE users SET referrals = referrals + 1 WHERE user_id=?", (referrer_id,))
    conn.commit()

def get_referrals(user_id):
    cursor.execute("SELECT referrals FROM users WHERE user_id=?", (user_id,))
    row = cursor.fetchone()
    return row[0] if row else
