// ============================================================
// ZYNTRA NETWORK - PROFESSIONAL FEATURES
// Version 2.1 - Fixed & Compatible
// ============================================================

(function () {

    "use strict";

    console.log("🚀 Zyntra Professional Features Loaded ✅");


    // ============================================================
    // BASIC HELPERS
    // ============================================================

    function getData() {
        try {
            if (typeof data !== "undefined" && data) {
                return data;
            }
        } catch (e) {
            console.log("Data unavailable:", e);
        }

        return null;
    }


    function refresh() {
        try {
            if (typeof save === "function") {
                save();
            }

            if (typeof update === "function") {
                update();
            }
        } catch (e) {
            console.log("Refresh error:", e);
        }
    }


    function addBTTC(amount) {

        const d = getData();

        if (!d) {
            showToast("❌ Account data unavailable");
            return false;
        }

        d.bttc = Number(d.bttc) || 0;
        d.bttc += Number(amount);

        refresh();

        return true;
    }


    // ============================================================
    // FEATURE 1 - TOAST NOTIFICATION
    // ============================================================

    window.showToast = function (msg) {

        const old =
            document.getElementById("zyntraToast");

        if (old) {
            old.remove();
        }


        const toast =
            document.createElement("div");

        toast.id =
            "zyntraToast";

        toast.innerText =
            msg;


        toast.style.cssText =
            "position:fixed;" +
            "left:50%;" +
            "bottom:20px;" +
            "transform:translateX(-50%);" +
            "background:#1f1f1f;" +
            "border:1px solid #333;" +
            "color:white;" +
            "padding:12px 20px;" +
            "border-radius:30px;" +
            "z-index:999999;" +
            "font-size:14px;" +
            "font-weight:600;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.55);" +
            "transition:all .3s ease;" +
            "max-width:90%;" +
            "text-align:center;";


        document.body.appendChild(toast);


        setTimeout(function () {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

        }, 2500);


        setTimeout(function () {

            if (toast.parentNode) {
                toast.remove();
            }

        }, 3000);
    };


    // ============================================================
    // FEATURE 2 - DAILY STREAK
    // ============================================================

    let streak = {
        count: 0,
        last: ""
    };


    try {

        streak =
            JSON.parse(
                localStorage.getItem(
                    "zyntra_streak"
                ) ||
                '{"count":0,"last":""}'
            );

    } catch (e) {

        streak = {
            count: 0,
            last: ""
        };
    }


    const todayStr =
        new Date().toDateString();


    const yesterdayStr =
        new Date(
            Date.now() - 86400000
        ).toDateString();


    if (streak.last !== todayStr) {

        if (
            streak.last === yesterdayStr
        ) {

            streak.count += 1;

        } else {

            streak.count = 1;
        }


        streak.last =
            todayStr;


        localStorage.setItem(
            "zyntra_streak",
            JSON.stringify(streak)
        );


        // Streak reward starts from Day 2
        if (streak.count > 1) {

            const bonus =
                streak.count * 100;


            setTimeout(function () {

                if (
                    addBTTC(bonus)
                ) {

                    showToast(
                        "🔥 " +
                        streak.count +
                        " Day Streak! +" +
                        bonus +
                        " BTTC"
                    );
                }

            }, 1500);
        }
    }


    // ============================================================
    // FEATURE 3 - LEVEL SYSTEM
    // ============================================================

    function getLevel(bttc) {

        bttc =
            Number(bttc) || 0;


        if (bttc >= 50000) {

            return {
                level: 5,
                name: "Diamond 💎"
            };

        }


        if (bttc >= 25000) {

            return {
                level: 4,
                name: "Platinum 🏆"
            };

        }


        if (bttc >= 10000) {

            return {
                level: 3,
                name: "Gold 🥇"
            };

        }


        if (bttc >= 3000) {

            return {
                level: 2,
                name: "Silver 🥈"
            };

        }


        return {
            level: 1,
            name: "Bronze 🥉"
        };
    }


    window.getZyntraLevel =
        getLevel;


    // ============================================================
    // LEVEL DISPLAY
    // ============================================================

    function updateLevelDisplay() {

        try {

            const d =
                getData();


            if (!d) {
                return;
            }


            const statusEl =
                document.getElementById(
                    "status"
                );


            if (!statusEl) {
                return;
            }


            const level =
                getLevel(d.bttc);


            let baseStatus =
                statusEl.getAttribute(
                    "data-zyntra-base-status"
                );


            if (!baseStatus) {

                baseStatus =
                    statusEl.innerText ||
                    "Active";


                statusEl.setAttribute(
                    "data-zyntra-base-status",
                    baseStatus
                );
            }


            // Remove previously added level
            if (
                baseStatus.indexOf(
                    "Level "
                ) === 0
            ) {

                const separator =
                    baseStatus.indexOf("|");


                if (separator !== -1) {

                    baseStatus =
                        baseStatus.substring(
                            separator + 1
                        ).trim();
                }
            }


            statusEl.innerText =
                "Level " +
                level.level +
                " - " +
                level.name +
                " | " +
                baseStatus;

        } catch (e) {

            console.log(
                "Level error:",
                e
            );
        }
    }


    // Hook existing update()
    const oldUpdate =
        window.update;


    if (
        typeof oldUpdate ===
        "function"
    ) {

        window.update =
            function () {

                oldUpdate.apply(
                    this,
                    arguments
                );

                updateLevelDisplay();
            };
    }


    // Initial level display
    setTimeout(
        updateLevelDisplay,
        500
    );


    // ============================================================
    // FEATURE 4 - AD COOLDOWN
    // ============================================================

    let lastAdTime = 0;


    const oldWatchAd =
        window.watchAd;


    if (
        typeof oldWatchAd ===
        "function"
    ) {

        window.watchAd =
            async function () {

                const now =
                    Date.now();


                const cooldown =
                    15000;


                if (
                    lastAdTime > 0 &&
                    now - lastAdTime <
                    cooldown
                ) {

                    const remaining =
                        Math.ceil(
                            (
                                cooldown -
                                (
                                    now -
                                    lastAdTime
                                )
                            ) / 1000
                        );


                    showToast(
                        "⏳ Wait " +
                        remaining +
                        " sec before next ad"
                    );


                    return;
                }


                lastAdTime =
                    now;


                try {

                    return await oldWatchAd.apply(
                        this,
                        arguments
                    );

                } catch (error) {

                    lastAdTime = 0;

                    console.log(
                        "Ad error:",
                        error
                    );


                    showToast(
                        "❌ Ad system error"
                    );
                }
            };

    } else {

        console.log(
            "⚠️ watchAd() not found"
        );
    }


    // ============================================================
    // FEATURE 5 - DAILY CHECK-IN BONUS
    // ============================================================

    window.claimDailyBonus =
        function () {

            const lastClaim =
                localStorage.getItem(
                    "zyntra_daily_claim"
                );


            if (
                lastClaim ===
                todayStr
            ) {

                showToast(
                    "✅ Daily bonus already claimed!"
                );

                return;
            }


            const success =
                addBTTC(1000);


            if (!success) {
                return;
            }


            localStorage.setItem(
                "zyntra_daily_claim",
                todayStr
            );


            showToast(
                "🎁 +1000 BTTC Daily Bonus!"
            );


            const modal =
                document.getElementById(
                    "dailyModal"
                );


            if (modal) {
                modal.remove();
            }
        };


    // Daily Bonus Modal
    setTimeout(function () {

        const lastClaim =
            localStorage.getItem(
                "zyntra_daily_claim"
            );


        if (
            lastClaim ===
            todayStr
        ) {
            return;
        }


        if (
            document.getElementById(
                "dailyModal"
            )
        ) {
            return;
        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "dailyModal";


        modal.style.cssText =
            "position:fixed;" +
            "inset:0;" +
            "background:rgba(0,0,0,.80);" +
            "z-index:99998;" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "padding:20px;" +
            "box-sizing:border-box;";


        modal.innerHTML =

            '<div style="' +
            'background:#181818;' +
            'color:white;' +
            'border:1px solid #333;' +
            'border-radius:20px;' +
            'padding:25px;' +
            'text-align:center;' +
            'max-width:320px;' +
            'width:100%;' +
            'box-sizing:border-box;' +
            '">' +

            '<div style="font-size:45px;">🎁</div>' +

            '<h2>Daily Bonus</h2>' +

            '<p style="opacity:.8;">' +
            'Claim your daily 1000 BTTC!' +
            '</p>' +

            '<p style="font-size:12px;opacity:.65;">' +
            '🔥 Streak: ' +
            streak.count +
            ' days' +
            '</p>' +

            '<button ' +
            'onclick="claimDailyBonus()" ' +
            'style="' +
            'width:100%;' +
            'padding:15px;' +
            'border:0;' +
            'border-radius:12px;' +
            'background:#22c55e;' +
            'color:white;' +
            'font-weight:bold;' +
            'cursor:pointer;' +
            '">' +

            '🎁 Claim +1000 BTTC' +

            '</button>' +

            '<button ' +
            'onclick="document.getElementById(\'dailyModal\').remove()" ' +
            'style="' +
            'width:100%;' +
            'padding:12px;' +
            'border:0;' +
            'border-radius:12px;' +
            'background:#333;' +
            'color:white;' +
            'margin-top:8px;' +
            'cursor:pointer;' +
            '">' +

            'Later' +

            '</button>' +

            '</div>';


        document.body.appendChild(
            modal
        );

    }, 2000);


    // ============================================================
    // FEATURE 6 - DAILY SPIN
    // ============================================================

    window.spinWheel =
        function () {

            const lastSpin =
                localStorage.getItem(
                    "zyntra_spin"
                );


            if (
                lastSpin ===
                todayStr
            ) {

                showToast(
                    "🎡 You already spun today!"
                );

                return;
            }


            const rewards = [
                100,
                200,
                500,
                1000,
                2000
            ];


            const win =
                rewards[
                    Math.floor(
                        Math.random() *
                        rewards.length
                    )
                ];


            const success =
                addBTTC(win);


            if (!success) {
                return;
            }


            localStorage.setItem(
                "zyntra_spin",
                todayStr
            );


            showToast(
                "🎡 Spin Won: +" +
                win +
                " BTTC!"
            );
        };


    // Add Spin Button
    setTimeout(function () {

        const grid =
            document.querySelector(
                ".grid"
            );


        if (
            !grid ||
            document.getElementById(
                "spinBtn"
            )
        ) {
            return;
        }


        const btn =
            document.createElement(
                "button"
            );


        btn.id =
            "spinBtn";


        btn.className =
            "btn full";


        btn.innerHTML =
            "🎡<br>Daily Spin";


        btn.onclick =
            window.spinWheel;


        btn.style.background =
            "linear-gradient(135deg,#a855f7,#ec4899)";


        grid.appendChild(btn);

    }, 700);


    // ============================================================
    // FEATURE 7 - RETURN REMINDER
    // ============================================================

    let hiddenAt = 0;


    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {

                hiddenAt =
                    Date.now();

                return;
            }


            if (
                hiddenAt === 0
            ) {
                return;
            }


            const diff =
                Date.now() -
                hiddenAt;


            if (
                diff >=
                2 * 60 * 60 * 1000
            ) {

                showToast(
                    "👋 Welcome back! Keep earning on Zyntra."
                );
            }


            hiddenAt = 0;
        }
    );


    // ============================================================
    // FEATURE 8 - LOCAL BACKUP
    // ============================================================
    //
    // Backup is ONLY for emergency/local testing.
    // It is NOT used to authorize withdrawals.
    // ============================================================

    setInterval(function () {

        const d =
            getData();


        if (!d) {
            return;
        }


        try {

            localStorage.setItem(
                "zyntra_backup",
                JSON.stringify({
                    bttc:
                        Number(d.bttc) || 0,

                    ads:
                        Number(d.ads) || 0,

                    time:
                        Date.now()
                })
            );

        } catch (e) {

            console.log(
                "Backup error:",
                e
            );
        }

    }, 10000);


    // ============================================================
    // FEATURE 9 - WEEKEND EVENT NOTICE
    // ============================================================

    const day =
        new Date().getDay();


    if (
        day === 0 ||
        day === 6
    ) {

        setTimeout(
            function () {

                showToast(
                    "🎉 Weekend Bonus Event Active!"
                );

            },
            3000
        );
    }


    // ============================================================
    // FEATURE 10 - PROFESSIONAL BRANDING
    // ============================================================

    console.log(
        "%c ZYNTRA NETWORK ",
        "background:#a855f7;color:white;padding:6px 12px;border-radius:6px 0 0 6px;font-weight:bold;"
    );


    console.log(
        "%c Professional Features Active ",
        "background:#181818;color:white;padding:6px 12px;border-radius:0 6px 6px 0;font-weight:bold;"
    );


    // ============================================================
    // READY
    // ============================================================

    console.log(
        "✅ All 10 Zyntra features initialized"
    );

})();

[/writing block]

"index.html" mein ye line zaroor honi chahiye

"</body>" ke just pehle:

<script src="zyntra-features.js"></script>

Ek important correction: is version mein bhi "localStorage" hai, kyunki Daily Streak, Daily Bonus aur Daily Spin ko page reload ke baad remember karna hai. Lekin local backup ko withdrawal authorization ke liye use nahi kiya gaya hai.

Aur bhai, real BTTC withdrawal ke liye frontend mein "data.bttc += reward" ko final security system mat samajhna. User browser se ise manipulate kar sakta hai. Production mein reward/withdrawal verification backend par rakhna zaroori hai.

Agar tum ab apna current "index.html" bhej do, main check karke bata sakta hoon ki ye "zyntra-features.js" uske saath exactly compatible hai ya koi function conflict ho raha hai.
