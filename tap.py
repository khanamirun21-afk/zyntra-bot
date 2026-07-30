from database import add_zyn, get_wallet
from energy import use_energy


async def tap(query):
    if not use_energy(query.from_user.id):
        await query.edit_message_text(
            "⚡ No Energy Left!\n\nPlease wait for energy refill."
        )
        return

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

⚡ Energy: 1000/1000

⬅️ Type /start to go back
"""
    )
