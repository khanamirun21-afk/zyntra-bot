// =====================================================
// ZYNTRA FUTURE 01
// 👤 PROFILE SYSTEM + 👥 REFERRAL SYSTEM
// =====================================================

(function () {

    "use strict";

    console.log("Zyntra Future 01 Loaded ✅");

    // -------------------------------------------------
    // PROFILE
    // -------------------------------------------------

    function getTelegramUser() {

        try {

            if (
                window.Telegram &&
                window.Telegram.WebApp &&
                window.Telegram.WebApp.initDataUnsafe &&
                window.Telegram.WebApp.initDataUnsafe.user
            ) {
                return window.Telegram.WebApp.initDataUnsafe.user;
            }

        } catch (e) {
            console.log("Telegram user error:", e);
        }

        return null;
    }


    function getProfile() {

        var user = getTelegramUser();

        var profile = {

            id: user ? (user.id || "") : "",

            firstName: user ? (user.first_name || "User") : "User",

            lastName: user ? (user.last_name || "") : "",

            username: user ? (user.username || "") : "",

            language: user ? (user.language_code || "") : "",

            referrals: 0,

            referralEarnings: 0

        };

        try {

            var saved =
                localStorage.getItem("zyntra_profile");

            if (saved) {

                var oldProfile =
                    JSON.parse(saved);

                if (
                    oldProfile &&
                    typeof oldProfile === "object"
                ) {

                    profile.referrals =
                        Number(oldProfile.referrals || 0);

                    profile.referralEarnings =
                        Number(
                            oldProfile.referralEarnings || 0
                        );

                }

            }

        } catch (e) {

            console.log("Profile storage error:", e);

        }

        return profile;
    }


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


    // -------------------------------------------------
    // REFERRAL LINK
    // -------------------------------------------------

    function getReferralLink() {

        var profile = getProfile();

        var botUsername =
            "ZyntraBotOfficial";

        var userId =
            profile.id || "";

        return (
            "https://t.me/" +
            botUsername +
            "?start=" +
            encodeURIComponent(userId)
        );

    }


    // -------------------------------------------------
    // COPY REFERRAL LINK
    // -------------------------------------------------

    function copyReferralLink() {

        var link =
            getReferralLink();

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard
                .writeText(link)
                .then(function () {

                    if (
                        typeof window.showToast ===
                        "function"
                    ) {

                        window.showToast(
                            "Referral link copied! 👥"
                        );

                    } else {

                        alert(
                            "Referral link copied!"
                        );

                    }

                })
                .catch(function () {

                    prompt(
                        "Copy your referral link:",
                        link
                    );

                });

        } else {

            prompt(
                "Copy your referral link:",
                link
            );

        }

    }


    // -------------------------------------------------
    // SHARE REFERRAL
    // -------------------------------------------------

    function shareReferral() {

        var link =
            getReferralLink();

        var message =
            "🚀 Join Zyntra Network!\n\n" +
            "Earn • Play • Grow 💰\n\n" +
            "Join using my referral link:\n" +
            link;

        var shareUrl =
            "https://t.me/share/url?url=" +
            encodeURIComponent(link) +
            "&text=" +
            encodeURIComponent(
                message
            );

        try {

            if (
                window.Telegram &&
                window.Telegram.WebApp &&
                typeof window.Telegram.WebApp.openTelegramLink ===
                "function"
            ) {

                window.Telegram.WebApp
                    .openTelegramLink(
                        shareUrl
                    );

                return;

            }

        } catch (e) {

            console.log(
                "Telegram share error:",
                e
            );

        }

        window.open(
            shareUrl,
            "_blank"
        );

    }


    // -------------------------------------------------
    // PROFILE MODAL
    // -------------------------------------------------

    function openProfile() {

        var profile =
            getProfile();

        var old =
            document.getElementById(
                "zyntraProfileModal"
            );

        if (old) {

            old.remove();

        }


        var username =
            profile.username
                ? "@" + profile.username
                : "Not set";


        var firstName =
            profile.firstName ||
            "User";


        var balance = 0;

        try {

            if (
                typeof data !==
                "undefined"
            ) {

                balance =
                    Number(
                        data.bttc || 0
                    );

            }

        } catch (e) {

            balance = 0;

        }


        var level = 1;

        if (balance >= 100000) {
            level = 5;
        } else if (balance >= 50000) {
            level = 4;
        } else if (balance >= 25000) {
            level = 3;
        } else if (balance >= 10000) {
            level = 2;
        }


        var modal =
            document.createElement(
                "div"
            );

        modal.id =
            "zyntraProfileModal";


        modal.style.cssText =
            "position:fixed;" +
            "inset:0;" +
            "background:rgba(0,0,0,.78);" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "padding:20px;" +
            "z-index:9998;";


        modal.innerHTML =

            '<div style="' +

            'width:100%;' +
            'max-width:420px;' +
            'background:#151521;' +
            'border:1px solid #38384b;' +
            'border-radius:20px;' +
            'padding:22px;' +

            '">' +

            '<div style="' +
            'text-align:center;' +
            'font-size:42px;' +
            'margin-bottom:8px;' +
            '">👤</div>' +

            '<div style="' +
            'text-align:center;' +
            'font-size:23px;' +
            'font-weight:bold;' +
            'color:#ff7a00;' +
            '">' +

            firstName +

            '</div>' +

            '<div style="' +
            'text-align:center;' +
            'color:#aaa;' +
            'margin-top:5px;' +
            '">' +

            username +

            '</div>' +

            '<div style="' +
            'background:#0c0c14;' +
            'border-radius:14px;' +
            'padding:15px;' +
            'margin-top:18px;' +
            '">' +

            '<div style="margin:8px 0;">' +
            '💰 Balance: <b>' +
            balance.toLocaleString() +
            ' BTTC</b>' +
            '</div>' +

            '<div style="margin:8px 0;">' +
            '⭐ Level: <b>' +
            level +
            '</b>' +
            '</div>' +

            '<div style="margin:8px 0;">' +
            '👥 Referrals: <b>' +
            profile.referrals +
            '</b>' +
            '</div>' +

            '<div style="margin:8px 0;">' +
            '🎁 Referral Earnings: <b>' +
            Number(
                profile.referralEarnings || 0
            ).toLocaleString() +
            ' BTTC</b>' +
            '</div>' +

            '</div>' +

            '<button ' +
            'id="zyntraCopyReferral">' +
            '🔗 Copy Referral Link' +
            '</button>' +

            '<button ' +
            'id="zyntraShareReferral">' +
            '📤 Share Referral Link' +
            '</button>' +

            '<button ' +
            'id="zyntraCloseProfile" ' +
            'style="' +
            'background:#292936;' +
            '">' +

            'Close' +

            '</button>' +

            '</div>';


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "zyntraCopyReferral"
            )
            .onclick =
            copyReferralLink;


        document
            .getElementById(
                "zyntraShareReferral"
            )
            .onclick =
            shareReferral;


        document
            .getElementById(
                "zyntraCloseProfile"
            )
            .onclick =
            function () {

                modal.remove();

            };

    }


    // -------------------------------------------------
    // REFERRAL COUNTER
    // -------------------------------------------------

    function addReferralReward(amount) {

        var profile =
            getProfile();

        amount =
            Number(amount || 0);

        profile.referrals += 1;

        profile.referralEarnings +=
            amount;

        saveProfile(
            profile
        );

        console.log(
            "Referral recorded:",
            amount
        );

    }


    // -------------------------------------------------
    // PUBLIC FUNCTIONS
    // -------------------------------------------------

    window.openZyntraProfile =
        openProfile;

    window.copyZyntraReferral =
        copyReferralLink;

    window.shareZyntraReferral =
        shareReferral;

    window.addZyntraReferral =
        addReferralReward;


    // -------------------------------------------------
    // INITIALIZE
    // -------------------------------------------------

    var profile =
        getProfile();

    saveProfile(
        profile
    );

})();
