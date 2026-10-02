(function() {
    'use strict';

    // 2. Helper Functions
    function getUser() {
        try {
            if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
                return Telegram.WebApp.initDataUnsafe.user;
            }
        } catch (e) {}
        return null;
    }

    function getName() {
        var u = getUser();
        return u ? (u.first_name || "User") : "User";
    }

    function getUsername() {
        var u = getUser();
        return u && u.username ? "@" + u.username : "No username";
    }

    function getUserId() {
        var u = getUser();
        return u ? (u.id || "") : "";
    }

    function getBalance() {
        try {
            if (typeof data !== "undefined" && data.bttc) return Number(data.bttc);
        } catch (e) {}
        return Number(localStorage.getItem('zyntra_bal') || 1240);
    }

    function getLevel(b) {
        if (b >= 100000) return 5;
        if (b >= 50000) return 4;
        if (b >= 25000) return 3;
        if (b >= 10000) return 2;
        return 1;
    }

    function getRefLink() {
        return "https://t.me/ZyntraBotOfficial?start=" + encodeURIComponent(getUserId());
    }

    function esc(s) {
        if (!s) return "";
        return String(s).replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    function toast(m) {
        var t = document.createElement("div");
        t.textContent = m;
        t.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#ffb300;color:#000;padding:10px 18px;border-radius:20px;z-index:10000;font-size:14px;font-weight:bold;";
        document.body.appendChild(t);
        setTimeout(function() { t.remove(); }, 2500);
    }

    // 3. addStyles()
    function addStyles() {
        if (document.getElementById("zyntraFutureStyle")) return;
        var css = `
            body { padding-bottom: 82px; }
            .zyntra-bottom-nav { position: fixed; left: 0; right: 0; bottom: 0; height: 76px; z-index: 9999; background: rgba(8,8,15,0.97); border-top: 1px solid #292936; display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; }
            .zyntra-nav-btn { background: transparent; border: none; height: 65px; color: #999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; cursor: pointer; }
            .zyntra-nav-icon { font-size: 25px; line-height: 1; }
            .zyntra-nav-btn.active { color: #ffb300; }
            .zyntra-nav-btn.active .zyntra-nav-icon { background: linear-gradient(135deg, #ffb300, #ff8a00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .zyntra-page { position: fixed; inset: 0; z-index: 10000; background: radial-gradient(circle at top, #241505 0%, #09090f 42%, #050507 100%); overflow-y: auto; padding: 18px 18px 100px 18px; }
            .zyntra-page-inner { max-width: 520px; margin: 0 auto; }
            .zyntra-page-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .zyntra-back { background: #20202b; border: none; color: #fff; width: 45px; height: 45px; border-radius: 14px; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .zyntra-page-title { color: #fff; font-size: 23px; font-weight: 900; }
            .zyntra-card { background: linear-gradient(135deg, rgba(35,25,15,0.6), rgba(18,18,27,0.8)); border: 1px solid #3b3020; border-radius: 22px; padding: 22px; margin-bottom: 12px; }
            .zyntra-avatar { width: 82px; height: 82px; border-radius: 50%; background: linear-gradient(135deg, #7135ff, #ff2455); display: flex; align-items: center; justify-content: center; font-size: 40px; color: #fff; font-weight: 900; margin: 0 auto 12px auto; }
            .zyntra-big-name { font-size: 24px; font-weight: 900; text-align: center; color: #fff; margin-top: 13px; }
            .zyntra-small-sub { font-size: 14px; color: #999; text-align: center; }
            .zyntra-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
            .zyntra-stat-bg { background: #15151f; border: 1px solid #292936; border-radius: 16px; padding: 16px; }
            .zyntra-stat-title { font-size: 12px; color: #999; margin-bottom: 4px; }
            .zyntra-stat-value { font-size: 17px; font-weight: 900; color: #fff; }
            .zyntra-mining-coin { width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(circle, #fff0a0 0%, #ffd447 40%, #d58b00 75%, #8c5700 100%); border: 8px solid #e1ad28; display: flex; align-items: center; justify-content: center; font-size: 52px; font-weight: 900; color: #191200; margin: 0 auto 16px auto; box-shadow: 0 0 30px rgba(255,179,0,0.3); }
            .zyntra-mining-rate { font-size: 18px; color: #00ff9d; font-weight: 900; text-align: center; }
            .zyntra-mining-timer { font-size: 14px; color: #aaa; text-align: center; margin-top: 7px; }
            .zyntra-start-btn { width: 100%; margin-top: 20px; padding: 18px; border-radius: 18px; background: linear-gradient(135deg, #ffcc00, #ff8a00); color: #111; font-size: 18px; font-weight: 900; border: none; cursor: pointer; }
            .zyntra-copy-box { background: #101019; border: 1px solid #292936; border-radius: 15px; padding: 13px; word-break: break-all; color: #ccc; font-size: 13px; margin-top: 8px; }
            .zyntra-action-btn { width: 100%; margin-top: 12px; padding: 14px; border-radius: 14px; background: #252535; color: #fff; font-size: 15px; font-weight: 800; border: none; cursor: pointer; }
        `;
        var s = document.createElement("style");
        s.id = "zyntraFutureStyle";
        s.innerHTML = css;
        document.head.appendChild(s);
    }

    // 4. createBottomNav()
    function createBottomNav() {
        if (document.getElementById("zyntraBottomNav")) return;
        var nav = document.createElement("div");
        nav.id = "zyntraBottomNav";
        nav.className = "zyntra-bottom-nav";
        nav.innerHTML = `
            <button class="zyntra-nav-btn active" id="zyntraMineBtn"><span class="zyntra-nav-icon">M</span><span>Mine</span></button>
            <button class="zyntra-nav-btn" id="zyntraTasksBtn"><span class="zyntra-nav-icon">T</span><span>Tasks</span></button>
            <button class="zyntra-nav-btn" id="zyntraMiningBtn"><span class="zyntra-nav-icon">Z</span><span>Mining</span></button>
            <button class="zyntra-nav-btn" id="zyntraFriendsBtn"><span class="zyntra-nav-icon">F</span><span>Friends</span></button>
            <button class="zyntra-nav-btn" id="zyntraProfileBtn"><span class="zyntra-nav-icon">P</span><span>Profile</span></button>
        `;
        document.body.appendChild(nav);

        document.getElementById("zyntraMineBtn").onclick = function() {
            closePage();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        document.getElementById("zyntraTasksBtn").onclick = function() {
            closePage();
            if (typeof window.showTasks === "function") window.showTasks();
        };
        document.getElementById("zyntraMiningBtn").onclick = openMining;
        document.getElementById("zyntraFriendsBtn").onclick = openReferral;
        document.getElementById("zyntraProfileBtn").onclick = openProfile;
    }

    // 5. Page Management Helpers
    function closePage() {
        document.querySelectorAll(".zyntra-page").forEach(function(p) { p.remove(); });
    }

    function createPage(id) {
        closePage();
        var pg = document.createElement("div");
        pg.id = id;
        pg.className = "zyntra-page";
        document.body.appendChild(pg);
        return pg;
    }

    function pageHeader(t, b) {
        return `<div class="zyntra-page-head"><button class="zyntra-back" id="${b}"><</button><div class="zyntra-page-title">${t}</div></div>`;
    }

    // 6. openProfile()
    function openProfile() {
        var pg = createPage("zyntraProfilePage");
        var bal = getBalance();
        var lvl = getLevel(bal);
        
        pg.innerHTML = `
            <div class="zyntra-page-inner">
                ${pageHeader("Profile", "profileBack")}
                <div class="zyntra-card">
                    <div class="zyntra-avatar">U</div>
                    <div class="zyntra-big-name">${esc(getName())}</div>
                    <div class="zyntra-small-sub">${esc(getUsername())}</div>
                </div>
                <div class="zyntra-stat-grid">
                    <div class="zyntra-stat-bg">
                        <div class="zyntra-stat-title">Balance</div>
                        <div class="zyntra-stat-value">${bal.toLocaleString()} BTTC</div>
                    </div>
                    <div class="zyntra-stat-bg">
                        <div class="zyntra-stat-title">Level</div>
                        <div class="zyntra-stat-value">Level ${lvl}</div>
                    </div>
                </div>
                <button class="zyntra-start-btn" id="profileFriends">Invite Friends</button>
            </div>
        `;

        document.getElementById("profileBack").onclick = closePage;
        document.getElementById("profileFriends").onclick = openReferral;
    }

    // 7. openReferral()
    function openReferral() {
        var pg = createPage("zyntraReferralPage");
        var link = getRefLink();

        pg.innerHTML = `
            <div class="zyntra-page-inner">
                ${pageHeader("Friends", "friendsBack")}
                <div class="zyntra-card" style="text-align:center;">
                    <div class="zyntra-avatar">F</div>
                    <div class="zyntra-big-name">Invite & Earn</div>
                    <div class="zyntra-small-sub">Share your link to earn bonus BTTC</div>
                </div>
                <div class="zyntra-card">
                    <div class="zyntra-stat-title">Your Link</div>
                    <div class="zyntra-copy-box">${esc(link)}</div>
                </div>
                <button class="zyntra-start-btn" id="copyReferral">Copy Link</button>
                <button class="zyntra-action-btn" id="shareReferral">Share</button>
            </div>
        `;

        document.getElementById("friendsBack").onclick = closePage;
        document.getElementById("copyReferral").onclick = function() {
            navigator.clipboard.writeText(link).then(function() {
                toast("Link Copied!");
            });
        };
        document.getElementById("shareReferral").onclick = function() {
            var shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(link);
            window.open(shareUrl, "_blank");
        };
    }

    // 8. Mining System
    var mining = { active: false, startedAt: 0, duration: 3600, earned: 0 };

    function loadMining() {
        try {
            var s = localStorage.getItem("zyntra_mining_v1");
            if (s) mining = Object.assign(mining, JSON.parse(s));
        } catch (e) {}
    }

    function saveMining() {
        try {
            localStorage.setItem("zyntra_mining_v1", JSON.stringify(mining));
        } catch (e) {}
    }

    function openMining() {
        var pg = createPage("zyntraMiningPage");
        loadMining();

        var now = Date.now() / 1000;
        var elapsed = mining.active ? (now - mining.startedAt) : 0;
        var rem = Math.max(0, mining.duration - elapsed);
        var prog = mining.active ? Math.min(100, (elapsed / mining.duration) * 100) : 0;

        var rateText = mining.active ? (prog.toFixed(1) + "%") : "0.00042 / sec";

        pg.innerHTML = `
            <div class="zyntra-page-inner">
                ${pageHeader("Mining", "miningBack")}
                <div class="zyntra-card" style="text-align:center;">
                    <div class="zyntra-mining-coin">${mining.active ? "M" : "Z"}</div>
                    <div class="zyntra-mining-rate">${rateText}</div>
                    <div class="zyntra-mining-timer">${mining.active ? "Time left: " + Math.ceil(rem) + "s" : "Mining Stopped"}</div>
                </div>
                <button class="zyntra-start-btn" id="startMiningBtn">
                    ${mining.active ? "Mining Active..." : "Start Mining"}
                </button>
            </div>
        `;

        document.getElementById("miningBack").onclick = closePage;
        document.getElementById("startMiningBtn").onclick = function() {
            if (!mining.active) {
                mining.active = true;
                mining.startedAt = Date.now() / 1000;
                saveMining();
                toast("Mining Started!");
                openMining();
            }
        };
    }

    // 9. init()
    function init() {
        addStyles();
        createBottomNav();
        loadMining();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // 10. Expose Window Functions
    window.openProfile = openProfile;
    window.openReferral = openReferral;
    window.openMining = openMining;

})();
