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

    # ==============================
    # GET
    # ==============================

    def do_GET(self):
        self.send_json({
            "success": True,
            "message": "Zyntra Withdraw API Online"
        })

    # ==============================
    # OPTIONS
    # ==============================

    def do_OPTIONS(self):
        self.send_json({
            "success": True
        })

    # ==============================
    # POST
    # ==============================

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

            bot_token = os.environ.get("BOT_TOKEN")
            admin_id = os.environ.get("ADMIN_ID")

            if not bot_token or not admin_id:
                return self.send_json({
                    "success": False,
                    "message": "Server configuration missing"
                }, 500)

            # ==========================================
            # TELEGRAM WEBHOOK - /START MESSAGE
            # ==========================================

            if "message" in data:

                message_data = data.get(
                    "message",
                    {}
                )

                chat = message_data.get(
                    "chat",
                    {}
                )

                user = message_data.get(
                    "from",
                    {}
                )

                text = message_data.get(
                    "text",
                    ""
                )

                chat_id = chat.get("id")

                # /start or /start referral
                if text.startswith("/start"):

                    first_name = user.get(
                        "first_name",
                        "Friend"
                    )

                    welcome_text = (
                        "🚀 <b>WELCOME TO ZYNTRA NETWORK</b> 🚀\n\n"

                        f"Hey <b>{first_name}</b>! 👋\n\n"

                        "Welcome to <b>Zyntra</b> — "
                        "your digital rewards network. 🌐\n\n"

                        "🎯 <b>Explore Zyntra</b>\n\n"

                        "📺 Watch Ads & Earn Rewards\n"
                        "📋 Complete Daily Tasks\n"
                        "🎁 Collect Rewards\n"
                        "👥 Invite Friends\n"
                        "🏆 Discover New Features\n\n"

                        "━━━━━━━━━━━━━━━━━━\n\n"

                        "🔥 <b>YOUR JOURNEY STARTS HERE!</b>\n\n"

                        "Tap the button below to open "
                        "Zyntra and start exploring. 🚀\n\n"

                        "⚡ More exciting features are coming soon!\n\n"

                        "💜 <b>Welcome to the Zyntra community!</b>"
                    )

                    keyboard = {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "🚀 OPEN ZYNTRA",
                                    "url": "https://zyntra-bot.vercel.app/"
                                }
                            ]
                        ]
                    }

                    self.send_telegram_message(
                        bot_token,
                        chat_id,
                        welcome_text,
                        keyboard
                    )

                    return self.send_json({
                        "success": True,
                        "message": "Welcome message sent"
                    })

            # ==========================================
            # TELEGRAM WEBHOOK - BUTTON CALLBACK
            # ==========================================

            if "callback_query" in data:

                callback = data["callback_query"]

                callback_id = callback.get("id")

                callback_data = callback.get(
                    "data",
                    ""
                )

                callback_message = callback.get(
                    "message",
                    {}
                )

                chat = callback_message.get(
                    "chat",
                    {}
                )

                callback_chat_id = str(
                    chat.get("id", "")
                )

                # Only ADMIN can approve/reject
                if callback_chat_id != str(admin_id):

                    self.answer_callback(
                        bot_token,
                        callback_id,
                        "❌ Not authorized."
                    )

                    return self.send_json({
                        "success": False,
                        "message": "Unauthorized"
                    }, 403)

                # ==================================
                # APPROVE
                # ==================================

                if callback_data.startswith(
                    "approve:"
                ):

                    user_id = callback_data.split(
                        ":",
                        1
                    )[1]

                    self.answer_callback(
                        bot_token,
                        callback_id,
                        "✅ Withdrawal approved!"
                    )

                    self.edit_message(
                        bot_token,
                        callback_message,
                        "SUCCESS"
                    )

                    self.send_user_message(
                        bot_token,
                        user_id,
                        "✅ <b>ZYNTRA WITHDRAWAL SUCCESS</b>\n\n"
                        "Your withdrawal request has been "
                        "approved by the Zyntra admin.\n\n"
                        "💰 Payment will be sent to your "
                        "Binance UID after manual verification.",
                        None
                    )

                    return self.send_json({
                        "success": True,
                        "message": "Withdrawal approved"
                    })

                # ==================================
                # REJECT
                # ==================================

                if callback_data.startswith(
                    "reject:"
                ):

                    user_id = callback_data.split(
                        ":",
                        1
                    )[1]

                    self.answer_callback(
                        bot_token,
                        callback_id,
                        "❌ Withdrawal rejected."
                    )

                    self.edit_message(
                        bot_token,
                        callback_message,
                        "REJECTED"
                    )

                    self.send_user_message(
                        bot_token,
                        user_id,
                        "❌ <b>ZYNTRA WITHDRAWAL REJECTED</b>\n\n"
                        "Your withdrawal request was rejected "
                        "by the Zyntra admin.",
                        None
                    )

                    return self.send_json({
                        "success": True,
                        "message": "Withdrawal rejected"
                    })

                return self.send_json({
                    "success": True
                })

            # ==========================================
            # NORMAL WITHDRAWAL REQUEST
            # ==========================================

            telegram_id = data.get(
                "telegram_id"
            )

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

            # ==========================================
            # ADMIN WITHDRAWAL MESSAGE
            # ==========================================

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

            keyboard = {
                "inline_keyboard": [
                    [
                        {
                            "text": "✅ APPROVE / SUCCESS",
                            "callback_data":
                                f"approve:{telegram_id}"
                        }
                    ],
                    [
                        {
                            "text": "❌ REJECT",
                            "callback_data":
                                f"reject:{telegram_id}"
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

            print(
                "Withdrawal error:",
                e
            )

            return self.send_json({
                "success": False,
                "message": "Server error"
            }, 500)

    # ==========================================
    # SEND TELEGRAM MESSAGE
    # ==========================================

    def send_telegram_message(
        self,
        bot_token,
        chat_id,
        text,
        keyboard=None
    ):

        url = (
            f"https://api.telegram.org/"
            f"bot{bot_token}/sendMessage"
        )

        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML"
        }

        if keyboard:
            payload["reply_markup"] = keyboard

        try:

            requests.post(
                url,
                json=payload,
                timeout=10
            )

        except Exception as e:

            print(
                "Telegram message error:",
                e
            )

    # ==========================================
    # ANSWER CALLBACK
    # ==========================================

    def answer_callback(
        self,
        bot_token,
        callback_id,
        text
    ):

        url = (
            f"https://api.telegram.org/"
            f"bot{bot_token}/answerCallbackQuery"
        )

        try:

            requests.post(
                url,
                json={
                    "callback_query_id":
                        callback_id,
                    "text": text
                },
                timeout=10
            )

        except Exception as e:

            print(
                "Callback error:",
                e
            )

    # ==========================================
    # EDIT ADMIN MESSAGE
    # ==========================================

    def edit_message(
        self,
        bot_token,
        callback_message,
        status
    ):

        chat_id = callback_message.get(
            "chat",
            {}
        ).get("id")

        message_id = callback_message.get(
            "message_id"
        )

        old_text = callback_message.get(
            "text",
            ""
        )

        lines = old_text.split("\n")

        new_lines = []

        for line in lines:

            if line.startswith(
                "⏳ Status:"
            ):
                continue

            new_lines.append(line)

        new_lines.append("")

        if status == "SUCCESS":

            new_lines.append(
                "✅ Status: SUCCESS"
            )

        else:

            new_lines.append(
                "❌ Status: REJECTED"
            )

        new_text = "\n".join(
            new_lines
        )

        url = (
            f"https://api.telegram.org/"
            f"bot{bot_token}/editMessageText"
        )

        try:

            requests.post(
                url,
                json={
                    "chat_id": chat_id,
                    "message_id": message_id,
                    "text": new_text
                },
                timeout=10
            )

        except Exception as e:

            print(
                "Edit message error:",
                e
            )

    # ==========================================
    # SEND MESSAGE TO USER
    # ==========================================

    def send_user_message(
        self,
        bot_token,
        user_id,
        text,
        keyboard=None
    ):

        self.send_telegram_message(
            bot_token,
            user_id,
            text,
            keyboard
        )
