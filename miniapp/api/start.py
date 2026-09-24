from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):

    message = """
🚀 WELCOME TO ZYNTRA NETWORK!

Hey 👋 Welcome to Zyntra!

🎯 Watch Ads & Earn Rewards
📋 Complete Daily Tasks
👥 Invite Friends
💰 Manage Your Rewards
🏆 More Features Coming Soon

🔥 Your Zyntra journey starts here!

Tap the button below to open Zyntra 👇
"""

    keyboard = [
        [
            InlineKeyboardButton(
                "🚀 OPEN ZYNTRA",
                url="https://zyntra-bot.vercel.app/"
            )
        ],
        [
            InlineKeyboardButton("📋 Tasks", callback_data="tasks"),
            InlineKeyboardButton("💰 Wallet", callback_data="wallet")
        ],
        [
            InlineKeyboardButton("👥 Invite Friends", callback_data="invite")
        ],
        [
            InlineKeyboardButton("ℹ️ About Zyntra", callback_data="about")
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        message,
        reply_markup=reply_markup
    )
