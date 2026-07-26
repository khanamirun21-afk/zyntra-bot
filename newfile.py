import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

TOKEN = os.environ["TOKEN"]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("🎮 Play Games", callback_data="games")],
        [InlineKeyboardButton("💰 Wallet", callback_data="wallet")],
        [InlineKeyboardButton("👤 Profile", callback_data="profile")],
        [InlineKeyboardButton("👥 Referral", callback_data="referral")],
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "🚀 Welcome to Zyntra!\n\nChoose an option:",
        reply_markup=reply_markup,
    )


async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    messages = {
        "games": "🎮 Games section is coming soon!",
        "wallet": "💰 Wallet section is coming soon!",
        "profile": "👤 Profile section is coming soon!",
        "referral": "👥 Referral section is coming soon!",
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
