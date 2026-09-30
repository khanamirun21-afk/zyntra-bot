// =====================================================
// ZYNTRA FUTURE 01
// 👤 PROFILE + 👥 REFERRAL SYSTEM
// =====================================================

(function () {

    "use strict";

    console.log("Zyntra Future 01 Loaded ✅");

    // ===============================
    // GET TELEGRAM USER
    // ===============================

    function getUser() {

        try {

            if (
                window.Telegram &&
                window.Telegram.WebApp &&
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user
            ) {

                return window.Telegram.WebApp
                    .initDataUnsafe.user;

            }

        } catch (e) {

            console.log(e);

        }

        return null;
    }


    // ===============================
    // PROFILE DATA
    // ===============================

    function getProfile() {

        var user = getUser();

        var profile = {

            id: user ? (user.id || "") : "",

            firstName:
                user ?
                (user.first_name || "User") :
                "User",

            lastName:
                user ?
                (user.last_name || "") :
                "",

            username:
                user ?
                (user.username || "") :
                "",

            referrals: 0,

            referralEarnings: 0

        };


        try {

            var saved =
                localStorage.getItem(
                    "zyntra_profile"
                );

            if (saved) {

                var old =
                    JSON.parse(saved);

                if (
                    old &&
                    typeof old === "object"
                ) {

                    profile.referrals =
                        Number(
                            old.referrals || 0
                        );

                    profile.referralEarnings =
                        Number(
                            old.referralEarnings || 0
                        );

                }

            }

        } catch (e) {

            console.log(
                "Profile load error:",
                e
            );

        }

        return profile;

    }


    // ===============================
    // SAVE PROFILE
    // ===============================

    function saveProfile(profile) {

        try {

            localStorage.setItem(
                "zyntra_profile",
                JSON.stringify(profile)
            );

        } catch (e) {

            console.log(
                "Profile save error:",
                e
            );

        }

    }


    // ===============================
    // BALANCE
    // ===============================

    function getBalance() {

        try {

            if (
                typeof data !== "undefined"
            ) {

                return Number(
                    data.bttc || 0
                );

            }

        } catch (e) {}

        return 0;

    }


    // ===============================
    // LEVEL
    // ===============================

    function getLevel(balance) {

        if (balance >= 100000)
            return 5;

        if (balance >= 50000)
            return 4;

        if (balance >= 25000)
            return 3;

        if (balance >= 10000)
            return 2;

        return 1;

    }


    // ===============================
    // REFERRAL LINK
    // ===============================

    function getReferralLink() {

        var profile =
            getProfile();

        return (
            "https://t.me/" +
            "ZyntraBotOfficial" +
            "?start=" +
            encodeURIComponent(
                profile.id || ""
            )
        );

    }


    // ===============================
    // TOAST
    // ===============================

    function toast(message) {

        if (
            typeof window.showToast ===
            "function"
        ) {

            window.showToast(
                message
            );

        } else {

            alert(message);

        }

    }


    // ===============================
    // CREATE MAIN BUTTONS
    // ===============================

    function createButtons() {

        if (
            document.getElementById(
                "zyntraFutureButtons"
            )
        ) {

            return;

        }


        var container =
            document.querySelector(
                ".container"
            );

        if (!container)
            return;


        var box =
            document.createElement(
                "div"
            );

        box.id =
            "zyntraFutureButtons";


        box.className =
            "card";


        box.innerHTML =

            '<div class="section-title">' +
            '👤 Zyntra Account' +
            '</div>' +

            '<button id="zyntraProfileBtn">' +
            '👤 My Profile' +
            '</button>' +

            '<button ' +
            'class="secondary" ' +
            'id="zyntraReferralBtn">' +
            '👥 Invite & Earn' +
            '</button>';


        container.appendChild(
            box
        );


        document
            .getElementById(
                "zyntraProfileBtn"
            )
            .onclick =
            openProfile;


        document
            .getElementById(
                "zyntraReferralBtn"
            )
            .onclick =
            openReferral;

    }


    // ===============================
    // PROFILE MODAL
    // ===============================

    function openProfile() {

        var old =
            document.getElementById(
                "zyntraProfileModal"
            );

        if (old)
            old.remove();


        var profile =
            getProfile();

        var balance =
            getBalance();

        var level =
            getLevel(
                balance
            );


        var username =
            profile.username
                ? "@" +
                  profile.username
                : "Not set";


        var modal =
            document.createElement(
                "div"
            );


        modal.id =
            "zyntraProfileModal";


        modal.className =
            "modal";


        modal.style.display =
            "flex";


        modal.innerHTML =

            '<div class="modal-box">' +

            '<div style="' +
            'text-align:center;' +
            'font-size:45px;' +
            '">👤</div>' +

            '<div style="' +
            'text-align:center;' +
            'font-size:24px;' +
            'font-weight:bold;' +
            'color:#ff7a00;' +
            'margin-top:5px;' +
            '">' +

            profile.firstName +

            '</div>' +

            '<div style="' +
            'text-align:center;' +
            'color:#aaa;' +
            'margin-top:5px;' +
            '">' +

            username +

            '</div>' +

            '<div class="task" style="' +
            'margin-top:18px;' +
            '">' +

            '<div class="small">' +
            '💰 BTTC Balance' +
            '</div>' +

            '<b style="font-size:20px;">' +

            balance.toLocaleString() +

            ' BTTC</b>' +

            '</div>' +

            '<div class="task">' +

            '<div class="small">' +
            '⭐ Current Level' +
            '</div>' +

            '<b style="font-size:20px;">' +

            'Level ' +
            level +

            '</b>' +

            '</div>' +

            '<div class="task">' +

            '<div class="small">' +
            '👥 Total Referrals' +
            '</div>' +

            '<b style="font-size:20px;">' +

            profile.referrals +

            '</b>' +

            '</div>' +

            '<div class="task">' +

            '<div class="small">' +
            '🎁 Referral Earnings' +
            '</div>' +

            '<b style="font-size:20px;">' +

            Number(
                profile.referralEarnings ||
                0
            ).toLocaleString() +

            ' BTTC</b>' +

            '</div>' +

            '<button id="profileInviteBtn">' +
            '👥 Invite Friends' +
            '</button>' +

            '<button ' +
            'class="close" ' +
            'id="profileCloseBtn">' +
            'Close' +
            '</button>' +

            '</div>';


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "profileInviteBtn"
            )
            .onclick =
            openReferral;


        document
            .getElementById(
                "profileCloseBtn"
            )
            .onclick =
            function () {

                modal.remove();

            };

    }


    // ===============================
    // REFERRAL MODAL
    // ===============================

    function openReferral() {

        var old =
            document.getElementById(
                "zyntraReferralModal"
            );

        if (old)
            old.remove();


        var profile =
            getProfile();


        var modal =
            document.createElement(
                "div"
            );


        modal.id =
            "zyntraReferralModal";


        modal.className =
            "modal";


        modal.style.display =
            "flex";


        modal.innerHTML =

            '<div class="modal-box">' +

            '<div class="section-title">' +
            '👥 Invite & Earn' +
            '</div>' +

            '<div class="small">' +

            'Invite your friends to Zyntra ' +
            'and grow your network. 🚀' +

            '</div>' +

            '<div class="task" style="' +
            'margin-top:15px;' +
            '">' +

            '<div class="small">' +
            'Your Referrals' +
            '</div>' +

            '<b style="font-size:24px;">' +

            profile.referrals +

            '</b>' +

            '</div>' +

            '<div class="task">' +

            '<div class="small">' +
            'Referral Earnings' +
            '</div>' +

            '<b style="font-size:24px;">' +

            Number(
                profile.referralEarnings ||
                0
            ).toLocaleString() +

            ' BTTC</b>' +

            '</div>' +

            '<input ' +
            'id="zyntraReferralInput" ' +
            'readonly ' +
            'value="' +
            getReferralLink() +
            '">' +

            '<button ' +
            'id="copyReferralBtn">' +

            '🔗 Copy Referral Link' +

            '</button>' +

            '<button ' +
            'id="shareReferralBtn" ' +
            'class="secondary">' +

            '📤 Share with Friends' +

            '</button>' +

            '<button ' +
            'id="referralCloseBtn" ' +
            'class="close">' +

            'Close' +

            '</button>' +

            '</div>';


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "copyReferralBtn"
            )
            .onclick =
            copyReferral;


        document
            .getElementById(
                "shareReferralBtn"
            )
            .onclick =
            shareReferral;


        document
            .getElementById(
                "referralCloseBtn"
            )
            .onclick =
            function () {

                modal.remove();

            };

    }


    // ===============================
    // COPY LINK
    // ===============================

    function copyReferral() {

        var link =
            getReferralLink();


        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard
                .writeText(link)
                .then(function () {

                    toast(
                        "Referral link copied! 🔗"
                    );

                })
                .catch(function () {

                    prompt(
                        "Copy referral link:",
                        link
                    );

                });

        } else {

            prompt(
                "Copy referral link:",
                link
            );

        }

    }


    // ===============================
    // SHARE LINK
    // ===============================

    function shareReferral() {

        var link =
            getReferralLink();


        var text =
            "🚀 Join Zyntra Network!\n\n" +
            "Earn • Play • Grow 💰\n\n" +
            "Join using my referral link:\n" +
            link;


        var shareUrl =
            "https://t.me/share/url?url=" +
            encodeURIComponent(link) +
            "&text=" +
            encodeURIComponent(text);


        try {

            if (
                window.Telegram &&
                window.Telegram.WebApp &&
                typeof window.Telegram.WebApp
                    .openTelegramLink ===
                    "function"
            ) {

                window.Telegram.WebApp
                    .openTelegramLink(
                        shareUrl
                    );

                return;

            }

        } catch (e) {

            console.log(e);

        }


        window.open(
            shareUrl,
            "_blank"
        );

    }


    // ===============================
    // PUBLIC FUNCTIONS
    // ===============================

    window.openZyntraProfile =
        openProfile;

    window.openZyntraReferral =
        openReferral;

    window.copyZyntraReferral =
        copyReferral;

    window.shareZyntraReferral =
        shareReferral;


    // ===============================
    // START
    // ===============================

    function start() {

        var profile =
            getProfile();

        saveProfile(
            profile
        );

        createButtons();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();

    }

})();
