from database import add_zyn, get_wallet


async def tap(query):
    add_zyn(query.from_user.id, 1)

    wallet = get_wallet(query.from_user.id)

    if wallet:
        zyn, bttc = wallet
    else:
        zyn, bttc = (0, 0)

    await query.edit_message_text(
        f"""⚡ Zyntra Tap

🪙 +1 ZYN Earned!

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

⬅️ Type /start to go back
"""
    )
