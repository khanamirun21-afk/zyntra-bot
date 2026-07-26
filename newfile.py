import os
import json
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = os.environ["TOKEN"]
DB_FILE = "users.json"

def load_users():
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    with open(DB_FILE, "w") as f:
        json.dump(users, f)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    users = load_users()

    user_id = str(update.effective_user.id)

    if user_id not in users:
        users[user_id] = {
            "name": update.effective_user.first_name,
            "balance": 0
        }
        save_users(users)

    await update.message.reply_text("🚀 Welcome to Zyntra!")

app = Application.builder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.run_polling()
