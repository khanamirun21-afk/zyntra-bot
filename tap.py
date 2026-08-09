from database import add_zyn, get_wallet, add_tap, can_show_tap_ad


async def tap(query):
    user_id = query.from_user.id

    # Count tap
    taps = add_tap(user_id)

    # Give normal tap reward
    add_zyn(user_id, 1)

    wallet = get_wallet(user_id)

    if wallet:
        zyn, bttc = wallet
    else:
        zyn, bttc = (0, 0)

    # Every 1000 taps -> ad checkpoint
    if can_show_tap_ad(user_id):
        await query.edit_message_text(
            f"""⚡ Zyntra Tap

🪙 +1 ZYN Earned!

🎯 Total Taps: {taps}

📺 Ad Milestone Reached!

You completed {taps} taps.
Watch an ad to continue earning.

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}
"""
        )
        return

    await query.edit_message_text(
        f"""⚡ Zyntra Tap

🪙 +1 ZYN Earned!

🎯 Total Taps: {taps}

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

⬅️ Type /start to go back
"""
    )
