// ZYNTRA FUTURE-01
// PROFESSIONAL MINING SYSTEM

(function () {

    "use strict";

    const BOY_IMG = "./assets/zyntra-boy.png";
    const GIRL_IMG = "./assets/zyntra-girl.png";

    const MINING_REWARD = 500;
    const MINING_DURATION = 60 * 60;

    let gender = localStorage.getItem("zyntra_gender");

    let mining = {
        active: false,
        startedAt: 0,
        duration: MINING_DURATION,
        reward: MINING_REWARD,
        claimed: false
    };

    function loadMining() {
        try {
            const saved = localStorage.getItem("zyntra_mining_final");

            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log("Mining data error");
        }

        return mining;
    }

    function saveMining() {
        localStorage.setItem(
            "zyntra_mining_final",
            JSON.stringify(mining)
        );
    }

    mining = loadMining();
  // =====================================
// MINING START FUNCTION
// =====================================

function startMining() {

    if (mining.active) return;

    mining.active = true;
    mining.startTime = Date.now();
    mining.claimed = false;

    saveMining();

    updateMiningUI();
}

// =====================================
// STOP MINING
// =====================================

function stopMining() {

    mining.active = false;

    saveMining();

    updateMiningUI();
}

function getRemainingSeconds() {

    if (!mining.active) {
        return 0;
    }

    const elapsed = Math.floor(
        (Date.now() - mining.startedAt) / 1000
    );

    return Math.max(
        0,
        mining.duration - elapsed
    );
}
  // =====================================
// START MINING
// =====================================

function startMining() {

    if (mining.active) {
        toast("Mining already active ⛏️");
        return;
    }

    mining.active = true;
    mining.startedAt = Date.now();
    mining.claimed = false;

    saveMining();

    updateMiningUI();

    toast("Mining Started 🚀");
}

// =====================================
// CLAIM REWARD
// =====================================

function claimMining() {

    if (!mining.active) {
        return;
    }

    if (getRemainingSeconds() > 0) {
        toast("Mining is still running ⛏️");
        return;
    }

    const reward =
        Number(mining.reward || MINING_REWARD);

    mining.active = false;
    mining.claimed = true;

    saveMining();

    if (typeof addBalance === "function") {
        addBalance(reward);
    }

    updateMiningUI();

    toast("+" + reward + " BTTC Claimed 🎉");
}
  // =====================================
// MINING UI UPDATE
// =====================================

function updateMiningUI() {

    const counter =
        document.getElementById("zm-counter");

    const status =
        document.getElementById("zm-status");

    const button =
        document.getElementById("zm-main-button");

    if (!counter || !status || !button) {
        return;
    }

    if (mining.active) {

        const remaining =
            getRemainingSeconds();

        if (remaining <= 0) {

            status.innerText =
                "● MINING COMPLETE";

            button.innerText =
                "CLAIM REWARD";

        } else {

            status.innerText =
                "● MINING ACTIVE";

            button.innerText =
                "MINING IN PROGRESS...";

        }

    } else {

        status.innerText =
            "● MINING READY";

        button.innerText =
            mining.claimed
                ? "START NEW MINING"
                : "START MINING";
    }
}
  // ===== FEATURE 5: DAILY STREAK SYSTEM =====

window.zyntraStreak = function(){

    const today = new Date().toDateString();

    let lastDay = localStorage.getItem("zyntra_last_streak_day");
    let streak = parseInt(
        localStorage.getItem("zyntra_streak_count") || "0"
    );

    if(lastDay === today){
        if(typeof showToast === "function"){
            showToast("🔥 Daily streak already claimed!");
        }
        return;
    }

    if(lastDay){
        const oldDate = new Date(lastDay);
        const currentDate = new Date();

        const difference = Math.floor(
            (currentDate - oldDate) / (1000 * 60 * 60 * 24)
        );

        if(difference === 1){
            streak++;
        }else{
            streak = 1;
        }
    }else{
        streak = 1;
    }

    localStorage.setItem(
        "zyntra_streak_count",
        streak
    );

    localStorage.setItem(
        "zyntra_last_streak_day",
        today
    );

    // Reward
    const reward = streak >= 7 ? 2000 : 500;

    let balance = parseInt(
        localStorage.getItem("zyntra_balance") || "0"
    );

    balance += reward;

    localStorage.setItem(
        "zyntra_balance",
        balance
    );

    // Update balance on screen
    const balanceElements = document.querySelectorAll(
        "#balance, .balance, .coin-balance"
    );

    balanceElements.forEach(function(el){
        el.innerText = balance + " BTTC";
    });

    if(typeof showToast === "function"){
        showToast(
            "🔥 Day " + streak +
            " Streak! +" + reward + " BTTC"
        );
    }

    console.log(
        "Zyntra Streak:",
        streak,
        "Reward:",
        reward
    );
};

console.log("Feature 5 Loaded ✅");
  // ===== FEATURE 6: DAILY BONUS SYSTEM =====

(function(){

    console.log("Zyntra Daily Bonus Loaded 🎁");

    const BONUS_KEY = "zyntra_daily_bonus";
    const BONUS_AMOUNT = 1000;

    function getToday(){

        return new Date().toDateString();

    }

    function alreadyClaimed(){

        const claimed =
            localStorage.getItem(BONUS_KEY);

        return claimed === getToday();

    }

    function addBonus(amount){

        let balance = parseInt(
            localStorage.getItem(
                "zyntra_balance"
            ) || "0"
        );

        balance += amount;

        localStorage.setItem(
            "zyntra_balance",
            balance.toString()
        );

        const balanceElements =
            document.querySelectorAll(
                "#balance, .balance, .coin-balance, #userBalance"
            );

        balanceElements.forEach(function(element){

            element.innerText =
                balance + " BTTC";

        });

        return balance;

    }

    window.claimZyntraDailyBonus = function(){

        if(alreadyClaimed()){

            if(typeof showToast === "function"){

                showToast(
                    "🎁 Daily Bonus already claimed!"
                );

            }else{

                alert(
                    "Daily Bonus already claimed!"
                );

            }

            return;

        }

        const newBalance =
            addBonus(BONUS_AMOUNT);

        localStorage.setItem(
            BONUS_KEY,
            getToday()
        );

        if(typeof showToast === "function"){

            showToast(
                "🎁 Daily Bonus +1000 BTTC!"
            );

        }else{

            alert(
                "🎁 Daily Bonus +1000 BTTC!"
            );

        }

        console.log(
            "Daily Bonus:",
            BONUS_AMOUNT,
            "BTTC"
        );

        console.log(
            "New Balance:",
            newBalance,
            "BTTC"
        );

    };

    window.checkZyntraDailyBonus = function(){

        return {
            claimed: alreadyClaimed(),
            reward: BONUS_AMOUNT
        };

    };

    console.log(
        "Daily Bonus Status:",
        window.checkZyntraDailyBonus()
    // ===== FEATURE 7: ZYNTRA LEVEL SYSTEM =====

console.log("Zyntra Level System Loaded ⭐");

const ZYNTRA_LEVEL_KEY = "zyntra_user_level";
const ZYNTRA_XP_KEY = "zyntra_user_xp";

const zyntraLevels = [
    {
        name: "Bronze",
        minXP: 0,
        icon: "🥉"
    },
    {
        name: "Silver",
        minXP: 10000,
        icon: "🥈"
    },
    {
        name: "Gold",
        minXP: 25000,
        icon: "🥇"
    },
    {
        name: "Platinum",
        minXP: 50000,
        icon: "💎"
    },
    {
        name: "Diamond",
        minXP: 100000,
        icon: "💠"
    }
];

function getZyntraXP(){

    return parseInt(
        localStorage.getItem(
            ZYNTRA_XP_KEY
        ) || "0"
    );
}

function saveZyntraXP(xp){

    localStorage.setItem(
        ZYNTRA_XP_KEY,
        xp.toString()
    );
}

function getZyntraCurrentLevel(xp){

    let currentLevel =
        zyntraLevels[0];

    for(
        let i = 0;
        i < zyntraLevels.length;
        i++
    ){

        if(
            xp >=
            zyntraLevels[i].minXP
        ){

            currentLevel =
                zyntraLevels[i];

        }
    }

    return currentLevel;
}

function getZyntraNextLevel(xp){

    for(
        let i = 0;
        i < zyntraLevels.length;
        i++
    ){

        if(
            xp <
            zyntraLevels[i].minXP
        ){

            return zyntraLevels[i];

        }
    }

    return null;
}

window.addZyntraXP = function(amount){

    amount = parseInt(amount || 0);

    if(amount <= 0){
        return;
    }

    const oldXP =
        getZyntraXP();

    const newXP =
        oldXP + amount;

    const oldLevel =
        getZyntraCurrentLevel(oldXP);

    const newLevel =
        getZyntraCurrentLevel(newXP);

    saveZyntraXP(newXP);

    if(
        oldLevel.name !==
        newLevel.name
    ){

        if(
            typeof showToast ===
            "function"
        ){

            showToast(
                "🎉 LEVEL UP! " +
                newLevel.icon +
                " " +
                newLevel.name
            );

        }

    }

    updateZyntraLevelDisplay();

    console.log(
        "XP Added:",
        amount
    );

    console.log(
        "Total XP:",
        newXP
    );

};

function updateZyntraLevelDisplay(){

    const xp =
        getZyntraXP();

    const currentLevel =
        getZyntraCurrentLevel(xp);

    const nextLevel =
        getZyntraNextLevel(xp);

    const levelElements =
        document.querySelectorAll(
            "#userLevel, .user-level, .level-name"
        );

    levelElements.forEach(
        function(element){

            element.innerText =
                currentLevel.icon +
                " " +
                currentLevel.name;

        }
    );

    const xpElements =
        document.querySelectorAll(
            "#userXP, .user-xp, .xp-value"
        );

    xpElements.forEach(
        function(element){

            element.innerText =
                xp + " XP";

        }
    );

    if(nextLevel){

        const currentStart =
            currentLevel.minXP;

        const nextTarget =
            nextLevel.minXP;

        const progress =
            xp - currentStart;

        const required =
            nextTarget - currentStart;

        const percent =
            Math.min(
                100,
                Math.floor(
                    (progress /
                    required) * 100
                )
            );

        const progressBars =
            document.querySelectorAll(
                "#levelProgress, .level-progress"
            );

        progressBars.forEach(
            function(bar){

                bar.style.width =
                    percent + "%";

            }
        );

    }

}

window.getZyntraLevel = function(){

    const xp =
        getZyntraXP();

    const current =
        getZyntraCurrentLevel(xp);

    const next =
        getZyntraNextLevel(xp);

    return {

        xp: xp,

        level:
            current.name,

        icon:
            current.icon,

        nextLevel:
            next
                ? next.name
                : "MAX",

        nextXP:
            next
                ? next.minXP
                : xp

    };

};

updateZyntraLevelDisplay();

console.log(
    "Current Zyntra Level:",
    window.getZyntraLevel()
);
  // ===== FEATURE 8: LUCKY SPIN SYSTEM =====

console.log("Zyntra Lucky Spin Loaded 🎡");

const ZYNTRA_SPIN_KEY =
    "zyntra_spin_last_date";

const zyntraSpinRewards = [
    100,
    250,
    500,
    750,
    1000,
    1500,
    2000
];

function getZyntraSpinDate(){

    return new Date().toDateString();

}

function canZyntraSpin(){

    const lastSpin =
        localStorage.getItem(
            ZYNTRA_SPIN_KEY
        );

    return lastSpin !==
        getZyntraSpinDate();

}

function addZyntraSpinReward(amount){

    let balance =
        parseInt(
            localStorage.getItem(
                "zyntra_balance"
            ) || "0"
        );

    balance += amount;

    localStorage.setItem(
        "zyntra_balance",
        balance.toString()
    );

    const balanceElements =
        document.querySelectorAll(
            "#balance, .balance, .coin-balance, #userBalance"
        );

    balanceElements.forEach(
        function(element){

            element.innerText =
                balance + " BTTC";

        }
    );

    return balance;

}

window.zyntraLuckySpin = function(){

    if(!canZyntraSpin()){

        if(
            typeof showToast ===
            "function"
        ){

            showToast(
                "🎡 Lucky Spin already used today!"
            );

        }

        return;

    }

    const randomIndex =
        Math.floor(
            Math.random() *
            zyntraSpinRewards.length
        );

    const reward =
        zyntraSpinRewards[randomIndex];

    const newBalance =
        addZyntraSpinReward(
            reward
        );

    localStorage.setItem(
        ZYNTRA_SPIN_KEY,
        getZyntraSpinDate()
    );

    if(
        typeof showToast ===
        "function"
    ){

        showToast(
            "🎉 You won +" +
            reward +
            " BTTC!"
        );

    }else{

        alert(
            "🎉 You won +" +
            reward +
            " BTTC!"
        );

    }

    console.log(
        "Lucky Spin Reward:",
        reward
    );

    console.log(
        "New Balance:",
        newBalance
    );

};

window.checkZyntraSpin = function(){

    return {
        available:
            canZyntraSpin(),

        rewards:
            zyntraSpinRewards
    };

};

console.log(
    "Lucky Spin Status:",
    window.checkZyntraSpin()
);
  // ===== FEATURE 9: REFERRAL BONUS SYSTEM =====

console.log("Zyntra Referral System Loaded 👥");

const ZYNTRA_REF_KEY =
    "zyntra_referral_count";

const ZYNTRA_REF_REWARD =
    1000;

function getZyntraReferralCount(){

    return parseInt(
        localStorage.getItem(
            ZYNTRA_REF_KEY
        ) || "0"
    );

}

function saveZyntraReferralCount(count){

    localStorage.setItem(
        ZYNTRA_REF_KEY,
        count.toString()
    );

}

function addZyntraReferralReward(amount){

    let balance =
        parseInt(
            localStorage.getItem(
                "zyntra_balance"
            ) || "0"
        );

    balance += amount;

    localStorage.setItem(
        "zyntra_balance",
        balance.toString()
    );

    const balanceElements =
        document.querySelectorAll(
            "#balance, .balance, .coin-balance, #userBalance"
        );

    balanceElements.forEach(
        function(element){

            element.innerText =
                balance + " BTTC";

        }
    );

    return balance;

}

window.addZyntraReferral = function(){

    let referrals =
        getZyntraReferralCount();

    referrals++;

    saveZyntraReferralCount(
        referrals
    );

    const reward =
        ZYNTRA_REF_REWARD;

    const newBalance =
        addZyntraReferralReward(
            reward
        );

    if(
        typeof showToast ===
        "function"
    ){

        showToast(
            "👥 Referral Joined! +" +
            reward +
            " BTTC"
        );

    }else{

        alert(
            "👥 Referral Reward +" +
            reward +
            " BTTC"
        );

    }

    // Add XP if level system exists
    if(
        typeof addZyntraXP ===
        "function"
    ){

        addZyntraXP(500);

    }

    console.log(
        "Total Referrals:",
        referrals
    );

    console.log(
        "Referral Reward:",
        reward
    );

    console.log(
        "New
      // ===== FEATURE 10: ZYNTRA TASK REWARD SYSTEM =====

console.log("Zyntra Task Reward System Loaded 🎯");

const ZYNTRA_TASK_KEY =
    "zyntra_completed_tasks";

const zyntraTasks = {

    daily_login: {
        name: "Daily Login",
        reward: 500,
        xp: 100
    },

    watch_ads: {
        name: "Watch Ads",
        reward: 1000,
        xp: 250
    },

    follow_channel: {
        name: "Follow Channel",
        reward: 1000,
        xp: 300
    },

    invite_friend: {
        name: "Invite Friend",
        reward: 1500,
        xp: 500
    }

};

function getCompletedZyntraTasks(){

    try{

        return JSON.parse(
            localStorage.getItem(
                ZYNTRA_TASK_KEY
            ) || "{}"
        );

    }catch(error){

        return {};

    }

}

function saveCompletedZyntraTasks(tasks){

    localStorage.setItem(
        ZYNTRA_TASK_KEY,
        JSON.stringify(tasks)
    );

}

function addZyntraTaskReward(amount){

    let balance =
        parseInt(
            localStorage.getItem(
                "zyntra_balance"
            ) || "0"
        );

    balance += amount;

    localStorage.setItem(
        "zyntra_balance",
        balance.toString()
    );

    const balanceElements =
        document.querySelectorAll(
            "#balance, .balance, .coin-balance, #userBalance"
        );

    balanceElements.forEach(
        function(element){

            element.innerText =
                balance + " BTTC";

        }
    );

    return balance;

}

window.completeZyntraTask = function(taskId){

    if(
        !zyntraTasks[taskId]
    ){

        console.log(
            "Unknown Zyntra Task:",
            taskId
        );

        return;

    }

    const completed =
        getCompletedZyntraTasks();

    if(
        completed[taskId]
    ){

        if(
            typeof showToast ===
            "function"
        ){

            showToast(
                "✅ Task already completed!"
            );

        }

        return;

    }

    const task =
        zyntraTasks[taskId];

    completed[taskId] =
        new Date().toISOString();

    saveCompletedZyntraTasks(
        completed
    );

    const newBalance =
        addZyntraTaskReward(
            task.reward
        );

    if(
        typeof addZyntraXP ===
        "function"
    ){

        addZyntraXP(
            task.xp
        );

    }

    if(
        typeof showToast ===
        "function"
    ){

        showToast(
            "🎯 " +
            task.name +
            " +" +
            task.reward +
            " BTTC"
        );

    }else{

        alert(
            "🎯 Task Complete! +" +
            task.reward +
            " BTTC"
        );

    }

    console.log(
        "Task Completed:",
        task.name
    );

    console.log(
        "Reward:",
        task.reward
    );

    console.log(
        "New Balance:",
        newBalance
    );

};

window.getZyntraTasks = function(){

    return zyntraTasks;

};

window.getZyntraCompletedTasks = function(){

    return getCompletedZyntraTasks();

};

console.log(
    "Available Zyntra Tasks:",
    Object.keys(zyntraTasks)
);

console.log(
    "Zyntra 10 Features Loaded Successfully 🚀"
);

// ===== FINAL CLOSE =====

})();
