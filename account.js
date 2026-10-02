(()=>{"use strict";
const API="https://license.pimpmybim.fr";
const SESSION_KEY="pmb-account-web-session-v1";
const $=id=>document.getElementById(id);
const authView=$("authView"),dashboardView=$("dashboardView"),guestHero=$("guestHero"),notice=$("accountNotice");
let session=loadSession();
let currentPlanCode="FREE";
let billingCycle="monthly";

function loadSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null")}catch{return null}}
function saveSession(value){session=value;if(value)sessionStorage.setItem(SESSION_KEY,JSON.stringify(value));else sessionStorage.removeItem(SESSION_KEY)}
function token(){return session?.accessToken||session?.AccessToken||""}
function refreshToken(){return session?.refreshToken||session?.RefreshToken||""}
function get(obj,...keys){for(const k of keys){if(obj&&obj[k]!==undefined)return obj[k]}return null}
function showNotice(message,type=""){notice.textContent=message;notice.className="accountNotice"+(type?" "+type:"");notice.hidden=false}
function clearNotice(){notice.hidden=true;notice.textContent="";notice.className="accountNotice"}
function setBusy(el,busy){el?.classList.toggle("accountBusy",busy)}
function showGuest(){guestHero.hidden=false;authView.hidden=false;dashboardView.hidden=true}
function showAccount(){guestHero.hidden=true;authView.hidden=true;dashboardView.hidden=false}
async function parseResponse(res){const text=await res.text();if(!text)return null;try{return JSON.parse(text)}catch{return {message:text}}}
async function request(path,options={}){
  const headers={"Accept":"application/json",...(options.body?{"Content-Type":"application/json"}:{}),...(options.headers||{})};
  const res=await fetch(API+path,{...options,headers});
  const data=await parseResponse(res);
  if(!res.ok){const err=new Error(get(data,"message","Message","title","Title")||("Erreur HTTP "+res.status));err.status=res.status;err.data=data;throw err}
  return data;
}
async function authorized(path,options={}){
  const run=()=>request(path,{...options,headers:{...(options.headers||{}),"Authorization":"Bearer "+token()}});
  try{return await run()}catch(err){
    if(err.status!==401||!refreshToken())throw err;
    const fresh=await request("/api/account/token/refresh",{method:"POST",body:JSON.stringify({refreshToken:refreshToken()})});
    saveSession(fresh);
    return run();
  }
}
function formatDate(value){if(!value)return"—";const d=new Date(value);return Number.isNaN(d.getTime())?"—":new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d)}
function planLabel(code,name){const c=String(code||"FREE").toUpperCase();if(c==="PREMIUM")return"IFC Pro";if(c==="PRO")return"IFC Control";if(c==="FREE")return"IFC Viewer";if(c==="TRIAL")return"IFC Trial";if(c==="OWNER"||c==="PROMAX")return"PMB Owner";return name||("PMB "+c)}
function projectLimitText(value){return value===null||value===undefined?"Illimité":String(value)}
function initials(name){const parts=String(name||"P").trim().split(/\s+/).filter(Boolean);return (parts[0]?.[0]||"P")+(parts.length>1?(parts.at(-1)?.[0]||""):"")}
function renderFeatures(features){
  const root=$("featureList");root.innerHTML="";
  const list=Array.isArray(features)?features:[];
  if(!list.length){root.innerHTML='<span class="accountMuted">Aucun droit spécifique retourné.</span>';return}
  list.forEach(feature=>{const el=document.createElement("span");el.className="accountFeature";el.textContent=feature;root.appendChild(el)})
}
function renderDevices(devices){
  const root=$("deviceList");root.innerHTML="";
  const list=Array.isArray(devices)?devices:[];
  if(!list.length){root.innerHTML='<div class="accountDeviceEmpty">Aucun appareil activé pour le moment.</div>';return}
  list.forEach(device=>{
    const active=Boolean(get(device,"isActive","IsActive"));
    const name=get(device,"machineName","MachineName")||"Appareil sans nom";
    const plan=get(device,"planCode","PlanCode")||"—";
    const activated=get(device,"activatedAtUtc","ActivatedAtUtc");
    const deactivated=get(device,"deactivatedAtUtc","DeactivatedAtUtc");
    const row=document.createElement("div");row.className="accountDevice";
    const info=document.createElement("div");
    const title=document.createElement("strong");title.textContent=name;
    const meta=document.createElement("div");meta.className="accountDeviceMeta";
    const planMeta=document.createElement("span");planMeta.textContent="Plan "+plan;
    const dateMeta=document.createElement("span");dateMeta.textContent=active?"Activé le "+formatDate(activated):"Désactivé le "+formatDate(deactivated);
    meta.append(planMeta,dateMeta);info.append(title,meta);
    const status=document.createElement("span");status.className="accountDeviceStatus "+(active?"active":"inactive");status.textContent=active?"Actif":"Inactif";
    row.append(info,status);root.appendChild(row)
  })
}
function profileName(profile){return get(profile,"displayName","DisplayName","name","Name")||"Utilisateur PMB"}
function profileEmail(profile){return get(profile,"email","Email")||""}
function renderDashboard(profile,ent,devices){
  const code=get(ent,"planCode","PlanCode")||"FREE";
  currentPlanCode=String(code).toUpperCase();
  const name=get(ent,"planName","PlanName");
  const limits=get(ent,"limits","Limits")||{};
  const acts=get(ent,"activations","Activations")||{};
  const active=get(acts,"active","Active")??0;
  const max=get(acts,"max","Max")??0;
  const expires=get(ent,"expiresAtUtc","ExpiresAtUtc");
  const licenseActive=get(ent,"licenseActive","LicenseActive");
  const licenseStatus=get(ent,"licenseStatus","LicenseStatus")||"ACTIVE";
  const display=profileName(profile),email=profileEmail(profile);
  const disabled=Boolean(get(profile,"isDisabled","IsDisabled"));

  $("welcomeTitle").textContent="Bonjour "+display;
  $("sidebarName").textContent=display;
  $("sidebarEmail").textContent=email;
  $("accountAvatar").textContent=initials(display).toUpperCase();
  $("profileName").textContent=display;
  $("profileEmail").textContent=email||"—";
  $("profileStatus").textContent=disabled?"Désactivé":"Actif";
  $("profileStatusBadge").textContent=disabled?"Désactivé":"Compte actif";
  $("planName").textContent=planLabel(code,name);
  $("licenseStatus").textContent=licenseActive===false&&currentPlanCode!=="FREE"?"Licence inactive":String(licenseStatus);
  $("projectLimit").textContent=projectLimitText(get(limits,"maxProjects","MaxProjects"));
  $("activationCount").textContent=String(active)+" / "+String(max);
  $("activationBadge").textContent=String(active)+" / "+String(max)+" activations";
  $("expiresAt").textContent=expires?formatDate(expires):"—";
  $("expiryCaption").textContent=expires?"date d'expiration":"aucune expiration";
  renderFeatures(get(ent,"features","Features")||[]);
  renderDevices(devices);
  renderPlanState();
  showAccount()
}
async function loadDashboard(){
  clearNotice();
  const [profile,ent,devices]=await Promise.all([
    authorized("/api/account/me"),
    authorized("/api/account/entitlements"),
    authorized("/api/account/devices")
  ]);
  renderDashboard(profile,ent,devices)
}
async function authenticate(path,payload){
  const data=await request(path,{method:"POST",body:JSON.stringify(payload)});
  saveSession(data);
  await loadDashboard()
}
function switchAuth(mode){
  const login=mode==="login";
  $("loginForm").hidden=!login;
  $("registerForm").hidden=login;
  $("showLogin").classList.toggle("active",login);
  $("showRegister").classList.toggle("active",!login);
  $("showLogin").setAttribute("aria-selected",String(login));
  $("showRegister").setAttribute("aria-selected",String(!login));
  $("authTitle").textContent=login?"Connexion":"Créer un compte";
  $("authSubtitle").textContent=login?"Retrouvez vos licences, appareils et droits PMB.":"Créez votre compte PMB Free en quelques secondes."
}
function activatePanel(name){
  document.querySelectorAll(".accountMenuItem").forEach(btn=>btn.classList.toggle("active",btn.dataset.section===name));
  document.querySelectorAll(".accountPanel").forEach(panel=>panel.classList.toggle("active",panel.dataset.panel===name));
  if(innerWidth<1000)document.querySelector(".accountContent")?.scrollIntoView({behavior:"smooth",block:"start"})
}
function renderPlanState(){
  document.querySelectorAll(".accountPlan").forEach(card=>{
    const code=card.dataset.plan,current=code===currentPlanCode;
    card.classList.toggle("current",current);
    const badge=card.querySelector(".accountPlanCurrent");if(badge)badge.hidden=!current;
    const button=card.querySelector(".choosePlanButton");
    if(button){button.disabled=current;button.textContent=current?"Plan actuel":code==="FREE"?"Passer à IFC Viewer":code==="PRO"?"Choisir IFC Control":"Choisir IFC Pro"}
  })
}
function renderBillingCycle(){
  $("billingMonthly")?.classList.toggle("active",billingCycle==="monthly");
  $("billingYearly")?.classList.toggle("active",billingCycle==="yearly");
  document.querySelectorAll(".accountPlanPrice [data-monthly][data-yearly]").forEach(el=>{el.textContent=el.dataset[billingCycle]||el.textContent})
}
function choosePlan(plan){
  const status=$("planChoiceStatus"),label=plan==="PRO"?"IFC Control":plan==="PREMIUM"?"IFC Pro":"IFC Viewer",cycle=billingCycle==="yearly"?"annuel":"mensuel";
  localStorage.setItem("pmb-account-plan-intent-v1",JSON.stringify({plan,billingCycle,selectedAt:new Date().toISOString()}));
  status.hidden=false;status.className="planChoiceStatus success";
  status.textContent=plan==="FREE"
    ?"Choix enregistré : "+label+". Le changement réel sera connecté au système d'abonnement."
    :"Choix enregistré : "+label+" ("+cycle+"). Le paiement n'est pas encore branché : votre plan actuel reste inchangé."
}
$("showLogin")?.addEventListener("click",()=>switchAuth("login"));
$("showRegister")?.addEventListener("click",()=>switchAuth("register"));
$("forgotPasswordButton")?.addEventListener("click",()=>showNotice("La récupération par email sera activée avec l'envoi automatique des emails PMB.",""));
$("loginForm")?.addEventListener("submit",async e=>{
  e.preventDefault();clearNotice();setBusy(authView,true);
  try{await authenticate("/api/account/login",{email:$("loginEmail").value.trim(),password:$("loginPassword").value})}
  catch(err){showNotice(err.status===401?"Email ou mot de passe incorrect.":err.message,"error")}
  finally{setBusy(authView,false)}
});
$("registerForm")?.addEventListener("submit",async e=>{
  e.preventDefault();clearNotice();setBusy(authView,true);
  try{
    await authenticate("/api/account/register",{displayName:$("registerName").value.trim(),email:$("registerEmail").value.trim(),password:$("registerPassword").value});
    showNotice("Compte créé. Votre accès PMB Free est actif.","success")
  }catch(err){showNotice(err.status===409?"Un compte existe déjà avec cette adresse email.":err.message,"error")}
  finally{setBusy(authView,false)}
});
document.querySelectorAll(".accountMenuItem").forEach(btn=>btn.addEventListener("click",()=>activatePanel(btn.dataset.section)));
$("refreshAccount")?.addEventListener("click",async()=>{
  setBusy(dashboardView,true);clearNotice();
  try{await loadDashboard();showNotice("Compte et droits actualisés.","success")}
  catch(err){showNotice(err.message,"error")}
  finally{setBusy(dashboardView,false)}
});
$("logoutButton")?.addEventListener("click",async()=>{
  const rt=refreshToken();
  try{if(token()&&rt)await authorized("/api/account/logout",{method:"POST",body:JSON.stringify({refreshToken:rt})})}catch{}
  saveSession(null);clearNotice();switchAuth("login");showGuest();showNotice("Vous êtes déconnecté.","success")
});
$("billingMonthly")?.addEventListener("click",()=>{billingCycle="monthly";renderBillingCycle()});
$("billingYearly")?.addEventListener("click",()=>{billingCycle="yearly";renderBillingCycle()});
document.querySelectorAll(".choosePlanButton").forEach(button=>button.addEventListener("click",()=>choosePlan(button.dataset.plan)));
renderBillingCycle();switchAuth("login");

(async function boot(){
  if(!session){showGuest();return}
  try{await loadDashboard()}
  catch{saveSession(null);showGuest();showNotice("Votre session a expiré. Connectez-vous à nouveau.","error")}
})();
})();