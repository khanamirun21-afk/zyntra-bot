import os

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    CallbackQueryHandler,
)


# =========================
# BOT TOKEN
# =========================

TOKEN = os.environ.get("TOKEN")

if not TOKEN:
    raise RuntimeError("TOKEN environment variable missing")


# =========================
# /START
# =========================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    user = update.effective_user
    name = user.first_name or "Friend"

    text = f"""
🚀 <b>WELCOME TO ZYNTRA NETWORK</b> 🚀

Hey <b>{name}</b>! 👋

Welcome to <b>Zyntra</b> — your digital rewards network. 🌐

🎯 <b>Explore Zyntra</b>

📺 Watch Ads & Earn Rewards
📋 Complete Daily Tasks
🎁 Collect Rewards
👥 Invite Friends
🏆 Future Events & Games
💰 Manage Your Rewards

━━━━━━━━━━━━━━━━━━

🔥 <b>YOUR JOURNEY STARTS HERE!</b>

Tap <b>OPEN ZYNTRA</b> below to enter the platform.

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

    await update.message.reply_text(
        text,
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )


# =========================
# BUTTONS
# =========================

async def buttons(update: Update, context: ContextTypes.DEFAULT_TYPE):

    query = update.callback_query
    await query.answer()

    if query.data == "tasks":

        await query.message.reply_text(
            "📋 <b>ZYNTRA TASKS</b>\n\n"
            "📺 Watch Ads → Earn Rewards\n"
            "🎁 Daily Rewards\n"
            "📱 Social Tasks\n"
            "👥 Invite Friends\n\n"
            "🚀 More tasks coming soon!",
            parse_mode="HTML"
        )

    elif query.data == "wallet":

        await query.message.reply_text(
            "💰 <b>ZYNTRA WALLET</b>\n\n"
            "Your rewards wallet is available inside Zyntra.\n\n"
            "👇 Tap below to open Zyntra.",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup([
                [
                    InlineKeyboardButton(
                        "🚀 OPEN ZYNTRA",
                        url="https://zyntra-bot.vercel.app/"
                    )
                ]
            ])
        )

    elif query.data == "invite":

        await query.message.reply_text(
            "👥 <b>INVITE FRIENDS</b>\n\n"
            "Invite your friends to Zyntra and grow your network. 🚀\n\n"
            "Open Zyntra to get your invite link.",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup([
                [
                    InlineKeyboardButton(
                        "🚀 OPEN ZYNTRA",
                        url="https://zyntra-bot.vercel.app/"
                    )
                ]
            ])
        )

    elif query.data == "about":

        await query.message.reply_text(
            "ℹ️ <b>ABOUT ZYNTRA</b>\n\n"
            "Zyntra is a digital rewards platform focused on "
            "tasks, ads and community features.\n\n"
            "🚀 More features are currently being developed.\n\n"
            "💜 Welcome to the Zyntra community!",
            parse_mode="HTML"
        )


# =========================
# START BOT
# =========================

def main():

    app = Application.builder().token(TOKEN).build()

    app.add_handler(
        CommandHandler("start", start)
    )

    app.add_handler(
        CallbackQueryHandler(buttons)
    )

    print("🚀 Zyntra Bot Started!")

    app.run_polling()


if __name__ == "__main__":
    main()
