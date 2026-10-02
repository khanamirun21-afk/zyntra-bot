// PART 1 / 2 - ZYNTRA FINAL
// ZYNTRA FUTURE 01 - FINAL MERGED - 2 PART HD
(function(){
"use strict";
console.log("Zyntra Final Loaded");

function getUser(){
  try{
    if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user)
      return Telegram.WebApp.initDataUnsafe.user;
  }catch(e){}
  return null;
}

function getName(){var u=getUser();return u?(u.first_name||"User"):"User";}
function getUsername(){var u=getUser();return u&&u.username?"@"+u.username:"No username";}
function getUserId(){var u=getUser();return u?(u.id||""):"";}
function getBalance(){
  try{if(typeof data!=="undefined")return Number(data.bttc||1240);}catch(e){}
  return Number(localStorage.getItem('zyntra_bal')||1240);
}

function getLevel(b){
  if(b>=100000)return 5;
  if(b>=50000)return 4;
  if(b>=25000)return 3;
  if(b>=10000)return 2;
  return 1;
}

function getRefLink(){
  return "https://t.me/ZyntraBotOfficial?start="+encodeURIComponent(getUserId());
}

function esc(s){
  if(!s)return"";
  return s.replace(/[&<>"']/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

function toast(m){
  var t=document.createElement("div");
  t.textContent=m;
  t.style.cssText="position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#ffb300;color:#000;padding:10px 18px;border-radius:20px;z-index:10000;font-size:14px;font-weight:bold;";
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},2500);
}

function addStyles(){
  if(document.getElementById("zyntraFutureStyle"))return;
  var s=document.createElement("style");
  s.id="zyntraFutureStyle";
  s.innerHTML=".zyntra-bottom-nav{position:fixed;left:0;right:0;bottom:0;height:76px;z-index:9999;background:rgba(8,8,15,.97);border-top:1px solid #292936;display:flex;justify-content:space-around;align-items:center}";
  document.head.appendChild(s);
}

function createBottomNav(){
  if(document.getElementById("zyntraBottomNav"))return;
  var nav=document.createElement("div");
  nav.id="zyntraBottomNav";
  nav.className="zyntra-bottom-nav";
  nav.innerHTML='<button class="zyntra-nav-btn active" id="zyntraMineBtn"><span class="zyntra-nav-icon">M</span><span>Mine</span></button>';
  document.body.appendChild(nav);

  document.getElementById("zyntraMineBtn").onclick=function(){closePage();window.scrollTo({top:0,behavior:"smooth"});};
  document.getElementById("zyntraTasksBtn").onclick=function(){closePage();if(typeof window.showTasks==="function")window.showTasks();};
  document.getElementById("zyntraMiningBtn").onclick=openMining;
  document.getElementById("zyntraFriendsBtn").onclick=openReferral;
  document.getElementById("zyntraProfileBtn").onclick=openProfile;
}

function closePage(){
  document.querySelectorAll(".zyntra-page").forEach(function(p){p.remove();});
}

function createPage(id){
  closePage();
  var pg=document.createElement("div");
  pg.id=id;
  pg.className="zyntra-page";
  document.body.appendChild(pg);
  return pg;
}

function pageHeader(t,b){
  return '<div class="zyntra-page-head"><button class="zyntra-back" id="'+b+'"><</button><div class="zyntra-page-title">'+t+'</div></div>';
}

// --- PART 1 END - PART 2 STARTS NEXT ---

function openProfile(){
  var pg=createPage("zyntraProfilePage");
  var bal=getBalance();
  var lvl=getLevel(bal);
  pg.innerHTML='<div class="zyntra-page-inner">'+pageHeader("Profile","profileBack")+'<div class="zyntra-card"><div class="zyntra-avatar">U</div><div class="zyntra-name">'+esc(getName())+'</div><div class="zyntra-sub">'+esc(getUsername())+'</div></div><div class="zyntra-card"><div class="zyntra-stat-label">Balance</div><div class="zyntra-stat-val">'+bal+' BTTC</div></div><div class="zyntra-card"><div class="zyntra-stat-label">Level</div><div class="zyntra-stat-val">Level '+lvl+'</div></div><button class="zyntra-btn" id="profileFriends">Invite Friends</button></div>';
  document.getElementById("profileBack").onclick=closePage;
  document.getElementById("profileFriends").onclick=openReferral;
}

function openReferral(){
  var pg=createPage("zyntraReferralPage");
  var link=getRefLink();
  pg.innerHTML='<div class="zyntra-page-inner">'+pageHeader("Friends","friendsBack")+'<div class="zyntra-card" style="text-align:center"><div style="font-size:52px">👥</div><h3>Invite Friends</h3><p>Get bonus for each invited friend!</p></div><div class="zyntra-card"><div class="zyntra-stat-label">Your Referral Link</div><div class="zyntra-link-box">'+esc(link)+'</div></div><button class="zyntra-btn" id="copyReferral">Copy Link</button><button class="zyntra-btn zyntra-btn-sec" id="shareReferral">Share</button></div>';
  document.getElementById("friendsBack").onclick=closePage;
  document.getElementById("copyReferral").onclick=function(){navigator.clipboard.writeText(link).then(function(){toast("Link copied!");});};
  document.getElementById("shareReferral").onclick=function(){var url="https://t.me/share/url?url="+encodeURIComponent(link)+"&text="+encodeURIComponent("Join Zyntra Future!");window.open(url,"_blank");};
}

var mining={active:false,startedAt:0,duration:3600,earned:0};

function loadMining(){
  try{var s=localStorage.getItem("zyntra_mining_v1");if(s)mining=Object.assign(mining,JSON.parse(s));}catch(e){}
}

function saveMining(){
  try{localStorage.setItem("zyntra_mining_v1",JSON.stringify(mining));}catch(e){}
}

function openMining(){
  var pg=createPage("zyntraMiningPage");
  loadMining();
  var now=Date.now()/1000;
  var elapsed=mining.active?(now-mining.startedAt):0;
  var rem=Math.max(0,mining.duration-elapsed);
  var prog=mining.active?Math.min(100,(elapsed/mining.duration)*100):0;
  pg.innerHTML='<div class="zyntra-page-inner">'+pageHeader("Mining","miningBack")+'<div class="zyntra-card" style="text-align:center"><div class="zyntra-mining-circle">⛏️</div><h3>Mining Speed</h3><p>Status: '+(mining.active?'Active':'Inactive')+'</p></div><button class="zyntra-btn" id="startMiningBtn">'+(mining.active?'Mining in progress...':'Start Mining')+'</button></div>';
  document.getElementById("miningBack").onclick=closePage;
  document.getElementById("startMiningBtn").onclick=function(){
    if(!mining.active){
      mining.active=true;
      mining.startedAt=Date.now()/1000;
      saveMining();
      toast("Mining Started!");
      openMining();
    }
  };
}

function init(){
  addStyles();
  createBottomNav();
  loadMining();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}

window.openProfile=openProfile;
window.openReferral=openReferral;
window.openMining=openMining;
})();
