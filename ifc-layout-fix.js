(()=>{
  function applyIfcLayout(){
    const ifc=document.querySelector('#ifc');
    if(!ifc)return;
    const block=ifc.querySelector('.productBlock');
    const copy=ifc.querySelector('.copy');
    const demo=ifc.querySelector('.ifcDemo');
    if(!block||!copy||!demo)return;

    // Same DOM order as the Revit section: copy first, video second.
    if(copy.nextElementSibling!==demo) block.appendChild(demo);

    demo.classList.remove('reveal');
    demo.style.opacity='1';
    demo.style.visibility='visible';
    demo.style.transform='translateX(-50%)';

    const video=demo.querySelector('video');
    if(video){
      video.muted=true;
      video.loop=true;
      video.playsInline=true;
      const p=video.play();
      if(p&&typeof p.catch==='function')p.catch(()=>{});
    }

    if(!document.getElementById('pmb-ifc-layout-match')){
      const style=document.createElement('style');
      style.id='pmb-ifc-layout-match';
      style.textContent=`
        #ifc .productBlock{grid-template-columns:1fr!important;gap:42px!important}
        #ifc .copy{max-width:900px}
        #ifc .copy h2{max-width:760px}
        #ifc .featureList{max-width:820px}
        #ifc .ifcDemo{position:relative;left:50%;width:min(1480px,calc(100vw - 32px));max-width:none;margin:14px 0 0;transform:translateX(-50%)!important;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:#fff;box-shadow:0 28px 80px rgba(41,55,25,.14);aspect-ratio:16/9;opacity:1!important;visibility:visible!important}
        #ifc .ifcDemo video{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:#fff;transform:none!important}
        @media(min-width:1050px){
          #ifc .copy{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(380px,.95fr);column-gap:64px;align-items:start;max-width:none}
          #ifc .copy>.kicker,#ifc .copy>h2,#ifc .copy>p{grid-column:1}
          #ifc .copy>.featureList{grid-column:2;grid-row:1 / span 4;margin-top:34px;width:100%}
          #ifc .copy>.actions{grid-column:1;margin-top:28px}
        }
        @media(max-width:1049px){#ifc .copy{max-width:820px}#ifc .ifcDemo{width:min(1200px,calc(100vw - 24px));border-radius:5px}}
        @media(max-width:700px){#ifc .productBlock{gap:28px!important}#ifc .ifcDemo{width:calc(100vw - 16px);border-radius:3px;aspect-ratio:16/9}}
      `;
      document.head.appendChild(style);
    }
  }

  function init(){
    applyIfcLayout();
    // site-shell injects the IFC demo asynchronously, so retry briefly.
    let tries=0;
    const timer=setInterval(()=>{
      applyIfcLayout();
      tries++;
      if(document.querySelector('#ifc .ifcDemo')||tries>20)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();