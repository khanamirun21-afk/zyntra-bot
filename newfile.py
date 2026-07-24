import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Token Render Environment Variable se aayega
TOKEN = os.environ["TOKEN"]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🚀 Welcome to Zyntra!")

def main():
    app = Application.builder().token(TOKEN).build()

    # /start command
    app.add_handler(CommandHandler("start", start))

    print("✅ Zyntra Bot Started...")
    app.run_polling()

if __name__ == "__main__":
    main()
