from http.server import BaseHTTPRequestHandler
import json
import os
import requests


class handler(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_json({"success": True})

    def do_GET(self):
        self.send_json({
            "success": True,
            "message": "Zyntra Withdraw API Online"
        })

    def do_POST(self):

        try:
            length = int(self.headers.get("Content-Length", 0))

            if length <= 0:
                return self.send_json({
                    "success": False,
                    "message": "Empty request"
                }, 400)

            body = self.rfile.read(length)
            data = json.loads(body.decode("utf-8"))

            telegram_id = data.get("telegram_id")
            name = data.get("name", "User")
            username = data.get("username", "")
            binance_uid = str(data.get("binance_uid", "")).strip()

            try:
                amount = int(data.get("amount", 0))
                ads = int(data.get("ads", 0))
            except (ValueError, TypeError):
                return self.send_json({
                    "success": False,
                    "message": "Invalid amount or ads"
                }, 400)

            if not telegram_id:
                return self.send_json({
                    "success": False,
                    "message": "Telegram user not found"
                }, 400)

            if not binance_uid.isdigit():
                return self.send_json({
                    "success": False,
                    "message": "Valid Binance UID required"
                }, 400)

            if amount < 10000:
                return self.send_json({
                    "success": False,
                    "message": "Minimum 10000 BTTC required"
                }, 400)

            if ads < 20:
                return self.send_json({
                    "success": False,
                    "message": "20 ads required"
                }, 400)

            bot_token = os.environ.get("BOT_TOKEN")
            admin_id = os.environ.get("ADMIN_ID")

            if not bot_token or not admin_id:
                return self.send_json({
                    "success": False,
                    "message": "Server configuration missing"
                }, 500)

            message = (
                "🚨 NEW ZYNTRA WITHDRAWAL\n\n"
                f"👤 Name: {name}\n"
                f"🔹 Username: @{username if username else 'N/A'}\n\n"
                f"🆔 Telegram ID: {telegram_id}\n\n"
                f"💰 Amount: {amount} BTTC\n"
                f"📺 Ads: {ads}/20\n\n"
                "🏦 Binance UID:\n"
                f"{binance_uid}\n\n"
                "⏳ Status: PENDING\n\n"
                "💡 Payment manually verify karke Binance se bhejna hai."
            )

            telegram_url = (
                f"https://api.telegram.org/bot{bot_token}/sendMessage"
            )

            response = requests.post(
                telegram_url,
                json={
                    "chat_id": admin_id,
                    "text": message
                },
                timeout=15
            )

            if response.ok:
                return self.send_json({
                    "success": True,
                    "message": "Withdrawal request sent"
                })

            return self.send_json({
                "success": False,
                "message": "Telegram notification failed"
            }, 500)

        except json.JSONDecodeError:
            return self.send_json({
                "success": False,
                "message": "Invalid JSON"
            }, 400)

        except Exception as e:
            print("Withdrawal error:", e)

            return self.send_json({
                "success": False,
                "message": "Server error"
            }, 500)
