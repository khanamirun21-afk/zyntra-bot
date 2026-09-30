// =====================================================
// ZYNTRA FUTURE 01
// 👤 PROFILE + 👥 REFERRAL
// PROFESSIONAL UI
// =====================================================

(function () {

    "use strict";

    console.log("Zyntra Future 01 Professional Loaded ✅");

    // ==============================
    // TELEGRAM USER
    // ==============================

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

        } catch (e) {}

        return null;
    }


    // ==============================
    // PROFILE
    // ==============================

    function getProfile() {

        var user = getUser();

        return {

            id: user ? (user.id || "") : "",

            name:
                user ?
                (user.first_name || "User") :
                "User",

            username:
                user && user.username
                    ? "@" + user.username
                    : "No username"

        };

    }


    // ==============================
    // REFERRAL LINK
    // ==============================

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


    // ==============================
    // ADD SMALL BUTTONS
    // ==============================

    function createButtons() {

        if (
            document.getElementById(
                "zyntraFutureNav"
            )
        ) {
            return;
        }


        var container =
            document.querySelector(
                ".container"
            );

        if (!container) {
            return;
        }


        var nav =
            document.createElement(
                "div"
            );


        nav.id =
            "zyntraFutureNav";


        nav.style.cssText =
            "display:grid;" +
            "grid-template-columns:1fr 1fr;" +
            "gap:10px;" +
            "margin:5px 0 15px 0;";


        nav.innerHTML =

            '<button ' +
            'id="zyntraProfileBtn" ' +
            'style="' +
            'margin:0;' +
            'background:linear-gradient(135deg,#6a35ff,#a62cff);' +
            'box-shadow:0 6px 18px rgba(120,50,255,.20);' +
            '">' +

            '👤 Profile' +

            '</button>' +

            '<button ' +
            'id="zyntraReferralBtn" ' +
            'style="' +
            'margin:0;' +
            'background:linear-gradient(135deg,#ff6b00,#ff2455);' +
            'box-shadow:0 6px 18px rgba(255,80,30,.20);' +
            '">' +

            '👥 Referral' +

            '</button>';


        // Top par add hoga
        container.insertBefore(
            nav,
            container.children[1]
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


    // ==============================
    // GET BALANCE
    // ==============================

    function getBalance() {

        try {

            if (
                typeof data !==
                "undefined"
            ) {

                return Number(
                    data.bttc || 0
                );

            }

        } catch (e) {}

        return 0;

    }


    // ==============================
    // GET LEVEL
    // ==============================

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


    // ==============================
    // PROFILE PAGE
    // ==============================

    function openProfile() {

        var old =
            document.getElementById(
                "zyntraProfilePage"
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


        var page =
            document.createElement(
                "div"
            );


        page.id =
            "zyntraProfilePage";


        page.style.cssText =
            "position:fixed;" +
            "inset:0;" +
            "z-index:10001;" +
            "background:#090912;" +
            "overflow-y:auto;" +
            "padding:18px;" +
            "animation:zyntraFade .2s ease;";


        page.innerHTML =

            '<div style="' +
            'max-width:520px;' +
            'margin:auto;' +
            '">' +

            '<div style="' +
            'display:flex;' +
            'align-items:center;' +
            'gap:12px;' +
            'padding:10px 0 22px;' +
            '">' +

            '<button id="zyntraProfileBack" ' +
            'style="' +
            'width:45px;' +
            'margin:0;' +
            'padding:10px;' +
            'background:#20202d;' +
            '">' +

            '←' +

            '</button>' +

            '<div style="' +
            'font-size:23px;' +
            'font-weight:bold;' +
            '">👤 Profile</div>' +

            '</div>' +


            '<div style="' +
            'background:linear-gradient(135deg,#21100a,#24113b);' +
            'border:1px solid #44345b;' +
            'border-radius:22px;' +
            'padding:25px;' +
            'text-align:center;' +
            'box-shadow:0 10px 35px rgba(0,0,0,.3);' +
            '">' +

            '<div style="' +
            'width:76px;' +
            'height:76px;' +
            'margin:auto;' +
            'border-radius:50%;' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center;' +
            'font-size:36px;' +
            'background:linear-gradient(135deg,#6a35ff,#ff2455);' +
            '">' +

            '👤' +

            '</div>' +

            '<div style="' +
            'font-size:24px;' +
            'font-weight:bold;' +
            'margin-top:14px;' +
            '">' +

            profile.name +

            '</div>' +

            '<div style="' +
            'color:#aaa;' +
            'margin-top:5px;' +
            '">' +

            profile.username +

            '</div>' +

            '</div>' +


            '<div style="' +
            'display:grid;' +
            'grid-template-columns:1fr 1fr;' +
            'gap:10px;' +
            'margin-top:12px;' +
            '">' +

            statBox(
                "💰",
                "Balance",
                balance.toLocaleString() +
                " BTTC"
            ) +

            statBox(
                "⭐",
                "Level",
                "Level " +
                level
            ) +

            '</div>' +


            '<button id="zyntraProfileReferral" ' +
            'style="' +
            'margin-top:12px;' +
            'background:linear-gradient(135deg,#ff6b00,#ff2455);' +
            '">' +

            '👥 Invite Friends' +

            '</button>' +

            '</div>';


        document.body.appendChild(
            page
        );


        document
            .getElementById(
                "zyntraProfileBack"
            )
            .onclick =
            function () {
                page.remove();
            };


        document
            .getElementById(
                "zyntraProfileReferral"
            )
            .onclick =
            function () {

                page.remove();

                openReferral();

            };

    }


    // ==============================
    // STAT BOX
    // ==============================

    function statBox(
        icon,
        title,
        value
    ) {

        return (

            '<div style="' +
            'background:#151521;' +
            'border:1px solid #29293a;' +
            'border-radius:16px;' +
            'padding:16px;' +
            '">' +

            '<div style="font-size:22px;">' +
            icon +
            '</div>' +

            '<div style="' +
            'color:#aaa;' +
            'font-size:12px;' +
            'margin-top:7px;' +
            '">' +

            title +

            '</div>' +

            '<b style="' +
            'display:block;' +
            'margin-top:4px;' +
            'font-size:16px;' +
            '">' +

            value +

            '</b>' +

            '</div>'

        );

    }


    // ==============================
    // REFERRAL PAGE
    // ==============================

    function openReferral() {

        var old =
            document.getElementById(
                "zyntraReferralPage"
            );

        if (old)
            old.remove();


        var link =
            getReferralLink();


        var page =
            document.createElement(
                "div"
            );


        page.id =
            "zyntraReferralPage";


        page.style.cssText =
            "position:fixed;" +
            "inset:0;" +
            "z-index:10001;" +
            "background:#090912;" +
            "overflow-y:auto;" +
            "padding:18px;";


        page.innerHTML =

            '<div style="' +
            'max-width:520px;' +
            'margin:auto;' +
            '">' +

            '<div style="' +
            'display:flex;' +
            'align-items:center;' +
            'gap:12px;' +
            'padding:10px 0 22px;' +
            '">' +

            '<button id="zyntraReferralBack" ' +
            'style="' +
            'width:45px;' +
            'margin:0;' +
            'padding:10px;' +
            'background:#20202d;' +
            '">' +

            '←' +

            '</button>' +

            '<div style="' +
            'font-size:23px;' +
            'font-weight:bold;' +
            '">👥 Referral</div>' +

            '</div>' +


            '<div style="' +
            'background:linear-gradient(135deg,#21100a,#24113b);' +
            'border:1px solid #44345b;' +
            'border-radius:22px;' +
            'padding:25px;' +
            'text-align:center;' +
            '">' +

            '<div style="font-size:48px;">' +
            '👥' +
            '</div>' +

            '<div style="' +
            'font-size:23px;' +
            'font-weight:bold;' +
            'margin-top:8px;' +
            '">' +

            'Invite & Earn' +

            '</div>' +

            '<div style="' +
            'color:#aaa;' +
            'margin-top:8px;' +
            'line-height:1.5;' +
            '">' +

            'Invite your friends to Zyntra ' +
            'and grow your network. 🚀' +

            '</div>' +

            '</div>' +


            '<div style="' +
            'background:#151521;' +
            'border:1px solid #29293a;' +
            'border-radius:18px;' +
            'padding:18px;' +
            'margin-top:12px;' +
            '">' +

            '<div style="' +
            'color:#aaa;' +
            'font-size:13px;' +
            '">' +

            'Your Referral Link' +

            '</div>' +

            '<input ' +
            'id="zyntraReferralInput" ' +
            'readonly ' +
            'value="' +
            link +
            '">' +

            '<button id="zyntraCopyBtn">' +
            '📋 Copy Link' +
            '</button>' +

            '<button id="zyntraShareBtn" ' +
            'class="secondary">' +
            '📤 Share Link' +
            '</button>' +

            '</div>' +

            '</div>';


        document.body.appendChild(
            page
        );


        document
            .getElementById(
                "zyntraReferralBack"
            )
            .onclick =
            function () {

                page.remove();

            };


        document
            .getElementById(
                "zyntraCopyBtn"
            )
            .onclick =
            copyReferral;


        document
            .getElementById(
                "zyntraShareBtn"
            )
            .onclick =
            shareReferral;

    }


    // ==============================
    // COPY
    // ==============================

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

                    if (
                        typeof window.showToast ===
                        "function"
                    ) {

                        window.showToast(
                            "Referral link copied! 🔗"
                        );

                    } else {

                        alert(
                            "Referral link copied!"
                        );

                    }

                });

        } else {

            prompt(
                "Copy your referral link:",
                link
            );

        }

    }


    // ==============================
    // SHARE
    // ==============================

    function shareReferral() {

        var link =
            getReferralLink();


        var url =
            "https://t.me/share/url?url=" +
            encodeURIComponent(link) +
            "&text=" +
            encodeURIComponent(
                "🚀 Join Zyntra Network!\n\n" +
                "Earn • Play • Grow 💰"
            );


        try {

            if (
                window.Telegram &&
                window.Telegram.WebApp &&
                window.Telegram.WebApp.openTelegramLink
            ) {

                window.Telegram.WebApp
                    .openTelegramLink(
                        url
                    );

                return;

            }

        } catch (e) {}


        window.open(
            url,
            "_blank"
        );

    }


    // ==============================
    // START
    // ==============================

    function start() {

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
