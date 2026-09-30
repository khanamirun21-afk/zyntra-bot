// =====================================================
// ZYNTRA FUTURE 01
// 👥 SIMPLE REFERRAL PAGE
// =====================================================

(function () {

    "use strict";

    console.log("Zyntra Referral Loaded ✅");


    // ===============================
    // TELEGRAM USER
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

        } catch (e) {}

        return null;
    }


    // ===============================
    // REFERRAL LINK
    // ===============================

    function getReferralLink() {

        var user = getUser();

        var id =
            user && user.id
                ? user.id
                : "";

        return (
            "https://t.me/" +
            "ZyntraBotOfficial" +
            "?start=" +
            encodeURIComponent(id)
        );

    }


    // ===============================
    // CREATE REFERRAL BUTTON
    // ===============================

    function createReferralButton() {

        if (
            document.getElementById(
                "zyntraReferralButton"
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


        var button =
            document.createElement(
                "button"
            );


        button.id =
            "zyntraReferralButton";


        button.className =
            "secondary";


        button.innerText =
            "👥 Referral";


        button.style.marginTop =
            "5px";


        button.onclick =
            openReferralPage;


        container.appendChild(
            button
        );

    }


    // ===============================
    // REFERRAL PAGE
    // ===============================

    function openReferralPage() {

        var old =
            document.getElementById(
                "zyntraReferralPage"
            );

        if (old) {
            old.remove();
        }


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
            "background:#090912;" +
            "z-index:10001;" +
            "overflow-y:auto;" +
            "padding:20px;";


        page.innerHTML =

            '<div style="' +
            'max-width:520px;' +
            'margin:auto;' +
            '">' +

            '<div style="' +
            'text-align:center;' +
            'padding:25px 0;' +
            '">' +

            '<div style="' +
            'font-size:45px;' +
            '">👥</div>' +

            '<div style="' +
            'font-size:28px;' +
            'font-weight:bold;' +
            'color:#ff7a00;' +
            'margin-top:8px;' +
            '">' +

            'Referral' +

            '</div>' +

            '<div style="' +
            'color:#aaa;' +
            'margin-top:6px;' +
            '">' +

            'Invite friends and grow Zyntra' +

            '</div>' +

            '</div>' +


            '<div class="card">' +

            '<div class="section-title">' +
            '🔗 Your Referral Link' +
            '</div>' +

            '<div class="small">' +
            'Share this link with your friends.' +
            '</div>' +

            '<input ' +
            'id="zyntraReferralInput" ' +
            'readonly ' +
            'value="' +
            link +
            '">' +

            '<button id="zyntraCopyReferral">' +
            '📋 Copy Link' +
            '</button>' +

            '<button ' +
            'class="secondary" ' +
            'id="zyntraShareReferral">' +
            '📤 Share Link' +
            '</button>' +

            '</div>' +


            '<div class="card">' +

            '<div class="section-title">' +
            '🎁 Referral Rewards' +
            '</div>' +

            '<div class="small">' +

            'Invite friends to Zyntra.' +
            '<br><br>' +
            'Referral rewards will be connected ' +
            'to the secure backend system.' +

            '</div>' +

            '</div>' +


            '<button ' +
            'class="close" ' +
            'id="zyntraCloseReferral">' +

            '← Back to Zyntra' +

            '</button>' +

            '</div>';


        document.body.appendChild(
            page
        );


        document
            .getElementById(
                "zyntraCopyReferral"
            )
            .onclick =
            copyReferral;


        document
            .getElementById(
                "zyntraShareReferral"
            )
            .onclick =
            shareReferral;


        document
            .getElementById(
                "zyntraCloseReferral"
            )
            .onclick =
            function () {

                page.remove();

            };

    }


    // ===============================
    // COPY
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


    // ===============================
    // TELEGRAM SHARE
    // ===============================

    function shareReferral() {

        var link =
            getReferralLink();


        var shareUrl =
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

        } catch (e) {}


        window.open(
            shareUrl,
            "_blank"
        );

    }


    // ===============================
    // START
    // ===============================

    function start() {

        createReferralButton();

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
