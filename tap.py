from database import add_zyn, get_wallet
from energy import get_energy, use_energy


async def tap(query):
    energy = get_energy(query.from_user.id)

    if energy <= 0:
        await query.edit_message_text(
            "⚡ No Energy!\n\nWait for recharge."
        )
        return

    use_energy(query.from_user.id)

    add_zyn(query.from_user.id, 1)

    wallet = get_wallet(query.from_user.id)

    if wallet:
        zyn, bttc = wallet
    else:
        zyn, bttc = (0, 0)

    energy = get_energy(query.from_user.id)

    await query.edit_message_text(
        f"""⚡ Zyntra Tap

🪙 +1 ZYN Earned!

⚡ Energy: {energy}/1000

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

⬅️ Type /start to go back
"""
    )
