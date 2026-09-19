from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# IMPORTANT:
# Environment variables mein ye values set karo.
BOT_TOKEN = os.environ.get("BOT_TOKEN")
ADMIN_ID = os.environ.get("ADMIN_ID")

@app.route("/")
def home():
    return "Zyntra Backend Online"


@app.route("/withdraw", methods=["POST"])
def withdraw():

    data = request.get_json()

    telegram_id = data.get("telegram_id")
    name = data.get("name", "User")
    username = data.get("username", "")
    amount = data.get("amount", 0)
    ads = data.get("ads", 0)
    binance_uid = data.get("binance_uid")

    if not telegram_id:
        return jsonify({
            "success": False,
            "message": "Telegram user not found"
        }), 400

    if not binance_uid:
        return jsonify({
            "success": False,
            "message": "Binance UID required"
        }), 400

    if int(amount) < 10000:
        return jsonify({
            "success": False,
            "message": "Minimum 10000 BTTC required"
        }), 400

    if int(ads) < 20:
        return jsonify({
            "success": False,
            "message": "20 ads required"
        }), 400

    message = f"""
🚨 NEW ZYNTRA WITHDRAWAL

👤 Name: {name}
🔹 Username: @{username if username else 'N/A'}

🆔 Telegram ID: {telegram_id}

💰 Amount: {amount} BTTC
📺 Ads: {ads}/20

🏦 Binance UID:
{binance_uid}

⏳ Status: PENDING

💡 Payment manually verify karke Binance se bhejna hai.
"""

    try:

        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

        response = requests.post(
            url,
            json={
                "chat_id": ADMIN_ID,
                "text": message
            },
            timeout=15
        )

        if response.ok:

            return jsonify({
                "success": True,
                "message": "Withdrawal request sent"
            })

        return jsonify({
            "success": False,
            "message": "Telegram notification failed"
        }), 500

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Server error"
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
      )
