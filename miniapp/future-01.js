// ============================================================
// ZYNTRA FUTURE-01 — PROFESSIONAL MINING SYSTEM
// Plain JavaScript — No React
// ============================================================

(function () {
    "use strict";

    console.log("Zyntra Mining System Loaded ✅");

    // ========================================================
    // MINING IMAGES
    // ========================================================

    const BOY_IMG = "./zyntra-boy.png";
    const GIRL_IMG = "./zyntra-girl.png";

    // ========================================================
    // SETTINGS
    // ========================================================

    const MINING_REWARD = 500;
    const MINING_DURATION = 60 * 60; // 1 hour
    const MINING_KEY = "zyntra_mining_final";
    const GENDER_KEY = "zyntra_gender";

    let gender = localStorage.getItem(GENDER_KEY);
    let mining = loadMining();

    // ========================================================
    // STORAGE
    // ========================================================

    function loadMining() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(MINING_KEY)
            );

            if (saved) return saved;
        } catch (e) {
            console.log("Mining storage reset");
        }

        return {
            active: false,
            startedAt: 0,
            duration: MINING_DURATION,
            reward: MINING_REWARD,
            claimed: false
        };
    }

    function saveMining() {
        localStorage.setItem(
            MINING_KEY,
            JSON.stringify(mining)
        );
    }

    // ========================================================
    // BALANCE CONNECTION
    // ========================================================

    function getBalance() {
        try {
            if (typeof data !== "undefined" && data) {
                return Number(data.bttc || 0);
            }

            return Number(
                localStorage.getItem("zyntra_bttc") || 0
            );
        } catch (e) {
            return 0;
        }
    }

    function addBalance(amount) {

        try {

            if (typeof data !== "undefined" && data) {

                data.bttc =
                    Number(data.bttc || 0) + amount;

                if (typeof saveData === "function") {
                    saveData();
                }

                if (typeof update === "function") {
                    update();
                }

                return;
            }

            const oldBalance = Number(
                localStorage.getItem("zyntra_bttc") || 0
            );

            localStorage.setItem(
                "zyntra_bttc",
                String(oldBalance + amount)
            );

        } catch (e) {
            console.log("Balance update error", e);
        }
    }

    // ========================================================
    // TOAST
    // ========================================================

    function toast(message) {

        if (typeof window.showToast === "function") {
            window.showToast(message);
            return;
        }

        let old = document.getElementById(
            "zyntra-mining-toast"
        );

        if (old) old.remove();

        const t = document.createElement("div");

        t.id = "zyntra-mining-toast";

        t.innerText = message;

        t.style.cssText = `
            position:fixed;
            left:50%;
            bottom:90px;
            transform:translateX(-50%);
            background:#111827;
            color:white;
            padding:12px 20px;
            border-radius:14px;
            border:1px solid rgba(0,229,255,.35);
            box-shadow:0 0 25px rgba(0,229,255,.25);
            z-index:999999;
            font-size:14px;
            font-weight:700;
            white-space:nowrap;
        `;

        document.body.appendChild(t);

        setTimeout(() => {
            t.remove();
        }, 2200);
    }

    // ========================================================
    // THEME
    // ========================================================

    function getTheme() {

        if (gender === "female") {
            return {
                main: "#FF2D95",
                second: "#9C27B0",
                glow: "rgba(255,45,149,.55)",
                image: GIRL_IMG
            };
        }

        return {
            main: "#00E5FF",
            second: "#1769FF",
            glow: "rgba(0,229,255,.55)",
            image: BOY_IMG
        };
    }

    // ========================================================
    // CSS
    // ========================================================

    function addMiningCSS() {

        if (document.getElementById(
            "zyntra-mining-css"
        )) return;

        const style = document.createElement("style");

        style.id = "zyntra-mining-css";

        style.innerHTML = `

        #zyntra-mining-screen {
            position:fixed;
            inset:0;
            z-index:99990;
            overflow-y:auto;
            background:#080b14;
            color:white;
            font-family:Arial,sans-serif;
            padding-bottom:100px;
        }

        .zm-header {
            padding:18px 18px 5px;
            text-align:center;
        }

        .zm-logo {
            font-size:25px;
            font-weight:900;
            letter-spacing:3px;
        }

        .zm-subtitle {
            margin-top:5px;
            font-size:11px;
            opacity:.6;
            letter-spacing:2px;
        }

        .zm-balance {
            margin:16px;
            padding:16px;
            border-radius:18px;
            background:linear-gradient(
                135deg,
                rgba(255,255,255,.07),
                rgba(255,255,255,.02)
            );
            border:1px solid rgba(255,255,255,.08);
            text-align:center;
        }

        .zm-balance-label {
            font-size:11px;
            opacity:.55;
            letter-spacing:2px;
        }

        .zm-balance-value {
            margin-top:5px;
            font-size:25px;
            font-weight:900;
        }

        .zm-mining-wrap {
            position:relative;
            width:min(92vw,390px);
            aspect-ratio:1/1;
            margin:12px auto;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .zm-ring {
            position:absolute;
            inset:0;
            border-radius:50%;
            border:2px solid var(--zm-main);
            box-shadow:
                0 0 12px var(--zm-main),
                0 0 35px var(--zm-glow),
                inset 0 0 30px var(--zm-glow);
            animation:zmRotate 12s linear infinite;
        }

        .zm-ring2 {
            position:absolute;
            inset:8%;
            border-radius:50%;
            border:1px dashed var(--zm-main);
            opacity:.65;
            animation:zmRotateReverse 9s linear infinite;
        }

        .zm-image {
            position:relative;
            width:88%;
            height:88%;
            object-fit:contain;
            border-radius:50%;
            filter:
                drop-shadow(0 0 18px var(--zm-glow))
                drop-shadow(0 0 40px var(--zm-glow));
            animation:zmFloat 3s ease-in-out infinite;
        }

        .zm-status {
            text-align:center;
            margin-top:-5px;
            font-size:12px;
            font-weight:800;
            letter-spacing:2px;
            color:var(--zm-main);
        }

        .zm-counter {
            text-align:center;
            margin-top:7px;
            font-size:30px;
            font-weight:900;
            letter-spacing:1px;
        }

        .zm-counter span {
            font-size:12px;
            opacity:.6;
            margin-left:5px;
        }

        .zm-stats {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin:16px;
        }

        .zm-stat {
            padding:14px;
            border-radius:15px;
            background:#101521;
            border:1px solid rgba(255,255,255,.07);
            text-align:center;
        }

        .zm-stat-label {
            font-size:10px;
            opacity:.5;
            letter-spacing:1px;
        }

        .zm-stat-value {
            margin-top:6px;
            font-weight:900;
            font-size:16px;
        }

        .zm-main-button {
            display:block;
            width:calc(100% - 32px);
            margin:15px 16px;
            padding:16px;
            border:0;
            border-radius:16px;
            background:linear-gradient(
                135deg,
                var(--zm-main),
                var(--zm-second)
            );
            color:white;
            font-size:16px;
            font-weight:900;
            box-shadow:
                0 0 20px var(--zm-glow);
            cursor:pointer;
        }

        .zm-main-button:active {
            transform:scale(.97);
        }

        .zm-info {
            margin:16px;
            padding:15px;
            border-radius:16px;
            background:#0e131f;
            border:1px solid rgba(255,255,255,.06);
        }

        .zm-info-title {
            font-size:12px;
            font-weight:900;
            margin-bottom:8px;
            color:var(--zm-main);
        }

        .zm-info-text {
            font-size:12px;
            line-height:1.6;
            opacity:.65;
        }

        @keyframes zmRotate {
            from { transform:rotate(0deg); }
            to { transform:rotate(360deg); }
        }

        @keyframes zmRotateReverse {
            from { transform:rotate(360deg); }
            to { transform:rotate(0deg); }
        }

        @keyframes zmFloat {
            0%,100% {
                transform:translateY(0);
            }

            50% {
                transform:translateY(-7px);
            }
        }

        `;

        document.head.appendChild(style);
    }

    // ========================================================
    // GENDER SCREEN
    // ========================================================

    function showGenderScreen() {

        const old = document.getElementById(
            "zyntra-gender-screen"
        );

        if (old) old.remove();

        const box = document.createElement("div");

        box.id = "zyntra-gender-screen";

        box.style.cssText = `
            position:fixed;
            inset:0;
            z-index:100000;
            background:#080b14;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:25px;
            font-family:Arial,sans-serif;
        `;

        box.innerHTML = `

            <div style="
                width:100%;
                max-width:380px;
                text-align:center;
            ">

                <div style="
                    font-size:30px;
                    font-weight:900;
                    letter-spacing:3px;
                ">
                    ZYNTRA
                </div>

                <div style="
                    margin-top:8px;
                    opacity:.6;
                    font-size:12px;
                    letter-spacing:2px;
                ">
                    CHOOSE YOUR MINING STYLE
                </div>

                <div style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:14px;
                    margin-top:35px;
                ">

                    <button
                        onclick="window.zyntraSelectGender('male')"
                        style="
                            padding:10px;
                            border-radius:20px;
                            border:1px solid #00E5FF;
                            background:#07151d;
                            color:white;
                        "
                    >
                        <img
                            src="${BOY_IMG}"
                            style="
                                width:100%;
                                border-radius:15px;
                                display:block;
                            "
                        >

                        <div style="
                            padding:12px 5px 5px;
                            font-weight:900;
                            color:#00E5FF;
                        ">
                            MALE
                        </div>
                    </button>

                    <button
                        onclick="window.zyntraSelectGender('female')"
                        style="
                            padding:10px;
                            border-radius:20px;
                            border:1px solid #FF2D95;
                            background:#190914;
                            color:white;
                        "
                    >
                        <img
                            src="${GIRL_IMG}"
                            style="
                                width:100%;
                                border-radius:15px;
                                display:block;
                            "
                        >

                        <div style="
                            padding:12px 5px 5px;
                            font-weight:900;
                            color:#FF2D95;
                        ">
                            FEMALE
                        </div>
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(box);
    }

    // ========================================================
    // SELECT GENDER
    // ========================================================

    window.zyntraSelectGender = function (selected) {

        gender = selected;

        localStorage.setItem(
            GENDER_KEY,
            selected
        );

        const screen =
            document.getElementById(
                "zyntra-gender-screen"
            );

        if (screen) screen.remove();

        renderMining();

        toast(
            selected === "female"
                ? "Pink Mining Mode Activated 💗"
                : "Blue Mining Mode Activated 💙"
        );
    };

    // ========================================================
    // MINING SCREEN
    // ========================================================

    function renderMining() {

        const theme = getTheme();

        let screen =
            document.getElementById(
                "zyntra-mining-screen"
            );

        if (!screen) {

            screen = document.createElement("div");

            screen.id =
                "zyntra-mining-screen";

            document.body.appendChild(screen);
        }

        screen.style.setProperty(
            "--zm-main",
            theme.main
        );

        screen.style.setProperty(
            "--zm-second",
            theme.second
        );

        screen.style.setProperty(
            "--zm-glow",
            theme.glow
        );

        screen.innerHTML = `

            <div class="zm-header">

                <div
                    class="zm-logo"
                    style="color:${theme.main}"
                >
                    ZYNTRA
                </div>

                <div class="zm-subtitle">
                    MINING NETWORK
                </div>

            </div>

            <div class="zm-balance">

                <div class="zm-balance-label">
                    TOTAL BALANCE
                </div>

                <div class="zm-balance-value">
                    ${getBalance().toLocaleString()}
                    <span style="
                        font-size:11px;
                        opacity:.6;
                    ">
                        BTTC
                    </span>
                </div>

            </div>

            <div class="zm-mining-wrap">

                <div class="zm-ring"></div>

                <div class="zm-ring2"></div>

                <img
                    class="zm-image"
                    src="${theme.image}"
                    onerror="
                        this.style.display='none';
                    "
                >

            </div>

            <div
                class="zm-status"
                id="zm-status"
            >
                ${mining.active
                    ? "● MINING ACTIVE"
                    : "● MINING READY"}
            </div>

            <div
                class="zm-counter"
                id="zm-counter"
            >
                0.00000
                <span>BTTC</span>
            </div>

            <div class="zm-stats">

                <div class="zm-stat">

                    <div class="zm-stat-label">
                        HASH RATE
                    </div>

                    <div
                        class="zm-stat-value"
                        style="color:${theme.main}"
                    >
                        1.24 GH/s
                    </div>

                </div>

                <div class="zm-stat">

                    <div class="zm-stat-label">
                        POWER
                    </div>

                    <div
                        class="zm-stat-value"
                        style="color:${theme.main}"
                    >
                        98%
                    </div>

                </div>

            </div>

            <button
                class="zm-main-button"
                id="zm-main-button"
                onclick="window.zyntraMiningAction()"
            >
                ${getMiningButtonText()}
            </button>

            <div class="zm-info">

                <div class="zm-info-title">
                    ZYNTRA MINING
                </div>

                <div class="zm-info-text">
                    Start your mining session and keep
                    the mining screen active until the
                    session is completed.
                    <br><br>
                    Mining Reward:
                    <b style="color:${theme.main}">
                        +${MINING_REWARD} BTTC
                    </b>
                </div>

            </div>
        `;

        updateMiningDisplay();
    }

    // ========================================================
    // BUTTON TEXT
    // ========================================================

    function getMiningButtonText() {

        if (!mining.active) {

            if (mining.claimed) {
                return "START NEW MINING";
            }

            return "START MINING";
        }

        const remaining =
            getRemainingSeconds();

        if (remaining <= 0) {
            return "CLAIM MINING REWARD";
        }

        return "MINING IN PROGRESS...";
    }

    // ========================================================
    // START MINING
    // ========================================================

    function startMining() {

        mining = {
            active: true,
            startedAt: Date.now(),
            duration: MINING_DURATION,
            reward: MINING_REWARD,
            claimed: false
        };

        saveMining();

        updateMiningDisplay();

        toast(
            "Mining Started ⚡"
        );
    }

     // ========================================================
    // REMAINING TIME
    // ========================================================

    function getRemainingSeconds() {

        if (!mining.active) {
            return 0;
        }

        const elapsed =
            Math.floor(
                (Date.now() - mining.startedAt) / 1000
            );

        return Math.max(
            0,
            mining.duration - elapsed
        );
    }

    // ========================================================
    // CLAIM MINING REWARD
    // ========================================================

    function claimMining() {

        if (!mining.active) {
            return;
        }

        if (getRemainingSeconds() > 0) {

            toast("Mining is still running ⛏️");

            return;
        }

        if (mining.claimed) {
            return;
        }

        const reward =
            Number(mining.reward || MINING_REWARD);

        mining.active = false;
        mining.claimed = true;

        saveMining();

        addBalance(reward);

        updateMiningDisplay();

        toast(
            "+" + reward +
            " BTTC Mining Reward Claimed 🎉"
        );
    }

    // ========================================================
    // MAIN MINING BUTTON
    // ========================================================

    window.zyntraMiningAction = function () {

        // Start new mining
        if (!mining.active) {

            startMining();

            return;
        }

        // Mining completed
        if (getRemainingSeconds() <= 0) {

            claimMining();

            return;
        }

        // Already running
        toast("Mining is already active ⛏️");
    };

    // ========================================================
    // MINING DISPLAY UPDATE
    // ========================================================

    function updateMiningDisplay() {

        const counter =
            document.getElementById("zm-counter");

        const status =
            document.getElementById("zm-status");

        const button =
            document.getElementById("zm-main-button");

        if (!counter || !status || !button) {
            return;
        }

        // ------------------------------------
        // ACTIVE MINING
        // ------------------------------------

        if (mining.active) {

            const remaining =
                getRemainingSeconds();

            const elapsed =
                Math.min(
                    mining.duration,
                    mining.duration - remaining
                );

            const progress =
                mining.duration > 0
                    ? elapsed / mining.duration
                    : 0;

            const earned =
                progress *
                Number(
                    mining.reward || MINING_REWARD
                );

            counter.innerHTML =
                earned.toFixed(5) +
                '<span>BTTC</span>';

            // Completed
            if (remaining <= 0) {

                status.innerHTML =
                    "● MINING COMPLETE";

                button.innerText =
                    "CLAIM MINING REWARD";

            } else {

                status.innerHTML =
                    "● MINING ACTIVE";

                button.innerText =
                    "MINING IN PROGRESS...";

            }

        }

        // ------------------------------------
        // NOT ACTIVE
        // ------------------------------------

        else {

            counter.innerHTML =
                "0.00000" +
                '<span>BTTC</span>';

            if (mining.claimed) {

                status.innerHTML =
                    "● REWARD CLAIMED";

                button.innerText =
                    "START NEW MINING";

            } else {

                status.innerHTML =
                    "● MINING READY";

                button.innerText =
                    "START MINING";
            }
        }
    }

    // ========================================================
    // OPEN MINING SCREEN
    // ========================================================

    window.openMining = function () {

        const screen =
            document.getElementById(
                "zyntra-mining-screen"
            );

        if (screen) {

            screen.style.display = "block";

        } else {

            renderMining();

        }

        window.scrollTo(0, 0);
    };

    // ========================================================
    // LIVE MINING UPDATE
    // ========================================================

    setInterval(function () {

        mining = loadMining();

        const screen =
            document.getElementById(
                "zyntra-mining-screen"
            );

        if (screen) {

            updateMiningDisplay();

        }

    }, 1000);

    // ========================================================
    // INITIALIZE
    // ========================================================

    function init() {

        addMiningCSS();

        if (!gender) {

            showGenderScreen();

        } else {

            renderMining();

        }
    }

    // ========================================================
    // START
    // ========================================================

    setTimeout(function () {

        init();

    }, 500);

})();
