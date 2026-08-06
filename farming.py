from datetime import datetime, timedelta

from database import (
    start_farming,
    get_farming,
    reset_farming,
    add_zyn,
    get_wallet,
)


async def farming(query):
    user_id = query.from_user.id

    data = get_farming(user_id)
    now = datetime.utcnow()

    if data:
        farming_start, farming_claim = data

        if farming_claim:

            claim_time = datetime.fromisoformat(farming_claim)

            if now >= claim_time:

                add_zyn(user_id, 200)
                reset_farming(user_id)

                wallet = get_wallet(user_id)

                if wallet:
                    zyn, bttc = wallet
                else:
                    zyn, bttc = (0, 0)

                await query.edit_message_text(
                    f"""🌱 Farming Completed!

🪙 +200 ZYN Earned!

💰 ZYN Balance: {zyn}
💎 BTTC Balance: {bttc}

🚀 Start Farming Again!
"""
                )
                return

            else:

                remaining = claim_time - now
                total_seconds = int(remaining.total_seconds())

                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60

                await query.edit_message_text(
                    f"""🌱 Farming Running...

⏳ Time Left:
{hours}h {minutes}m

Come back later!
"""
                )
                return

    start_time = now.isoformat()
    claim_time = (now + timedelta(hours=6)).isoformat()

    start_farming(
        user_id,
        start_time,
        claim_time,
    )

    await query.edit_message_text(
        """🌱 Farming Started!

⏳ Duration:
6 Hours

🎁 Reward:
🪙 200 ZYN

Come back after 6 hours to claim your reward!
"""
  )
