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
        self.send_header(
            "Access-Control-Allow-Methods",
            "POST, OPTIONS"
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )
        self.end_headers()

        self.wfile.write(body)

    # -------------------------
    # OPTIONS
    # -------------------------

    def do_OPTIONS(self):
        self.send_json({"success": True})

    # -------------------------
    # GET
    # -------------------------

    def do_GET(self):
        self.send_json({
            "success": True,
            "message": "Zyntra Withdraw API Online"
        })

    # -------------------------
    # POST
    # -------------------------

    def do_POST(self):

        try:

            length = int(
                self.headers.get("Content-Length", 0)
            )

            if length <= 0:
                return self.send_json({
                    "success": False,
                    "message": "Empty request"
                }, 400)

            body = self.rfile.read(length)

            data = json.loads(
                body.decode("utf-8")
            )

            # =================================
            # TELEGRAM CALLBACK BUTTON
            # =================================

            if "callback_query" in data:

                return self.handle_callback(
                    data["callback_query"]
                )

            # =================================
            # NORMAL WITHDRAWAL REQUEST
            # =================================

            telegram_id = data.get("telegram_id")

            name = data.get(
                "name",
                "User"
            )

            username = data.get(
                "username",
                ""
            )

            binance_uid = str(
                data.get(
                    "binance_uid",
                    ""
                )
            ).strip()

            try:

                amount = int(
                    data.get(
                        "amount",
                        0
                    )
                )

                ads = int(
                    data.get(
                        "ads",
                        0
                    )
                )

            except (ValueError, TypeError):

                return self.send_json({
                    "success": False,
                    "message": "Invalid amount or ads"
                }, 400)

            # =================================
            # VALIDATION
            # =================================

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

            # =================================
            # ENVIRONMENT VARIABLES
            # =================================

            bot_token = os.environ.get(
                "BOT_TOKEN"
            )

            admin_id = os.environ.get(
                "ADMIN_ID"
            )

            if not bot_token or not admin_id:

                return self.send_json({
                    "success": False,
                    "message": "Server configuration missing"
                }, 500)

            # =================================
            # ADMIN MESSAGE
            # =================================

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

                "💡 Payment manually verify karke Binance "
                "se bhejna hai."
            )

            # =================================
            # ADMIN BUTTONS
            # =================================

            keyboard = {
                "inline_keyboard": [

                    [
                        {
                            "text": "✅ APPROVE PAYMENT",
                            "callback_data": "approve"
                        }
                    ],

                    [
                        {
                            "text": "❌ REJECT",
                            "callback_data": "reject"
                        }
                    ]

                ]
            }

            telegram_url = (
                f"https://api.telegram.org/"
                f"bot{bot_token}/sendMessage"
            )

            response = requests.post(

                telegram_url,

                json={
                    "chat_id": admin_id,
                    "text": message,
                    "reply_markup": keyboard
                },

                timeout=15
            )

            if response.ok:

                return self.send_json({
                    "success": True,
                    "message": "Withdrawal request sent"
                })

            print(
                "Telegram error:",
                response.text
            )

            return self.send_json({
                "success": False,
                "message": "Telegram notification failed"
            }, 500)

        # =================================
        # JSON ERROR
        # =================================

        except json.JSONDecodeError:

            return self.send_json({
                "success": False,
                "message": "Invalid JSON"
            }, 400)

        # =================================
        # GENERAL ERROR
        # =================================

        except Exception as e:

            print(
                "Withdrawal error:",
                e
            )

            return self.send_json({
                "success": False,
                "message": "Server error"
            }, 500)

    # =====================================
    # TELEGRAM CALLBACK HANDLER
    # =====================================

    def handle_callback(self, callback):

        try:

            bot_token = os.environ.get(
                "BOT_TOKEN"
            )

            admin_id = os.environ.get(
                "ADMIN_ID"
            )

            if not bot_token or not admin_id:

                return self.send_json({
                    "success": False,
                    "message": "Server configuration missing"
                }, 500)

            # ---------------------------------
            # WHO PRESSED THE BUTTON?
            # ---------------------------------

            callback_user = callback.get(
                "from",
                {}
            )

            callback_user_id = str(
                callback_user.get(
                    "id",
                    ""
                )
            )

            # ONLY ADMIN CAN APPROVE/REJECT

            if callback_user_id != str(admin_id):

                self.answer_callback(
                    bot_token,
                    callback.get("id"),
                    "❌ You are not authorized."
                )

                return self.send_json({
                    "success": False,
                    "message": "Unauthorized"
                }, 403)

            # ---------------------------------
            # ACTION
            # ---------------------------------

            action = callback.get(
                "data",
                ""
            )

            telegram_message = callback.get(
                "message",
                {}
            )

            chat = telegram_message.get(
                "chat",
                {}
            )

            message_id = telegram_message.get(
                "message_id"
            )

            old_text = telegram_message.get(
                "text",
                ""
            )

            # ---------------------------------
            # APPROVE
            # ---------------------------------

            if action == "approve":

                new_status = "✅ Status: SUCCESS"

                callback_message = (
                    "✅ Payment approved successfully."
                )

            # ---------------------------------
            # REJECT
            # ---------------------------------

            elif action == "reject":

                new_status = "❌ Status: REJECTED"

                callback_message = (
                    "❌ Withdrawal rejected."
                )

            else:

                self.answer_callback(
                    bot_token,
                    callback.get("id"),
                    "Unknown action."
                )

                return self.send_json({
                    "success": False,
                    "message": "Unknown action"
                }, 400)

            # ---------------------------------
            # CHANGE STATUS IN MESSAGE
            # ---------------------------------

            if "⏳ Status: PENDING" in old_text:

                new_text = old_text.replace(
                    "⏳ Status: PENDING",
                    new_status
                )

            else:

                new_text = (
                    old_text
                    + "\n\n"
                    + new_status
                )

            # ---------------------------------
            # REMOVE BUTTONS AFTER CLICK
            # ---------------------------------

            telegram_url = (
                f"https://api.telegram.org/"
                f"bot{bot_token}/editMessageText"
            )

            edit_response = requests.post(

                telegram_url,

                json={
                    "chat_id": chat.get("id"),
                    "message_id": message_id,
                    "text": new_text,
                    "reply_markup": {
                        "inline_keyboard": []
                    }
                },

                timeout=15
            )

            # ---------------------------------
            # ANSWER BUTTON
            # ---------------------------------

            self.answer_callback(
                bot_token,
                callback.get("id"),
                callback_message
            )

            if edit_response.ok:

                return self.send_json({
                    "success": True,
                    "message": "Status updated"
                })

            print(
                "Edit message error:",
                edit_response.text
            )

            return self.send_json({
                "success": False,
                "message": "Could not update message"
            }, 500)

        except Exception as e:

            print(
                "Callback error:",
                e
            )

            return self.send_json({
                "success": False,
                "message": "Callback server error"
            }, 500)

    # =====================================
    # ANSWER TELEGRAM BUTTON
    # =====================================

    def answer_callback(
        self,
        bot_token,
        callback_id,
        text
    ):

        try:

            url = (
                f"https://api.telegram.org/"
                f"bot{bot_token}/answerCallbackQuery"
            )

            requests.post(

                url,

                json={
                    "callback_query_id": callback_id,
                    "text": text
                },

                timeout=10
            )

        except Exception as e:

            print(
                "Callback answer error:",
                e
    )
