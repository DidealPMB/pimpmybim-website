(()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const isDoc=['docs.html','docs-app.html','architecture.html','enterprise.html'].includes(path);

  function addStyles(){
    if(document.getElementById('pmb-doc-nav-style'))return;
    const s=document.createElement('style');
    s.id='pmb-doc-nav-style';
    s.textContent=`
      .docSwitch.pmbDocSwitch{display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap}
      .pmbDocGroup{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .pmbDocGroup>span{font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:900;color:var(--lime-deep);margin-right:3px}
      .pmbDocGroup a{margin:0!important}
      @media(max-width:700px){.docSwitch.pmbDocSwitch{display:grid;gap:14px}.pmbDocGroup{align-items:flex-start}.pmbDocGroup>span{flex-basis:100%}}
    `;
    document.head.appendChild(s);
  }

  function installGlobalResourceLinks(){
    const menu=document.querySelector('.resourceMenu');
    if(menu){
      const docs=[...menu.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').replace(/^\.\//,'')==='docs.html');
      if(docs){
        const strong=docs.querySelector('strong');
        const sub=docs.querySelector('span');
        if(strong)strong.textContent='Documentation produit';
        if(sub)sub.textContent='Plugin Revit · Application IFC';
        if(!menu.querySelector('.pmbEnterpriseNav')){
          const a=document.createElement('a');
          a.href='architecture.html';
          a.className='megaItem pmbEnterpriseNav';
          a.innerHTML='<i>IT</i><div><strong>Architecture & DSI</strong><span>Architecture · Sécurité · Déploiement</span></div>';
          docs.insertAdjacentElement('afterend',a);
        }
      }
    }

    const footer=document.querySelector('.siteFooter');
    if(footer){
      const docs=[...footer.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').replace(/^\.\//,'')==='docs.html');
      if(docs){
        docs.textContent='Documentation produit';
        const col=docs.closest('.footerCol');
        if(col&&!col.querySelector('.pmbEnterpriseFooter')){
          const a=document.createElement('a');
          a.href='architecture.html';
          a.className='pmbEnterpriseFooter';
          a.textContent='Architecture & DSI';
          docs.insertAdjacentElement('afterend',a);
        }
      }
    }
  }

  function installDocSwitch(){
    if(!isDoc)return;
    const sw=document.querySelector('.docSwitch');
    if(!sw||sw.dataset.pmbSplit==='1')return;
    addStyles();
    sw.dataset.pmbSplit='1';
    sw.classList.add('pmbDocSwitch');
    const active=(file)=>path===file?' class="active"':'';
    sw.innerHTML=`
      <div class="pmbDocGroup">
        <span>Documentation produit</span>
        <a href="docs.html"${active('docs.html')}>Plugin Revit</a>
        <a href="docs-app.html"${active('docs-app.html')}>Application IFC</a>
      </div>
      <div class="pmbDocGroup">
        <span>Architecture & DSI</span>
        <a href="architecture.html"${active('architecture.html')}>Architecture technique</a>
        <a href="enterprise.html"${active('enterprise.html')}>Sécurité & déploiement</a>
      </div>`;
  }

  function addSwitchToTechnicalPages(){
    if(!['architecture.html','enterprise.html'].includes(path))return;
    if(document.querySelector('.docSwitch'))return;
    const hero=document.querySelector('.resourceHero .wrap');
    if(!hero)return;
    const sw=document.createElement('div');
    sw.className='docSwitch';
    hero.appendChild(sw);
    installDocSwitch();
  }

  function run(){
    addSwitchToTechnicalPages();
    installDocSwitch();
    installGlobalResourceLinks();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  let tries=0;
  const timer=setInterval(()=>{run();if(++tries>20)clearInterval(timer)},250);
})();