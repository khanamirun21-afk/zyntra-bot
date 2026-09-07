import os
import random
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
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
    get_all_tasks,
    is_task_claimed,
    claim_task,
    get_full_profile,
    get_leaderboard_top
)
from tap import tap
from farming import farming

TOKEN = os.environ["TOKEN"]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    add_user(user.id, user.username, user.first_name)
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
        zyn, bttc = wallet if wallet else (0, 0)
        await query.edit_message_text(
            f"💰 Zyntra Wallet\n\n🪙 ZYN Balance: {zyn}\n💎 BTTC Balance: {bttc}\n\n🎁 Daily Reward\n💸 Withdraw (Coming Soon)\n\n⬅️ Type /start to go back"
        )

    elif query.data == "profile":
        profile = get_full_profile(query.from_user.id)
        if profile:
            uid, uname, name, refs, zyn, bttc, taps = profile
            text = f"👤 **Your Profile**\n\n🆔 ID: `{uid}`\n👤 Name: {name}\n🔗 Username: @{uname if uname else 'N/A'}\n\n💰 ZYN: {zyn}\n💎 BTTC: {bttc}\n👆 Taps: {taps}\n👥 Referrals: {refs}"
        else:
            text = "👤 Profile not found"
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="home")]]), parse_mode="Markdown")

    elif query.data == "referral":
        referrals = get_referrals(query.from_user.id)
        bot_username = (await context.bot.get_me()).username
        link = f"https://t.me/{bot_username}?start={query.from_user.id}"
        await query.edit_message_text(
            f"👥 Referral System\n\n🔗 Your Referral Link:\n{link}\n\n👤 Total Referrals: {referrals}\n\n🎁 Reward: 100 ZYN per referral\n\nShare your link and earn! 🚀"
        )

    elif query.data == "tasks":
        tasks = get_all_tasks()
        buttons = []
        text = "📋 **Social Tasks**\nComplete & earn ZYN:\n\n"
        for tid, title, link, reward in tasks:
            claimed = is_task_claimed(query.from_user.id, tid)
            status = "✅ Done" if claimed else f"🎁 {reward} ZYN"
            text += f"{title} - {status}\n"
            if not claimed:
                buttons.append([InlineKeyboardButton(f"🔗 {title}", url=link), InlineKeyboardButton(f"Claim {reward}", callback_data=f"claim_task_{tid}")])
        
        buttons.append([InlineKeyboardButton("⬅️ Back", callback_data="play")])
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(buttons), parse_mode="Markdown")

    elif query.data.startswith("claim_task_"):
        tid = int(query.data.split("_")[-1])
        reward = claim_task(query.from_user.id, tid)
        if reward:
            await query.edit_message_text(f"🎉 Task Completed!\n\n+{reward} ZYN added to wallet!", reply_markup=await play_menu(update, context))
        else:
            await query.edit_message_text("❌ Already claimed!", reply_markup=await play_menu(update, context))

    elif query.data == "leaderboard":
        rows = get_leaderboard_top()
        text = "🏆 **Top 10 ZYN Holders**\n\n"
        if not rows:
            text += "No data yet"
        else:
            for i, (name, zyn) in enumerate(rows, 1):
                medal = "🥇" if i==1 else "🥈" if i==2 else "🥉" if i==3 else f"{i}."
                text += f"{medal} {name} - {zyn} ZYN\n"
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="home")]]), parse_mode="Markdown")

    elif query.data == "settings":
        await query.edit_message_text("⚙️ Settings (Coming Soon)")

    elif query.data == "tap":
        await tap(query)

    elif query.data == "daily_reward":
        if can_claim_daily_reward(query.from_user.id):
            add_zyn(query.from_user.id, 100)
            update_daily_reward(query.from_user.id)
            wallet = get_wallet(query.from_user.id)
            zyn, bttc = wallet if wallet else (0, 0)
            await query.edit_message_text(f"🎁 Daily Reward Claimed!\n\n🪙 +100 ZYN\n\n💰 ZYN Balance: {zyn}\n💎 BTTC Balance: {bttc}\n\nCome back tomorrow! 🚀")
        else:
            await query.edit_message_text("❌ You already claimed today's reward.\n\nCome back tomorrow!")

    elif query.data == "lucky_spin":
        if can_spin(query.from_user.id):
            rewards = [10, 25, 50, 100]
            reward = random.choice(rewards)
            add_zyn(query.from_user.id, reward)
            update_lucky_spin(query.from_user.id)
            wallet = get_wallet(query.from_user.id)
            zyn, bttc = wallet if wallet else (0, 0)
            await query.edit_message_text(f"🎰 Lucky Spin\n\n🎉 You won {reward} ZYN!\n\n💰 ZYN Balance: {zyn}\n💎 BTTC Balance: {bttc}\n\nCome back tomorrow! 🚀")
        else:
            await query.edit_message_text("❌ You already used today's Lucky Spin.\n\nCome back tomorrow!")

    elif query.data == "missions":
        await query.edit_message_text("🎯 Missions (Coming Soon)")

    elif query.data == "farming":
        await farming(query)

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
