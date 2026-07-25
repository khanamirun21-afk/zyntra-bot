import os
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = os.environ["TOKEN"]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🚀 Welcome to Zyntra!")

async def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("✅ Zyntra Bot Started...")
    await app.run_polling()

if __name__ == "__main__":
    asyncio.run(main())
    
