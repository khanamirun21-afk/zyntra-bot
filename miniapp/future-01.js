// ============================================================
// ZYNTRA FUTURE-01
// PROFESSIONAL MINING + UI ENHANCEMENT SYSTEM
// PART 1 OF 3
// ============================================================

(function(){

"use strict";

// ============================================================
// BASIC SETTINGS
// ============================================================

var ZYNTRA_F01 = {

    miningReward: 500,

    miningDuration: 60 * 60,

    miningKey: "zyntra_mining_professional",

    genderKey: "zyntra_gender",

    splashKey: "zyntra_splash_done",

    themeKey: "zyntra_theme"

};

// ============================================================
// GLOBAL STATE
// ============================================================

var zyntraGender =
    localStorage.getItem(
        ZYNTRA_F01.genderKey
    ) || "";

var zyntraMining = null;

var zyntraMiningTimer = null;

var zyntraMiningRunning = false;

// ============================================================
// SAFE STORAGE
// ============================================================

function zfSaveMining(){

    try{

        localStorage.setItem(
            ZYNTRA_F01.miningKey,
            JSON.stringify(zyntraMining)
        );

    }catch(e){

        console.log(
            "Zyntra mining save error:",
            e
        );

    }

}

// ============================================================
// LOAD MINING DATA
// ============================================================

function zfLoadMining(){

    try{

        var saved =
            localStorage.getItem(
                ZYNTRA_F01.miningKey
            );

        if(saved){

            var parsed =
                JSON.parse(saved);

            if(
                parsed &&
                typeof parsed === "object"
            ){

                return parsed;

            }

        }

    }catch(e){

        console.log(
            "Zyntra mining load error:",
            e
        );

    }

    return {

        active:false,

        startedAt:0,

        duration:
            ZYNTRA_F01.miningDuration,

        reward:
            ZYNTRA_F01.miningReward,

        claimed:false

    };

}

zyntraMining =
    zfLoadMining();

// ============================================================
// BALANCE CONNECTION
// ============================================================

function zfGetBalance(){

    try{

        if(
            typeof data !== "undefined" &&
            data
        ){

            return Number(
                data.bttc || 0
            );

        }

    }catch(e){}

    try{

        return Number(
            localStorage.getItem(
                "zyntra_bttc"
            ) || 0
        );

    }catch(e){

        return 0;

    }

}

// ============================================================
// ADD BALANCE
// ============================================================

function zfAddBalance(amount){

    amount =
        Number(amount) || 0;

    if(amount <= 0){
        return;
    }

    try{

        if(
            typeof data !== "undefined" &&
            data
        ){

            data.bttc =
                Number(data.bttc || 0)
                + amount;

            if(
                typeof saveData === "function"
            ){

                saveData();

            }

            if(
                typeof update === "function"
            ){

                update();

            }

            return;

        }

    }catch(e){

        console.log(
            "Balance update error:",
            e
        );

    }

}

// ============================================================
// TOAST
// ============================================================

function zfToast(message){

    try{

        if(
            typeof showToast === "function"
        ){

            showToast(message);

            return;

        }

    }catch(e){}

    var old =
        document.getElementById(
            "zf-toast"
        );

    if(old){

        old.innerText =
            message;

        old.style.display =
            "block";

        clearTimeout(
            window.zfToastTimer
        );

        window.zfToastTimer =
            setTimeout(function(){

                old.style.display =
                    "none";

            },2500);

        return;

    }

}

// ============================================================
// PROFESSIONAL CSS
// ============================================================

function zfAddCSS(){

    if(
        document.getElementById(
            "zf-professional-style"
        )
    ){

        return;

    }

    var style =
        document.createElement(
            "style"
        );

    style.id =
        "zf-professional-style";

    style.innerHTML = `

/* =========================================================
   ZYNTRA PROFESSIONAL UI
========================================================= */

:root{

    --zf-primary:#00e5ff;

    --zf-secondary:#1769ff;

    --zf-glow:rgba(0,229,255,.35);

    --zf-card:
        linear-gradient(
            145deg,
            rgba(16,25,45,.96),
            rgba(8,12,25,.96)
        );

}

body{

    background:
        radial-gradient(
            circle at top,
            rgba(0,229,255,.08),
            transparent 35%
        ),
        #070910 !important;

    transition:
        background .4s ease;

}

body.zf-female{

    --zf-primary:#ff2d95;

    --zf-secondary:#9c27b0;

    --zf-glow:
        rgba(255,45,149,.35);

    background:
        radial-gradient(
            circle at top,
            rgba(255,45,149,.10),
            transparent 35%
        ),
        #0c0710 !important;

}

/* HEADER */

.header{

    padding-top:25px !important;

}

.logo{

    font-size:34px !important;

    letter-spacing:2px;

    background:
        linear-gradient(
            90deg,
            var(--zf-primary),
            var(--zf-secondary)
        );

    -webkit-background-clip:text;

    -webkit-text-fill-color:
        transparent;

    text-shadow:
        0 0 25px
        var(--zf-glow);

}

/* CARDS */

.card{

    background:
        var(--zf-card) !important;

    border:
        1px solid
        rgba(255,255,255,.07) !important;

    box-shadow:
        0 10px 35px
        rgba(0,0,0,.25);

    backdrop-filter:
        blur(12px);

}

/* BALANCE */

.balance{

    background:
        linear-gradient(
            90deg,
            var(--zf-primary),
            var(--zf-secondary)
        );

    -webkit-background-clip:text;

    -webkit-text-fill-color:
        transparent;

    text-shadow:
        0 0 20px
        var(--zf-glow);

}

/* BUTTONS */

button{

    background:
        linear-gradient(
            135deg,
            var(--zf-primary),
            var(--zf-secondary)
        ) !important;

    box-shadow:
        0 5px 18px
        var(--zf-glow);

    transition:
        transform .15s ease,
        box-shadow .2s ease;

}

button:active{

    transform:
        scale(.97);

}

/* SECONDARY */

button.secondary{

    background:
        rgba(255,255,255,.06)
        !important;

    box-shadow:none;

    border:
        1px solid
        rgba(255,255,255,.08);

}

/* STATS */

.stat{

    background:
        rgba(255,255,255,.035)
        !important;

    border:
        1px solid
        rgba(255,255,255,.05);

}

/* PROGRESS */

.progress{

    background:
        linear-gradient(
            90deg,
            var(--zf-primary),
            var(--zf-secondary)
        ) !important;

    box-shadow:
        0 0 12px
        var(--zf-glow);

}

/* =========================================================
   MINING CARD
========================================================= */

#zf-mining-card{

    position:relative;

    overflow:hidden;

    margin-bottom:15px;

}

#zf-mining-card::before{

    content:"";

    position:absolute;

    width:180px;

    height:180px;

    border-radius:50%;

    background:
        var(--zf-glow);

    filter:
        blur(70px);

    right:-70px;

    top:-80px;

    pointer-events:none;

}

.zf-mining-head{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:10px;

}

.zf-mining-title{

    font-size:21px;

    font-weight:800;

}

.zf-mining-badge{

    font-size:11px;

    padding:6px 9px;

    border-radius:20px;

    background:
        rgba(0,229,255,.10);

    color:
        var(--zf-primary);

    border:
        1px solid
        rgba(0,229,255,.20);

}

body.zf-female
.zf-mining-badge{

    background:
        rgba(255,45,149,.10);

    border-color:
        rgba(255,45,149,.20);

}

/* MINING AREA */

.zf-mining-area{

    text-align:center;

    padding:
        22px 5px 8px;

}

.zf-mining-avatar{

    width:125px;

    height:125px;

    margin:auto;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    position:relative;

    background:
        radial-gradient(
            circle,
            rgba(255,255,255,.08),
            rgba(0,0,0,.25)
        );

    border:
        2px solid
        var(--zf-primary);

    box-shadow:
        0 0 30px
        var(--zf-glow);

    animation:
        zfFloat 3s ease-in-out infinite;

}

.zf-mining-avatar::before{

    content:"";

    position:absolute;

    inset:-10px;

    border-radius:50%;

    border:
        1px solid
        var(--zf-primary);

    opacity:.35;

    animation:
        zfPulse 2s infinite;

}

.zf-mining-avatar img{

    width:92px;

    height:92px;

    object-fit:contain;

    border-radius:50%;

}

.zf-mining-status{

    margin-top:15px;

    color:#aaa;

    font-size:13px;

}

.zf-mining-time{

    margin-top:5px;

    font-size:31px;

    font-weight:900;

    letter-spacing:2px;

    color:
        var(--zf-primary);

    text-shadow:
        0 0 15px
        var(--zf-glow);

}

.zf-mining-reward{

    margin-top:6px;

    font-size:13px;

    color:#aaa;

}

.zf-mining-button{

    margin-top:17px;

    max-width:330px;

}

.zf-mining-button.mining-active{

    background:
        linear-gradient(
            135deg,
            #222,
            #333
        ) !important;

    box-shadow:none;

}

.zf-mining-info{

    margin-top:14px;

    padding:10px;

    border-radius:12px;

    background:
        rgba(255,255,255,.035);

    color:#8f8f9d;

    font-size:12px;

    line-height:1.5;

}

/* =========================================================
   SPLASH
========================================================= */

#zf-splash{

    position:fixed;

    inset:0;

    z-index:999999;

    display:flex;

    align-items:center;

    justify-content:center;

    flex-direction:column;

    background:
        radial-gradient(
            circle at center,
            #101b35,
            #05060b 65%
        );

    transition:
        opacity .5s ease;

}

body.zf-female #zf-splash{

    background:
        radial-gradient(
            circle at center,
            #301027,
            #08050b 65%
        );

}

.zf-splash-logo{

    font-size:38px;

    font-weight:900;

    letter-spacing:4px;

    background:
        linear-gradient(
            90deg,
            var(--zf-primary),
            var(--zf-secondary)
        );

    -webkit-background-clip:text;

    -webkit-text-fill-color:
        transparent;

}

.zf-splash-text{

    margin-top:8px;

    color:#888;

    font-size:13px;

}

.zf-splash-loader{

    width:180px;

    height:4px;

    margin-top:25px;

    background:
        rgba(255,255,255,.08);

    border-radius:20px;

    overflow:hidden;

}

.zf-splash-loader span{

    display:block;

    height:100%;

    width:0%;

    background:
        linear-gradient(
            90deg,
            var(--zf-primary),
            var(--zf-secondary)
        );

    animation:
        zfLoad 1.8s ease forwards;

}

/* =========================================================
   GENDER SCREEN
========================================================= */

#zf-gender{

    position:fixed;

    inset:0;

    z-index:999998;

    display:none;

    align-items:center;

    justify-content:center;

    padding:20px;

    background:
        rgba(3,4,10,.97);

    backdrop-filter:
        blur(15px);

}

.zf-gender-box{

    width:100%;

    max-width:420px;

    text-align:center;

}

.zf-gender-title{

    font-size:27px;

    font-weight:900;

}

.zf-gender-sub{

    margin-top:7px;

    color:#8f8f9d;

    font-size:13px;

}

.zf-gender-grid{

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:12px;

    margin-top:25px;

}

.zf-gender-card{

    padding:18px 10px;

    border-radius:20px;

    background:
        rgba(255,255,255,.045);

    border:
        1px solid
        rgba(255,255,255,.08);

    cursor:pointer;

    transition:
        transform .2s ease,
        border .2s ease;

}

.zf-gender-card:active{

    transform:scale(.96);

}

.zf-gender-card img{

    width:105px;

    height:105px;

    object-fit:contain;

}

.zf-gender-card b{

    display:block;

    margin-top:8px;

    font-size:16px;

}

.zf-gender-card.male{

    border-color:
        rgba(0,229,255,.25);

}

.zf-gender-card.female{

    border-color:
        rgba(255,45,149,.25);

}

/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes zfFloat{

    0%,100%{
        transform:translateY(0);
    }

    50%{
        transform:translateY(-7px);
    }

}

@keyframes zfPulse{

    0%{
        transform:scale(.9);
        opacity:.2;
    }

    50%{
        transform:scale(1.08);
        opacity:.5;
    }

    100%{
        transform:scale(.9);
        opacity:.2;
    }

}

@keyframes zfLoad{

    from{
        width:0%;
    }

    to{
        width:100%;
    }

}

`;


    document.head.appendChild(
        style
    );

}

// ============================================================
// THEME
// ============================================================

function zfApplyTheme(){

    document.body.classList.remove(
        "zf-female"
    );

    if(
        zyntraGender === "female"
    ){

        document.body.classList.add(
            "zf-female"
        );

    }

}

// ============================================================
// GET CHARACTER IMAGE
// ============================================================

function zfGetCharacter(){

    if(
        zyntraGender === "female"
    ){

        return "./assets/zyntra-girl.png";

    }

    return "./assets/zyntra-boy.png";

}

// ============================================================
// SPLASH SCREEN
// ============================================================

function zfShowSplash(){

    if(
        document.getElementById(
            "zf-splash"
        )
    ){

        return;

    }

    var splash =
        document.createElement(
            "div"
        );

    splash.id =
        "zf-splash";

    splash.innerHTML = `

        <div class="zf-splash-logo">
            ZYNTRA
        </div>

        <div class="zf-splash-text">
            Earn • Play • Grow
        </div>

        <div class="zf-splash-loader">
            <span></span>
        </div>

    `;

    document.body.appendChild(
        splash
    );

    setTimeout(function(){

        splash.style.opacity =
            "0";

        setTimeout(function(){

            if(splash){

                splash.remove();

            }

            zfStartExperience();

        },500);

    },1900);

}

// ============================================================
// GENDER SELECTION
// ============================================================

function zfShowGender(){

    if(
        document.getElementById(
            "zf-gender"
        )
    ){

        return;

    }

    var gender =
        document.createElement(
            "div"
        );

    gender.id =
        "zf-gender";

    gender.style.display =
        "flex";

    gender.innerHTML = `

        <div class="zf-gender-box">

            <div class="zf-gender-title">
                Choose Your Style
            </div>

            <div class="zf-gender-sub">
                Select your character theme
            </div>

            <div class="zf-gender-grid">

                <div
                    class="zf-gender-card male"
                    onclick="window.zyntraChooseGender('male')"
                >

                    <img
                        src="./assets/zyntra-boy.png"
                        onerror="this.style.display='none'"
                    >

                    <b>Male</b>

                </div>

                <div
                    class="zf-gender-card female"
                    onclick="window.zyntraChooseGender('female')"
                >

                    <img
                        src="./assets/zyntra-girl.png"
                        onerror="this.style.display='none'"
                    >

                    <b>Female</b>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(
        gender
    );

}

// ============================================================
// GENDER SELECT
// ============================================================

window.zyntraChooseGender =
function(selected){

    if(
        selected !== "male" &&
        selected !== "female"
    ){

        return;

    }

    zyntraGender =
        selected;

    try{

        localStorage.setItem(
            ZYNTRA_F01.genderKey,
            selected
        );

        localStorage.setItem(
            ZYNTRA_F01.themeKey,
            selected
        );

    }catch(e){}

    zfApplyTheme();

    var gender =
        document.getElementById(
            "zf-gender"
        );

    if(gender){

        gender.remove();

    }

    zfRenderMining();

    zfToast(
        selected === "female"
        ? "Pink theme activated 💗"
        : "Blue theme activated 💙"
    );

};

// ============================================================
// START EXPERIENCE
// ============================================================

function zfStartExperience(){

    zfApplyTheme();

    if(!zyntraGender){

        zfShowGender();

        return;

    }

    zfRenderMining();

}

// ============================================================
// INITIAL CSS + SPLASH
// ============================================================

zfAddCSS();

zfApplyTheme();

setTimeout(function(){

    zfShowSplash();

},100);
    // ============================================================
// ZYNTRA FUTURE-01
// PART 2 OF 3
// ============================================================

// ============================================================
// MINING CARD
// ============================================================

function zfRenderMining(){

    var container =
        document.querySelector(
            ".container"
        );

    if(!container){

        setTimeout(
            zfRenderMining,
            300
        );

        return;

    }

    var old =
        document.getElementById(
            "zf-mining-card"
        );

    if(old){

        old.remove();

    }

    var card =
        document.createElement(
            "div"
        );

    card.id =
        "zf-mining-card";

    card.className =
        "card";

    card.innerHTML = `

        <div class="zf-mining-head">

            <div class="zf-mining-title">
                ⛏️ Zyntra Mining
            </div>

            <div class="zf-mining-badge">
                MINING
            </div>

        </div>

        <div class="zf-mining-area">

            <div class="zf-mining-avatar">

                <img
                    id="zf-mining-image"
                    src="${zfGetCharacter()}"
                    onerror="this.style.display='none'"
                >

            </div>

            <div
                class="zf-mining-status"
                id="zf-mining-status"
            >
                Ready to mine
            </div>

            <div
                class="zf-mining-time"
                id="zf-mining-time"
            >
                01:00:00
            </div>

            <div class="zf-mining-reward">
                Mining Reward:
                <b>
                    +${ZYNTRA_F01.miningReward.toLocaleString()}
                    BTTC
                </b>
            </div>

            <button
                class="zf-mining-button"
                id="zf-mining-button"
                onclick="window.zyntraStartMining()"
            >
                ⛏️ START MINING
            </button>

            <div class="zf-mining-info">

                Mining runs for
                <b>1 hour</b>.

                Keep Zyntra open or return later.
                Your mining session is saved automatically.

            </div>

        </div>

    `;

    var header =
        container.querySelector(
            ".header"
        );

    if(header){

        header.insertAdjacentElement(
            "afterend",
            card
        );

    }else{

        container.prepend(
            card
        );

    }

    zfUpdateMiningUI();

}

// ============================================================
// FORMAT TIME
// ============================================================

function zfFormatTime(seconds){

    seconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );

    var hours =
        Math.floor(
            seconds / 3600
        );

    var minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    var secs =
        seconds % 60;

    return [

        String(hours)
            .padStart(2,"0"),

        String(minutes)
            .padStart(2,"0"),

        String(secs)
            .padStart(2,"0")

    ].join(":");

}

// ============================================================
// REMAINING MINING TIME
// ============================================================

function zfGetRemainingSeconds(){

    if(
        !zyntraMining ||
        !zyntraMining.active
    ){

        return 0;

    }

    var started =
        Number(
            zyntraMining.startedAt
        ) || 0;

    var duration =
        Number(
            zyntraMining.duration
        ) ||
        ZYNTRA_F01.miningDuration;

    if(!started){

        return duration;

    }

    var elapsed =
        Math.floor(
            (Date.now() - started) / 1000
        );

    return Math.max(
        0,
        duration - elapsed
    );

}

// ============================================================
// MINING UI UPDATE
// ============================================================

function zfUpdateMiningUI(){

    var timeElement =
        document.getElementById(
            "zf-mining-time"
        );

    var statusElement =
        document.getElementById(
            "zf-mining-status"
        );

    var button =
        document.getElementById(
            "zf-mining-button"
        );

    var image =
        document.getElementById(
            "zf-mining-image"
        );

    if(image){

        image.src =
            zfGetCharacter();

    }

    if(
        !timeElement ||
        !statusElement ||
        !button
    ){

        return;

    }

    if(
        !zyntraMining ||
        !zyntraMining.active
    ){

        timeElement.innerText =
            "01:00:00";

        statusElement.innerText =
            "Ready to mine";

        button.innerText =
            "⛏️ START MINING";

        button.classList.remove(
            "mining-active"
        );

        button.disabled =
            false;

        return;

    }

    var remaining =
        zfGetRemainingSeconds();

    if(remaining <= 0){

        zfCompleteMining();

        return;

    }

    timeElement.innerText =
        zfFormatTime(
            remaining
        );

    statusElement.innerText =
        "Mining in progress...";

    button.innerText =
        "⛏️ MINING ACTIVE";

    button.classList.add(
        "mining-active"
    );

    button.disabled =
        true;

}

// ============================================================
// START MINING
// ============================================================

window.zyntraStartMining =
function(){

    if(
        zyntraMining &&
        zyntraMining.active
    ){

        zfToast(
            "Mining is already active."
        );

        return;

    }

    zyntraMining = {

        active:true,

        startedAt:
            Date.now(),

        duration:
            ZYNTRA_F01.miningDuration,

        reward:
            ZYNTRA_F01.miningReward,

        claimed:false

    };

    zfSaveMining();

    zfStartMiningTimer();

    zfUpdateMiningUI();

    zfToast(
        "⛏️ Mining started! Come back in 1 hour."
    );

};

// ============================================================
// MINING TIMER
// ============================================================

function zfStartMiningTimer(){

    if(zyntraMiningTimer){

        clearInterval(
            zyntraMiningTimer
        );

        zyntraMiningTimer =
            null;

    }

    if(
        !zyntraMining ||
        !zyntraMining.active
    ){

        return;

    }

    if(zyntraMiningRunning){

        return;

    }

    zyntraMiningRunning =
        true;

    zyntraMiningTimer =
        setInterval(function(){

            if(
                !zyntraMining ||
                !zyntraMining.active
            ){

                zfStopMiningTimer();

                return;

            }

            var remaining =
                zfGetRemainingSeconds();

            if(remaining <= 0){

                zfStopMiningTimer();

                zfCompleteMining();

                return;

            }

            var time =
                document.getElementById(
                    "zf-mining-time"
                );

            if(time){

                time.innerText =
                    zfFormatTime(
                        remaining
                    );

            }

        },1000);

}

// ============================================================
// STOP MINING TIMER
// ============================================================

function zfStopMiningTimer(){

    if(zyntraMiningTimer){

        clearInterval(
            zyntraMiningTimer
        );

        zyntraMiningTimer =
            null;

    }

    zyntraMiningRunning =
        false;

}

// ============================================================
// COMPLETE MINING
// ============================================================

function zfCompleteMining(){

    if(
        !zyntraMining ||
        !zyntraMining.active
    ){

        return;

    }

    if(
        zyntraMining.claimed
    ){

        zyntraMining.active =
            false;

        zfSaveMining();

        zfUpdateMiningUI();

        return;

    }

    var reward =
        Number(
            zyntraMining.reward
        ) ||
        ZYNTRA_F01.miningReward;

    zyntraMining.claimed =
        true;

    zyntraMining.active =
        false;

    zfSaveMining();

    zfAddBalance(
        reward
    );

    zfUpdateMiningUI();

    zfToast(
        "🎉 Mining complete! +" +
        reward.toLocaleString() +
        " BTTC"
    );

}

// ============================================================
// RESUME MINING AFTER RELOAD
// ============================================================

function zfResumeMining(){

    if(
        !zyntraMining ||
        !zyntraMining.active
    ){

        return;

    }

    var remaining =
        zfGetRemainingSeconds();

    if(remaining <= 0){

        zfCompleteMining();

        return;

    }

    zfStartMiningTimer();

    zfUpdateMiningUI();

}

// ============================================================
// PROFESSIONAL QUICK NAVIGATION
// ============================================================

function zfAddQuickNav(){

    if(
        document.getElementById(
            "zf-quick-nav"
        )
    ){

        return;

    }

    var nav =
        document.createElement(
            "div"
        );

    nav.id =
        "zf-quick-nav";

    nav.innerHTML = `

        <div
            onclick="window.zfGoHome()"
        >
            🏠
            <span>Home</span>
        </div>

        <div
            onclick="window.zfGoMining()"
        >
            ⛏️
            <span>Mine</span>
        </div>

        <div
            onclick="window.zfGoTasks()"
        >
            📋
            <span>Tasks</span>
        </div>

        <div
            onclick="window.zfGoFriends()"
        >
            👥
            <span>Friends</span>
        </div>

        <div
            onclick="window.zfGoProfile()"
        >
            👤
            <span>Profile</span>
        </div>

    `;

    var style =
        document.createElement(
            "style"
        );

    style.id =
        "zf-nav-style";

    style.innerHTML = `

        #zf-quick-nav{

            position:fixed;

            left:50%;

            bottom:10px;

            transform:
                translateX(-50%);

            width:
                min(94%,500px);

            padding:
                8px 7px;

            display:grid;

            grid-template-columns:
                repeat(5,1fr);

            gap:4px;

            background:
                rgba(9,10,20,.94);

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius:18px;

            backdrop-filter:
                blur(15px);

            box-shadow:
                0 10px 35px
                rgba(0,0,0,.45);

            z-index:9000;

        }

        #zf-quick-nav div{

            min-width:0;

            padding:
                7px 2px;

            border-radius:12px;

            text-align:center;

            color:#888;

            font-size:17px;

            cursor:pointer;

        }

        #zf-quick-nav div span{

            display:block;

            margin-top:3px;

            font-size:9px;

        }

        #zf-quick-nav div:active{

            transform:scale(.92);

        }

        body.zf-female
        #zf-quick-nav div:active{

            background:
                rgba(255,45,149,.12);

        }

        body:not(.zf-female)
        #zf-quick-nav div:active{

            background:
                rgba(0,229,255,.12);

        }

        body{

            padding-bottom:80px !important;

        }

    `;

    document.head.appendChild(
        style
    );

    document.body.appendChild(
        nav
    );

}

// ============================================================
// NAVIGATION HELPERS
// ============================================================

function zfScrollTo(selector){

    var element =
        document.querySelector(
            selector
        );

    if(!element){

        return;

    }

    element.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}

window.zfGoHome =
function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

window.zfGoMining =
function(){

    zfScrollTo(
        "#zf-mining-card"
    );

};

window.zfGoTasks =
function(){

    zfScrollTo(
        "#tasksSection"
    );

};

window.zfGoFriends =
function(){

    zfScrollTo(
        "#socialSection"
    );

};

window.zfGoProfile =
function(){

    zfScrollTo(
        ".card:last-of-type"
    );

};

// ============================================================
// INITIALIZE PROFESSIONAL UI
// ============================================================

function zfInitialize(){

    zfApplyTheme();

    zfRenderMining();

    zfAddQuickNav();

    zfResumeMining();

}

// ============================================================
// WAIT FOR INDEX
// ============================================================

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        function(){

            setTimeout(
                zfInitialize,
                100
            );

        }
    );

}else{

    setTimeout(
        zfInitialize,
        100
    );

        }
    // ============================================================
// ZYNTRA FUTURE-01
// PART 3 OF 3 — FINAL
// ============================================================

// ============================================================
// PROFILE / BALANCE ENHANCEMENT
// ============================================================

function zfEnhanceProfile(){

    var cards =
        document.querySelectorAll(
            ".card"
        );

    if(!cards || !cards.length){

        return;

    }

    cards.forEach(function(card){

        card.style.transition =
            "transform .2s ease, border-color .2s ease";

    });

}

// ============================================================
// KEEP BALANCE UI UPDATED
// ============================================================

function zfRefreshMainBalance(){

    try{

        if(
            typeof update === "function"
        ){

            update();

        }

    }catch(e){

        console.log(
            "Zyntra update error:",
            e
        );

    }

    zfUpdateMiningUI();

}

// ============================================================
// VISIBILITY CHECK
// ============================================================

document.addEventListener(
    "visibilitychange",
    function(){

        if(
            document.visibilityState ===
            "visible"
        ){

            zfRefreshMainBalance();

            if(
                zyntraMining &&
                zyntraMining.active
            ){

                var remaining =
                    zfGetRemainingSeconds();

                if(remaining <= 0){

                    zfCompleteMining();

                }else{

                    zfStartMiningTimer();

                    zfUpdateMiningUI();

                }

            }

        }

    }
);

// ============================================================
// PAGE FOCUS CHECK
// ============================================================

window.addEventListener(
    "focus",
    function(){

        zfRefreshMainBalance();

    }
);

// ============================================================
// SAFE PAGE LOAD
// ============================================================

window.addEventListener(
    "load",
    function(){

        setTimeout(
            function(){

                zfEnhanceProfile();

                zfRefreshMainBalance();

            },
            500
        );

    }
);

// ============================================================
// PREVENT DOUBLE MINING START
// ============================================================

window.addEventListener(
    "beforeunload",
    function(){

        if(
            zyntraMining &&
            zyntraMining.active
        ){

            zfSaveMining();

        }

    }
);

// ============================================================
// OPTIONAL PUBLIC FUNCTIONS
// ============================================================

window.zyntraMiningStatus =
function(){

    return {

        active:
            !!(
                zyntraMining &&
                zyntraMining.active
            ),

        remaining:
            zfGetRemainingSeconds(),

        reward:
            zyntraMining ?
            zyntraMining.reward :
            ZYNTRA_F01.miningReward

    };

};

// ============================================================
// FINAL START CHECK
// ============================================================

setTimeout(
    function(){

        try{

            zfApplyTheme();

            if(
                zyntraGender &&
                document.getElementById(
                    "zf-mining-card"
                )
            ){

                zfUpdateMiningUI();

            }

        }catch(e){

            console.log(
                "Zyntra Future-01 final check:",
                e
            );

        }

    },
    1200
);

// ============================================================
// ZYNTRA FUTURE-01 END
// ============================================================

console.log(
    "Zyntra Future-01 loaded successfully."
);

// ============================================================
// FINAL CLOSE
// ============================================================

})();
