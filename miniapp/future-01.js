// =====================================================
// ZYNTRA FUTURE 01
// BOTTOM NAVIGATION + PROFILE + REFERRAL + MINING
// =====================================================

(function () {

    "use strict";

    console.log("Zyntra Future 01 Loaded ✅");

    // =================================================
    // TELEGRAM USER
    // =================================================

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


    function getName() {

        var user = getUser();

        return user
            ? (user.first_name || "User")
            : "User";
    }


    function getUsername() {

        var user = getUser();

        return user && user.username
            ? "@" + user.username
            : "No username";
    }


    function getUserId() {

        var user = getUser();

        return user
            ? (user.id || "")
            : "";
    }


    // =================================================
    // BALANCE
    // =================================================

    function getBalance() {

        try {

            if (typeof data !== "undefined") {

                return Number(data.bttc || 0);

            }

        } catch (e) {}

        return 0;
    }


    // =================================================
    // LEVEL
    // =================================================

    function getLevel(balance) {

        if (balance >= 100000) return 5;
        if (balance >= 50000) return 4;
        if (balance >= 25000) return 3;
        if (balance >= 10000) return 2;

        return 1;
    }


    // =================================================
    // REFERRAL LINK
    // =================================================

    function getReferralLink() {

        return (
            "https://t.me/ZyntraBotOfficial?start=" +
            encodeURIComponent(getUserId())
        );

    }


    // =================================================
    // STYLE
    // =================================================

    function addStyles() {

        if (document.getElementById("zyntraFutureStyle"))
            return;


        var style =
            document.createElement("style");


        style.id =
            "zyntraFutureStyle";


        style.innerHTML = `

        @keyframes zyntraPageIn {
            from {
                opacity:0;
                transform:translateY(15px);
            }
            to {
                opacity:1;
                transform:translateY(0);
            }
        }

        .zyntra-bottom-nav {
            position:fixed;
            left:0;
            right:0;
            bottom:0;
            height:76px;
            z-index:9999;
            background:rgba(8,8,15,.97);
            border-top:1px solid #292936;
            display:grid;
            grid-template-columns:repeat(5,1fr);
            align-items:center;
            padding:6px 5px;
            box-sizing:border-box;
            backdrop-filter:blur(12px);
        }

        .zyntra-nav-btn {
            border:0 !important;
            outline:none !important;
            background:transparent !important;
            box-shadow:none !important;
            margin:0 !important;
            padding:5px 2px !important;
            height:65px;
            color:#999;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            gap:3px;
            font-size:11px;
            font-weight:700;
        }

        .zyntra-nav-icon {
            font-size:25px;
            line-height:28px;
        }

        .zyntra-nav-btn.active {
            color:#ffb300;
        }

        .zyntra-nav-btn.mining {
            color:#fff;
            background:linear-gradient(
                145deg,
                rgba(70,50,0,.8),
                rgba(20,20,15,.9)
            ) !important;
            border-radius:18px !important;
            box-shadow:
                0 0 18px rgba(255,180,0,.25) !important;
        }

        .zyntra-nav-btn.mining .zyntra-nav-icon {
            font-size:29px;
        }

        .zyntra-page {
            position:fixed;
            inset:0;
            z-index:10000;
            background:
                radial-gradient(
                    circle at top,
                    #241505 0%,
                    #09090f 42%,
                    #050507 100%
                );
            overflow-y:auto;
            padding:18px 18px 100px;
            box-sizing:border-box;
            animation:zyntraPageIn .2s ease;
        }

        .zyntra-page-inner {
            max-width:520px;
            margin:auto;
        }

        .zyntra-page-head {
            display:flex;
            align-items:center;
            gap:12px;
            margin-bottom:20px;
        }

        .zyntra-back {
            width:45px !important;
            height:45px !important;
            margin:0 !important;
            padding:0 !important;
            border-radius:14px !important;
            background:#20202b !important;
            font-size:24px !important;
        }

        .zyntra-page-title {
            font-size:23px;
            font-weight:900;
        }

        .zyntra-card {
            background:
                linear-gradient(
                    145deg,
                    rgba(35,25,15,.95),
                    rgba(18,18,27,.98)
                );
            border:1px solid #3b3020;
            border-radius:22px;
            padding:22px;
            margin-bottom:12px;
            box-shadow:0 12px 35px rgba(0,0,0,.25);
        }

        .zyntra-avatar {
            width:82px;
            height:82px;
            margin:auto;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:40px;
            background:
                linear-gradient(
                    135deg,
                    #7135ff,
                    #ff2455
                );
            box-shadow:
                0 0 30px rgba(150,50,255,.25);
        }

        .zyntra-big-name {
            text-align:center;
            font-size:24px;
            font-weight:900;
            margin-top:13px;
        }

        .zyntra-small {
            color:#999;
            text-align:center;
            margin-top:5px;
        }

        .zyntra-stat-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
        }

        .zyntra-stat {
            background:#15151f;
            border:1px solid #292936;
            border-radius:16px;
            padding:16px;
        }

        .zyntra-stat-title {
            color:#999;
            font-size:12px;
            margin-bottom:5px;
        }

        .zyntra-stat-value {
            font-size:17px;
            font-weight:900;
        }

        .zyntra-mining-coin {
            width:170px;
            height:170px;
            margin:25px auto;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:52px;
            font-weight:900;
            color:#19120a;
            background:
                radial-gradient(
                    circle,
                    #fff0a0 0%,
                    #ffd447 40%,
                    #d58b00 75%,
                    #8c5700 100%
                );
            border:8px solid #e2ad28;
            box-shadow:
                0 0 35px rgba(255,180,0,.28),
                inset 0 0 25px rgba(255,255,255,.4);
        }

        .zyntra-mining-rate {
            text-align:center;
            font-size:18px;
            color:#00ff9d;
            font-weight:900;
        }

        .zyntra-mining-timer {
            text-align:center;
            color:#aaa;
            margin-top:7px;
        }

        .zyntra-start {
            width:100%;
            margin-top:20px !important;
            padding:18px !important;
            border-radius:18px !important;
            background:
                linear-gradient(
                    135deg,
                    #ffcc00,
                    #ff8a00
                ) !important;
            color:#111 !important;
            font-size:18px !important;
            font-weight:900 !important;
            box-shadow:
                0 8px 25px rgba(255,160,0,.22) !important;
        }

        .zyntra-copy-box {
            background:#101019;
            border:1px solid #292936;
            border-radius:15px;
            padding:13px;
            word-break:break-all;
            color:#ccc;
            font-size:13px;
            margin-top:10px;
        }

        .zyntra-action {
            width:100%;
            margin-top:12px !important;
        }

        /* App ke bottom nav ke liye space */
        body {
            padding-bottom:82px !important;
        }

        `;


        document.head.appendChild(style);

    }


    // =================================================
    // BOTTOM NAV
    // =================================================

    function createBottomNav() {

        if (
            document.getElementById(
                "zyntraBottomNav"
            )
        ) {
            return;
        }


        var nav =
            document.createElement("div");


        nav.id =
            "zyntraBottomNav";


        nav.className =
            "zyntra-bottom-nav";


        nav.innerHTML = `

        <button
            class="zyntra-nav-btn active"
            id="zyntraMineBtn">

            <span class="zyntra-nav-icon">⛏️</span>
            <span>Mine</span>

        </button>


        <button
            class="zyntra-nav-btn"
            id="zyntraTasksBtn">

            <span class="zyntra-nav-icon">📋</span>
            <span>Tasks</span>

        </button>


        <button
            class="zyntra-nav-btn mining"
            id="zyntraMiningBtn">

            <span class="zyntra-nav-icon">⚡</span>
            <span>Mining</span>

        </button>


        <button
            class="zyntra-nav-btn"
            id="zyntraFriendsBtn">

            <span class="zyntra-nav-icon">👥</span>
            <span>Friends</span>

        </button>


        <button
            class="zyntra-nav-btn"
            id="zyntraProfileBtn">

            <span class="zyntra-nav-icon">👤</span>
            <span>Profile</span>

        </button>

        `;


        document.body.appendChild(nav);


        document
            .getElementById("zyntraMineBtn")
            .onclick = function () {

                closePage();

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            };


        document
            .getElementById("zyntraTasksBtn")
            .onclick = function () {

                closePage();

                if (
                    typeof window.showTasks ===
                    "function"
                ) {
                    window.showTasks();
                }

            };


        document
            .getElementById("zyntraMiningBtn")
            .onclick =
            openMining;


        document
            .getElementById("zyntraFriendsBtn")
            .onclick =
            openReferral;


        document
            .getElementById("zyntraProfileBtn")
            .onclick =
            openProfile;

    }


    // =================================================
    // CLOSE PAGE
    // =================================================

    function closePage() {

        var pages =
            document.querySelectorAll(
                ".zyntra-page"
            );


        pages.forEach(function (p) {

            p.remove();

        });

    }


    // =================================================
    // CREATE PAGE
    // =================================================

    function createPage(id) {

        closePage();


        var page =
            document.createElement("div");


        page.id = id;

        page.className =
            "zyntra-page";


        document.body.appendChild(page);


        return page;

    }


    // =================================================
    // PAGE HEADER
    // =================================================

    function pageHeader(
        title,
        backId
    ) {

        return `

        <div class="zyntra-page-head">

            <button
                class="zyntra-back"
                id="${backId}">
                ←
            </button>

            <div class="zyntra-page-title">
                ${title}
            </div>

        </div>

        `;

    }


    // =================================================
    // PROFILE
    // =================================================

    function openProfile() {

        var page =
            createPage(
                "zyntraProfilePage"
            );


        var balance =
            getBalance();


        var level =
            getLevel(balance);


        page.innerHTML = `

        <div class="zyntra-page-inner">

            ${pageHeader(
                "👤 Profile",
                "profileBack"
            )}


            <div class="zyntra-card">

                <div class="zyntra-avatar">
                    👤
                </div>

                <div class="zyntra-big-name">
                    ${escapeHtml(getName())}
                </div>

                <div class="zyntra-small">
                    ${escapeHtml(getUsername())}
                </div>

            </div>


            <div class="zyntra-stat-grid">

                <div class="zyntra-stat">

                    <div class="zyntra-stat-title">
                        💰 Balance
                    </div>

                    <div class="zyntra-stat-value">
                        ${balance.toLocaleString()} BTTC
                    </div>

                </div>


                <div class="zyntra-stat">

                    <div class="zyntra-stat-title">
                        ⭐ Level
                    </div>

                    <div class="zyntra-stat-value">
                        Level ${level}
                    </div>

                </div>

            </div>


            <button
                class="zyntra-action"
                id="profileFriends">

                👥 Invite Friends

            </button>

        </div>

        `;


        document
            .getElementById("profileBack")
            .onclick =
            closePage;


        document
            .getElementById("profileFriends")
            .onclick =
            openReferral;

    }


    // =================================================
    // REFERRAL / FRIENDS
    // =================================================

    function openReferral() {

        var page =
            createPage(
                "zyntraReferralPage"
            );


        var link =
            getReferralLink();


        page.innerHTML = `

        <div class="zyntra-page-inner">

            ${pageHeader(
                "👥 Friends",
                "friendsBack"
            )}


            <div class="zyntra-card"
                 style="text-align:center;">

                <div style="font-size:52px;">
                    👥
                </div>

                <div style="
                    font-size:24px;
                    font-weight:900;
                    margin-top:10px;
                ">

                    Invite & Earn 🚀

                </div>

                <div style="
                    color:#999;
                    line-height:1.5;
                    margin-top:8px;
                ">

                    Apne friends ko Zyntra mein
                    invite karo aur network grow karo.

                </div>

            </div>


            <div class="zyntra-card">

                <div style="
                    color:#999;
                    font-size:13px;
                ">

                    Your Referral Link

                </div>


                <div class="zyntra-copy-box">
                    ${escapeHtml(link)}
                </div>


                <button
                    class="zyntra-action"
                    id="copyReferral">

                    📋 Copy Link

                </button>


                <button
                    class="zyntra-action"
                    id="shareReferral">

                    📤 Share Link

                </button>

            </div>

        </div>

        `;


        document
            .getElementById("friendsBack")
            .onclick =
            closePage;


        document
            .getElementById("copyReferral")
            .onclick =
            copyReferral;


        document
            .getElementById("shareReferral")
            .onclick =
            shareReferral;

    }


    // =================================================
    // COPY REFERRAL
    // =================================================

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

                });

        } else {

            prompt(
                "Copy your referral link:",
                link
            );

        }

    }


    // =================================================
    // SHARE REFERRAL
    // =================================================

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
                    .openTelegramLink(url);

                return;

            }

        } catch (e) {}


        window.open(
            url,
            "_blank"
        );

    }


    // =================================================
    // MINING DATA
    // =================================================

    var miningKey =
        "zyntra_mining_v1";


    var mining = {

        active:false,

        startedAt:0,

        duration:3600,

        earned:0

    };


    function loadMining() {

        try {

            var saved =
                localStorage.getItem(
                    miningKey
                );


            if (saved) {

                mining =
                    Object.assign(
                        mining,
                        JSON.parse(saved)
                    );

            }

        } catch (e) {}

    }


    function saveMining() {

        try {

            localStorage.setItem(
                miningKey,
                JSON.stringify(mining)
            );

        } catch (e) {}

    }


    // =================================================
    // MINING PAGE
    // =================================================

        function openMining() {

        loadMining();


        var page =
            createPage(
                "zyntraMiningPage"
            );


        page.innerHTML = `

        <div class="zyntra-page-inner">

            ${pageHeader(
                "⚡ Mining",
                "miningBack"
            )}


            <div class="zyntra-card"
                 style="text-align:center;">

                <div style="
                    color:#999;
                    letter-spacing:2px;
                    font-size:13px;
                ">

                    ZYNTRA MINING

                </div>


                <div class="zyntra-mining-coin">
                    Z
                </div>


                <div class="zyntra-mining-rate">

                    +500 BTTC / Hour

                </div>


                <div
                    class="zyntra-mining-timer"
                    id="miningTimer">

                    Ready to start mining

                </div>


                <button
                    class="zyntra-start"
                    id="startMiningBtn">

                    ⚡ START MINING

                </button>

            </div>


            <div class="zyntra-stat-grid">

                <div class="zyntra-stat">

                    <div class="zyntra-stat-title">
                        ⛏️ Status
                    </div>

                    <div
                        class="zyntra-stat-value"
                        id="miningStatus">

                        READY

                    </div>

                </div>


                <div class="zyntra-stat">

                    <div class="zyntra-stat-title">
                        💰 Session Earned
                    </div>

                    <div
                        class="zyntra-stat-value"
                        id="miningEarned">

                        0 BTTC

                    </div>

                </div>

            </div>


            <div class="zyntra-card"
                 style="margin-top:12px;">

                <div style="
                    font-size:17px;
                    font-weight:900;
                ">

                    ℹ️ How Mining Works

                </div>

                <div style="
                    color:#999;
                    line-height:1.6;
                    margin-top:9px;
                    font-size:14px;
                ">

                    Mining start karo aur mining
                    session ko complete hone do.

                    <br><br>

                    Mining ke dauran progress
                    automatically update hogi.

                </div>

            </div>

        </div>

        `;


        document
            .getElementById("miningBack")
            .onclick =
            closePage;


        document
            .getElementById("startMiningBtn")
            .onclick =
            startMining;


        updateMiningUI();

    }


    // =================================================
    // START MINING
    // =================================================

    function startMining() {

        loadMining();


        if (mining.active) {

            toast(
                "Mining already running ⚡"
            );

            updateMiningUI();

            return;

        }


        mining.active = true;

        mining.startedAt =
            Date.now();

        mining.earned = 0;


        saveMining();


        updateMiningUI();


        toast(
            "Mining started! ⚡"
        );

    }


    // =================================================
    // MINING UI
    // =================================================

    function updateMiningUI() {

        var timer =
            document.getElementById(
                "miningTimer"
            );


        var status =
            document.getElementById(
                "miningStatus"
            );


        var earned =
            document.getElementById(
                "miningEarned"
            );


        var button =
            document.getElementById(
                "startMiningBtn"
            );


        if (
            !timer ||
            !status ||
            !earned ||
            !button
        ) {
            return;
        }


        loadMining();


        if (!mining.active) {

            timer.innerText =
                "Ready to start mining";

            status.innerText =
                "READY";

            earned.innerText =
                "0 BTTC";

            button.innerText =
                "⚡ START MINING";

            return;

        }


        var elapsed =
            Math.floor(
                (Date.now() -
                mining.startedAt) / 1000
            );


        if (
            elapsed >=
            mining.duration
        ) {

            mining.active =
                false;


            mining.earned =
                500;


            saveMining();


            timer.innerText =
                "Mining session completed 🎉";

            status.innerText =
                "COMPLETED";

            earned.innerText =
                "500 BTTC";

            button.innerText =
                "⚡ START AGAIN";


            return;

        }


        var remaining =
            mining.duration -
            elapsed;


        var minutes =
            Math.floor(
                remaining / 60
            );


        var seconds =
            remaining % 60;


        timer.innerText =
            "Mining: " +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");


        status.innerText =
            "MINING";


        var currentEarn =
            Math.floor(
                (elapsed /
                mining.duration) *
                500
            );


        earned.innerText =
            currentEarn +
            " BTTC";


        button.innerText =
            "⛏️ MINING...";

    }


    // =================================================
    // MINING TIMER
    // =================================================

    setInterval(
        function () {

            if (
                document.getElementById(
                    "zyntraMiningPage"
                )
            ) {

                updateMiningUI();

            }

        },
        1000
    );


    // =================================================
    // TASKS
    // =================================================

    function openTasks() {

        closePage();


        if (
            typeof window.showTasks ===
            "function"
        ) {

            window.showTasks();

        }

    }


    // =================================================
    // TOAST
    // =================================================

    function toast(message) {

        if (
            typeof window.showToast ===
            "function"
        ) {

            window.showToast(
                message
            );

            return;

        }


        var t =
            document.createElement("div");


        t.innerText =
            message;


        t.style.cssText =
            "position:fixed;" +
            "bottom:95px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "background:#22222e;" +
            "color:white;" +
            "padding:12px 18px;" +
            "border-radius:14px;" +
            "z-index:20000;" +
            "font-size:14px;" +
            "font-weight:bold;" +
            "box-shadow:0 8px 25px rgba(0,0,0,.3);";


        document.body.appendChild(t);


        setTimeout(
            function () {

                t.remove();

            },
            2200
        );

    }


    // =================================================
    // ESCAPE HTML
    // =================================================

    function escapeHtml(text) {

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =================================================
    // START
    // =================================================

    function start() {

        addStyles();

        createBottomNav();

        loadMining();

        console.log(
            "Zyntra Bottom Navigation Ready ✅"
        );

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
