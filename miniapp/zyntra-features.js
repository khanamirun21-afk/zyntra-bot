// ============================================================
// ZYNTRA NETWORK - PROFESSIONAL FEATURES
// Version 3.0
// Compatible with current Zyntra index.html
// ============================================================

(function () {

    "use strict";

    console.log("🚀 Zyntra Features v3.0 Loaded ✅");


    // ============================================================
    // BASIC HELPERS
    // ============================================================

    function getData() {

        try {

            if (
                typeof data !== "undefined" &&
                data
            ) {
                return data;
            }

        } catch (e) {

            console.log(
                "Data error:",
                e
            );

        }

        return null;
    }


    function refresh() {

        try {

            if (
                typeof save === "function"
            ) {
                save();
            }

            if (
                typeof update === "function"
            ) {
                update();
            }

        } catch (e) {

            console.log(
                "Refresh error:",
                e
            );
        }
    }


    function addBTTC(amount) {

        const d = getData();

        if (!d) {

            showToast(
                "❌ Account data unavailable"
            );

            return false;
        }

        d.bttc =
            Number(d.bttc) || 0;

        d.bttc +=
            Number(amount);

        refresh();

        return true;
    }


    // ============================================================
    // FEATURE 1
    // TOAST NOTIFICATION
    // ============================================================

    window.showToast = function (message) {

        const old =
            document.getElementById(
                "zyntraToast"
            );

        if (old) {
            old.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.id =
            "zyntraToast";


        toast.innerText =
            message;


        toast.style.cssText =
            "position:fixed;" +
            "left:50%;" +
            "bottom:22px;" +
            "transform:translateX(-50%);" +
            "background:#181818;" +
            "border:1px solid #444;" +
            "color:#fff;" +
            "padding:12px 20px;" +
            "border-radius:30px;" +
            "z-index:999999;" +
            "font-size:14px;" +
            "font-weight:600;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.5);" +
            "max-width:90%;" +
            "text-align:center;" +
            "transition:all .3s ease;";


        document.body.appendChild(
            toast
        );


        setTimeout(function () {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(15px)";

        }, 2500);


        setTimeout(function () {

            if (
                toast &&
                toast.parentNode
            ) {
                toast.remove();
            }

        }, 3000);

    };


    // ============================================================
    // FEATURE 2
    // DAILY STREAK
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
            Date.now() -
            86400000
        ).toDateString();


    if (
        streak.last !==
        todayStr
    ) {

        if (
            streak.last ===
            yesterdayStr
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


        /*
         * Streak bonus:
         * Day 1 = no bonus
         * Day 2+ = streak x 100 BTTC
         */

        if (
            streak.count > 1
        ) {

            const bonus =
                streak.count * 100;


            setTimeout(
                function () {

                    if (
                        addBTTC(
                            bonus
                        )
                    ) {

                        showToast(
                            "🔥 " +
                            streak.count +
                            " Day Streak! +" +
                            bonus +
                            " BTTC"
                        );

                    }

                },
                1500
            );
        }
    }


    // ============================================================
    // FEATURE 3
    // LEVEL SYSTEM
    // ============================================================

    function getLevel(balance) {

        balance =
            Number(balance) || 0;


        if (
            balance >= 50000
        ) {

            return {

                level: 5,
                name: "Diamond 💎"

            };

        }


        if (
            balance >= 25000
        ) {

            return {

                level: 4,
                name: "Platinum 🏆"

            };

        }


        if (
            balance >= 10000
        ) {

            return {

                level: 3,
                name: "Gold 🥇"

            };

        }


        if (
            balance >= 3000
        ) {

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


    function updateLevel() {

        const d =
            getData();


        if (!d) {
            return;
        }


        const status =
            document.getElementById(
                "status"
            );


        if (!status) {
            return;
        }


        const level =
            getLevel(
                d.bttc
            );


        let base =
            status.getAttribute(
                "data-zyntra-status"
            );


        if (!base) {

            base =
                status.innerText ||
                "20 Ads complete karo";


            status.setAttribute(
                "data-zyntra-status",
                base
            );

        }


        status.innerText =
            "Level " +
            level.level +
            " - " +
            level.name +
            " | " +
            base;

    }


    /*
     * Hook existing update()
     * without replacing the main balance logic.
     */

    const originalUpdate =
        window.update;


    if (
        typeof originalUpdate ===
        "function"
    ) {

        window.update =
            function () {

                originalUpdate.apply(
                    this,
                    arguments
                );


                updateLevel();

            };

    }


    setTimeout(
        updateLevel,
        500
    );


    // ============================================================
    // FEATURE 4
    // AD COOLDOWN
    // ============================================================

    let lastAdTime = 0;


    const originalWatchAd =
        window.watchAd;


    if (
        typeof originalWatchAd ===
        "function"
    ) {

        window.watchAd =
            async function () {

                const now =
                    Date.now();


                const cooldown =
                    15000;


                if (
                    lastAdTime !== 0 &&
                    now -
                    lastAdTime <
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


                /*
                 * Start cooldown only when
                 * the original ad function
                 * is actually called.
                 */

                lastAdTime =
                    now;


                try {

                    return await originalWatchAd.apply(
                        this,
                        arguments
                    );

                } catch (error) {

                    /*
                     * If original ad function
                     * fails, allow retry.
                     */

                    lastAdTime =
                        0;


                    console.log(
                        "Ad error:",
                        error
                    );

                }

            };

    }


    // ============================================================
    // FEATURE 5
    // DAILY CHECK-IN BONUS
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
                addBTTC(
                    1000
                );


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

    setTimeout(
        function () {

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
                "background:rgba(0,0,0,.82);" +
                "z-index:99998;" +
                "display:flex;" +
                "align-items:center;" +
                "justify-content:center;" +
                "padding:20px;";


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

                '">' +

                '<div style="font-size:45px;">🎁</div>' +

                '<h2>Daily Bonus</h2>' +

                '<p>Claim your daily 1000 BTTC!</p>' +

                '<p style="font-size:12px;opacity:.7;">' +
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
                'font-size:15px;' +
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
                '">' +

                'Later' +

                '</button>' +

                '</div>';


            document.body.appendChild(
                modal
            );

        },
        2000
    );


    // ============================================================
    // FEATURE 6
    // DAILY SPIN
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
                addBTTC(
                    win
                );


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


    // Add Daily Spin button

    setTimeout(
        function () {

            const grid =
                document.querySelector(
                    ".grid"
                );


            if (!grid) {
                return;
            }


            if (
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


            grid.appendChild(
                btn
            );

        },
        700
    );


    // ============================================================
    // FEATURE 7
    // RETURN REMINDER
    // ============================================================

    let hiddenAt =
        0;


    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                hiddenAt =
                    Date.now();

                return;

            }


            if (
                hiddenAt === 0
            ) {
                return;
            }


            const awayTime =
                Date.now() -
                hiddenAt;


            if (
                awayTime >=
                2 * 60 * 60 * 1000
            ) {

                showToast(
                    "👋 Welcome back! Keep earning on Zyntra."
                );

            }


            hiddenAt =
                0;

        }
    );


    // ============================================================
    // FEATURE 8
    // LOCAL BACKUP
    // ============================================================

    setInterval(
        function () {

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
                            Number(
                                d.bttc
                            ) || 0,

                        ads:
                            Number(
                                d.ads
                            ) || 0,

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

        },
        10000
    );


    // ============================================================
    // FEATURE 9
    // WEEKEND EVENT NOTICE
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
    // FEATURE 10
    // PROFESSIONAL BRANDING
    // ============================================================

    console.log(
        "%c ZYNTRA NETWORK ",
        "background:#a855f7;color:white;padding:6px 12px;border-radius:6px 0 0 6px;font-weight:bold;"
    );


    console.log(
        "%c Professional Features Active ",
        "background:#181818;color:white;padding:6px 12px;border-radius:0 6px 6px 0;font-weight:bold;"
    );


    console.log(
        "✅ All 10 features initialized successfully"
    );


})();

[/writing block]

Ab "index.html" mein kya karna hai?

Tumhare current "index.html" ke bilkul end mein:

<script src="zyntra-features.js"></script>

Ye "</body>" se just pehle lagao:

</script>

<script src="zyntra-features.js"></script>

</body>
</html>

⚠️ Ek bahut important baat

Tumhare current "index.html" mein main balance/ads system already localStorage par hai:

localStorage.getItem("zyntra_v3")

Isliye abhi "features.js" se localStorage ko completely remove karna possible nahi hai bina tumhare main "index.html" ko bhi change kiye.

Aur real withdrawal security ke liye current system mein ek aur important weakness hai: "submitWithdraw()" frontend se "amount", "ads" aur "telegram_id" bhej raha hai. User browser-side values manipulate kar sakta hai. Isliye production Zyntra mein backend ko khud balance/ads verify karna chahiye.

Abhi ke liye, tum sirf ye "zyntra-features.js" replace karo aur "index.html" mein script line add karo. Tumhara existing Monetag + withdrawal code main is file se intentionally nahi chhed raha hoon.
