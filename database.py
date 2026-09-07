import sqlite3, time
from datetime import datetime
DB = "zyntra.db"

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY, username TEXT, first_name TEXT,
        zyn INTEGER DEFAULT 0, bttc INTEGER DEFAULT 0,
        referrals INTEGER DEFAULT 0, referred_by INTEGER,
        last_daily TEXT, last_spin TEXT,
        last_farm INTEGER DEFAULT 0, farm_amount INTEGER DEFAULT 0,
        tap_count INTEGER DEFAULT 0)""")
    conn.commit()
    conn.close()
init_db()

def add_user(uid, un, fn, referred_by=None):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT id FROM users WHERE id=?",(uid,))
    if not c.fetchone():
        if referred_by and referred_by!=uid:
            c.execute("INSERT INTO users (id, username, first_name, referred_by) VALUES (?,?,?,?)",(uid,un,fn,referred_by))
            c.execute("UPDATE users SET zyn=zyn+100, referrals=referrals+1 WHERE id=?",(referred_by,))
        else:
            c.execute("INSERT INTO users (id, username, first_name) VALUES (?,?,?)",(uid,un,fn))
    conn.commit();conn.close()

def get_wallet(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT zyn, bttc FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r if r else (0,0)

def get_referrals(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT referrals FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r[0] if r else 0

def add_zyn(uid, amt):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("UPDATE users SET zyn=zyn+? WHERE id=?",(amt,uid))
    conn.commit();conn.close()

def can_claim_daily_reward(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT last_daily FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return True if not r or not r[0] else datetime.now().strftime("%Y-%m-%d")!=r[0]

def update_daily_reward(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("UPDATE users SET last_daily=? WHERE id=?",(datetime.now().strftime("%Y-%m-%d"),uid))
    conn.commit();conn.close()

def can_spin(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT last_spin FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return True if not r or not r[0] else datetime.now().strftime("%Y-%m-%d")!=r[0]

def update_lucky_spin(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("UPDATE users SET last_spin=? WHERE id=?",(datetime.now().strftime("%Y-%m-%d"),uid))
    conn.commit();conn.close()

# TAP
def add_tap(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("UPDATE users SET zyn=zyn+1, tap_count=tap_count+1 WHERE id=?",(uid,))
    conn.commit();conn.close()

def can_show_tap_ad(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT tap_count FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r and r[0]%15==0 and r[0]!=0

def get_tap_count(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT tap_count FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r[0] if r else 0

# FARMING - SARE NAAM KA ALIAS
def start_farming(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("UPDATE users SET last_farm=?, farm_amount=100 WHERE id=?",(int(time.time()),uid))
    conn.commit();conn.close()

def get_farming_status(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT last_farm, farm_amount FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r if r else (0,0)

def get_farming(uid): # yehi missing tha
    return get_farming_status(uid)

def can_claim_farming(uid):
    last,_=get_farming_status(uid)
    return False if last==0 else int(time.time())-last>=21600

def claim_farming(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT farm_amount FROM users WHERE id=?",(uid,))
    amt=c.fetchone()[0]
    c.execute("UPDATE users SET zyn=zyn+?, last_farm=0, farm_amount=0 WHERE id=?",(amt,uid))
    conn.commit();conn.close()
    return amt

def get_profile(uid):
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT * FROM users WHERE id=?",(uid,))
    r=c.fetchone();conn.close()
    return r

def get_leaderboard():
    conn=sqlite3.connect(DB);c=conn.cursor()
    c.execute("SELECT first_name, zyn FROM users ORDER BY zyn DESC LIMIT 10")
    r=c.fetchall();conn.close()
    return r
