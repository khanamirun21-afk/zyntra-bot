from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):

    user = update.effective_user
    first_name = user.first_name or "Friend"

    welcome_text = f"""
🚀 <b>WELCOME TO ZYNTRA NETWORK</b> 🚀

Hey <b>{first_name}</b>! 👋

Welcome to <b>Zyntra</b> — your digital rewards network. 🌐

🎯 <b>What can you do?</b>

📺 Watch Ads & Earn Rewards
📋 Complete Daily Tasks
🎁 Collect Daily Rewards
👥 Invite Friends
🏆 Participate in Future Events
💰 Manage Your Rewards

━━━━━━━━━━━━━━━━━━

🔥 <b>YOUR JOURNEY STARTS HERE!</b>

Open Zyntra and start exploring the platform.

⚡ More exciting features are coming soon!

━━━━━━━━━━━━━━━━━━

💜 <b>Thank you for joining Zyntra!</b>
"""

    keyboard = [
        [
            InlineKeyboardButton(
                "🚀 OPEN ZYNTRA",
                url="https://zyntra-bot.vercel.app/"
            )
        ],
        [
            InlineKeyboardButton(
                "📋 TASKS",
                callback_data="tasks"
            ),
            InlineKeyboardButton(
                "💰 WALLET",
                callback_data="wallet"
            )
        ],
        [
            InlineKeyboardButton(
                "👥 INVITE FRIENDS",
                callback_data="invite"
            )
        ],
        [
            InlineKeyboardButton(
                "ℹ️ ABOUT ZYNTRA",
                callback_data="about"
            )
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        welcome_text,
        parse_mode="HTML",
        reply_markup=reply_markup
    )
