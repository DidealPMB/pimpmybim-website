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

  function makeMegaItem(href,icon,title,subtitle,extraClass=''){
    const a=document.createElement('a');
    a.href=href;
    a.className=`megaItem ${extraClass}`.trim();
    a.innerHTML=`<i>${icon}</i><div><strong>${title}</strong><span>${subtitle}</span></div>`;
    return a;
  }

  function installGlobalResourceLinks(){
    const menu=document.querySelector('.resourceMenu');
    if(menu){
      let revit=[...menu.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').replace(/^\.\//,'')==='docs.html');
      if(revit){
        revit.classList.add('pmbRevitDocsNav');
        const strong=revit.querySelector('strong');
        const sub=revit.querySelector('span');
        if(strong)strong.textContent='Documentation Plugin Revit';
        if(sub)sub.textContent='Installation · Modules · Exports · Workflows';

        let ifc=menu.querySelector('.pmbIfcDocsNav');
        if(!ifc){
          ifc=makeMegaItem('docs-app.html','IFC','Documentation Application IFC','Viewer · BCF · Contrôles · Reporting','pmbIfcDocsNav');
          revit.insertAdjacentElement('afterend',ifc);
        }

        if(!menu.querySelector('.pmbEnterpriseNav')){
          const it=makeMegaItem('architecture.html','IT','Architecture & DSI','Architecture · Sécurité · Déploiement','pmbEnterpriseNav');
          ifc.insertAdjacentElement('afterend',it);
        }
      }
    }

    const footer=document.querySelector('.siteFooter');
    if(footer){
      let revit=[...footer.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').replace(/^\.\//,'')==='docs.html');
      if(revit){
        revit.classList.add('pmbRevitDocsFooter');
        revit.textContent='Documentation Plugin Revit';
        const col=revit.closest('.footerCol');
        if(col&&!col.querySelector('.pmbIfcDocsFooter')){
          const ifc=document.createElement('a');
          ifc.href='docs-app.html';
          ifc.className='pmbIfcDocsFooter';
          ifc.textContent='Documentation Application IFC';
          revit.insertAdjacentElement('afterend',ifc);
        }
        if(col&&!col.querySelector('.pmbEnterpriseFooter')){
          const anchor=col.querySelector('.pmbIfcDocsFooter')||revit;
          const it=document.createElement('a');
          it.href='architecture.html';
          it.className='pmbEnterpriseFooter';
          it.textContent='Architecture & DSI';
          anchor.insertAdjacentElement('afterend',it);
        }
      }
    }
  }

  function fixProductDocumentationLinks(){
    const revitDoc=document.querySelector('#revit .actions a[href*="docs"]');
    if(revitDoc)revitDoc.href='docs.html';
    const ifcDoc=document.querySelector('#ifc .actions a[href*="docs"]');
    if(ifcDoc)ifcDoc.href='docs-app.html';

    if(path==='downloads.html'){
      const revitCard=document.querySelector('#revit');
      const ifcCard=document.querySelector('#ifc');
      const revitLink=revitCard&&[...revitCard.querySelectorAll('a')].find(a=>/guide|documentation/i.test(a.textContent));
      const ifcLink=ifcCard&&[...ifcCard.querySelectorAll('a')].find(a=>/documentation/i.test(a.textContent));
      if(revitLink){revitLink.href='docs.html#installation';revitLink.textContent="Guide d'installation";}
      if(ifcLink){ifcLink.href='docs-app.html';ifcLink.textContent='Documentation IFC';}
    }

    const ops=document.querySelector('.productOps .opsGrid');
    if(ops){
      const generic=[...ops.querySelectorAll('.opsCard')].find(a=>(a.getAttribute('href')||'').replace(/^\.\//,'')==='docs.html');
      if(generic){
        generic.classList.add('pmbOpsRevitDocs');
        const h=generic.querySelector('h3'),p=generic.querySelector('p'),b=generic.querySelector('b');
        if(h)h.textContent='Documentation Plugin Revit';
        if(p)p.textContent='Installation, modules Revit, workflows, exports et reporting.';
        if(b)b.textContent='Ouvrir la doc Revit →';
        if(!ops.querySelector('.pmbOpsIfcDocs')){
          const ifc=generic.cloneNode(true);
          ifc.href='docs-app.html';
          ifc.classList.remove('pmbOpsRevitDocs');
          ifc.classList.add('pmbOpsIfcDocs');
          const ih=ifc.querySelector('h3'),ip=ifc.querySelector('p'),ib=ifc.querySelector('b');
          if(ih)ih.textContent='Documentation Application IFC';
          if(ip)ip.textContent='Viewer, BCF, contrôles qualité, données, historique et reporting.';
          if(ib)ib.textContent='Ouvrir la doc IFC →';
          generic.insertAdjacentElement('afterend',ifc);
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
    fixProductDocumentationLinks();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  let tries=0;
  const timer=setInterval(()=>{run();if(++tries>24)clearInterval(timer)},250);
})();