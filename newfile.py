import os
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

from handlers import home_menu

TOKEN = os.environ["TOKEN"]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    reply_markup = await home_menu(update, context)

    await update.message.reply_text(
        "🚀 Welcome to Zyntra!\n\nChoose an option:",
        reply_markup=reply_markup,
    )


async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    messages = {
        "play": "🎮 Play section is coming soon!",
        "wallet": "💰 Wallet section is coming soon!",
        "profile": "👤 Profile section is coming soon!",
        "referral": "👥 Referral section is coming soon!",
        "tasks": "📋 Tasks section is coming soon!",
        "leaderboard": "🏆 Leaderboard section is coming soon!",
        "settings": "⚙️ Settings section is coming soon!",
    }

    await query.edit_message_text(messages.get(query.data, "Unknown option"))


def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button))

    print("✅ Zyntra Bot Started...")
    app.run_polling()


if __name__ == "__main__":
    main()
