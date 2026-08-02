import os
import random
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

from handlers import home_menu, play_menu
from database import (
    add_user,
    get_wallet,
    get_referrals,
    add_zyn,
    can_claim_daily_reward,
    update_daily_reward,
    can_spin,
    update_lucky_spin,
)
from tap import tap

TOKEN = os.environ["TOKEN"]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user

    add_user(
        user.id,
        user.username,
        user.first_name,
    )

    await update.message.reply_text(
        "🚀 Welcome to Zyntra!\n\nChoose an option:",
        reply_markup=await home_menu(update, context),
    )


async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "play":
        await query.edit_message_text(
            "🎮 Zyntra Game Hub\n\nChoose a game:",
            reply_markup=await play_menu(update, context),
        )

    elif query.data == "home":
        await query.edit_message_text(
            "🏠 Home Menu",
            reply_markup=await home_menu(update, context),
        )

    elif query.data == "wallet":
        wallet = get_wallet(query.from_user.id)

        if wallet:
            zyn, bttc = wallet
        else:
            zyn, bttc = (0, 0)

        await query.edit_message_text(
            f"""💰 Zyntra Wallet

🪙 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

🎁 Daily Reward
💸 Withdraw (Coming Soon)

⬅️ Type /start to go back
"""
        )

    elif query.data == "profile":
        await query.edit_message_text("👤 Profile (Coming Soon)")

    elif query.data == "referral":
        referrals = get_referrals(query.from_user.id)

        bot_username = (await context.bot.get_me()).username
        link = f"https://t.me/{bot_username}?start={query.from_user.id}"

        await query.edit_message_text(
            f"""👥 Referral System

🔗 Your Referral Link:

{link}

👤 Total Referrals: {referrals}

🎁 Reward:
100 ZYN per referral

Share your link and earn! 🚀
"""
        )

    elif query.data == "tasks":
        await query.edit_message_text("📋 Tasks (Coming Soon)")

    elif query.data == "leaderboard":
        await query.edit_message_text("🏆 Leaderboard (Coming Soon)")

    elif query.data == "settings":
        await query.edit_message_text("⚙️ Settings (Coming Soon)")

    elif query.data == "tap":
        await tap(query)

    elif query.data == "daily_reward":

        if can_claim_daily_reward(query.from_user.id):

            add_zyn(query.from_user.id, 100)
            update_daily_reward(query.from_user.id)

            wallet = get_wallet(query.from_user.id)

            if wallet:
                zyn, bttc = wallet
            else:
                zyn, bttc = (0, 0)

            await query.edit_message_text(
                f"""🎁 Daily Reward Claimed!

🪙 +100 ZYN

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

Come back tomorrow! 🚀
"""
            )

        else:

            await query.edit_message_text(
                """❌ You already claimed today's reward.

Come back tomorrow!"""
            )

    elif query.data == "lucky_spin":

        if can_spin(query.from_user.id):

            rewards = [10, 25, 50, 100]
            reward = random.choice(rewards)

            add_zyn(query.from_user.id, reward)
            update_lucky_spin(query.from_user.id)

            wallet = get_wallet(query.from_user.id)

            if wallet:
                zyn, bttc = wallet
            else:
                zyn, bttc = (0, 0)

            await query.edit_message_text(
                f"""🎰 Lucky Spin

🎉 You won {reward} ZYN!

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

Come back tomorrow for another spin! 🚀
"""
            )

        else:

            await query.edit_message_text(
                "❌ You already used today's Lucky Spin.\n\nCome back tomorrow!"
            )

    elif query.data == "missions":
        await query.edit_message_text("🎯 Missions (Coming Soon)")

    elif query.data == "farming":
        await query.edit_message_text("🌱 Farming (Coming Soon)")

    elif query.data == "more_games":
        await query.edit_message_text("🎮 More Games (Coming Soon)")


def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button))

    print("✅ Zyntra Bot Started...")
    app.run_polling()


if __name__ == "__main__":
    main()
