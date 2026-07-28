from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import ContextTypes


async def home_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("🎮 Play", callback_data="play")],
        [InlineKeyboardButton("💰 Wallet", callback_data="wallet")],
        [InlineKeyboardButton("👤 Profile", callback_data="profile")],
        [InlineKeyboardButton("👥 Referral", callback_data="referral")],
        [InlineKeyboardButton("📋 Tasks", callback_data="tasks")],
        [InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard")],
        [InlineKeyboardButton("⚙️ Settings", callback_data="settings")],
    ]
    return InlineKeyboardMarkup(keyboard)


async def play_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("⚡ Zyntra Tap", callback_data="tap")],
        [InlineKeyboardButton("🎁 Daily Reward", callback_data="daily_reward")],
        [InlineKeyboardButton("🎰 Lucky Spin", callback_data="lucky_spin")],
        [InlineKeyboardButton("🎯 Missions", callback_data="missions")],
        [InlineKeyboardButton("🌱 Farming", callback_data="farming")],
        [InlineKeyboardButton("🎮 More Games", callback_data="more_games")],
        [InlineKeyboardButton("⬅️ Back", callback_data="home")],
    ]
    return InlineKeyboardMarkup(keyboard)
