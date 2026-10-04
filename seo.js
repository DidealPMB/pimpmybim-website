(()=>{
  if(window.__pmbSeoLoaded)return;
  window.__pmbSeoLoaded=true;
  const ORIGIN='https://pimpmybim.fr';
  const path=location.pathname||'/';
  const cleanPath=path==='/index.html'?'/':path;
  const canonical=ORIGIN+cleanPath;
  const title=(document.title||'Pimp My BIM').trim();
  const description=(document.querySelector('meta[name="description"]')?.content||'Pimp My BIM — plugin Revit et plateforme IFC pour automatiser la production BIM, contrôler les données et fiabiliser les livrables IFC.').trim();
  const isBlogArticle=cleanPath.startsWith('/blog/')&&cleanPath!='/blog/'&&cleanPath.endsWith('.html');
  function meta(selector,attrs){let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));document.head.appendChild(el)}return el}
  function link(selector,attrs){let el=document.head.querySelector(selector);if(!el){el=document.createElement('link');Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));document.head.appendChild(el)}return el}
  link('link[rel="canonical"]',{rel:'canonical',href:canonical}).setAttribute('href',canonical);
  meta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  const ogType=isBlogArticle?'article':'website';
  meta('meta[property="og:type"]',{property:'og:type',content:ogType}).setAttribute('content',ogType);
  meta('meta[property="og:site_name"]',{property:'og:site_name',content:'Pimp My BIM'});
  meta('meta[property="og:title"]',{property:'og:title',content:title}).setAttribute('content',title);
  meta('meta[property="og:description"]',{property:'og:description',content:description}).setAttribute('content',description);
  meta('meta[property="og:url"]',{property:'og:url',content:canonical}).setAttribute('content',canonical);
  meta('meta[property="og:image"]',{property:'og:image',content:ORIGIN+'/assets/Logo_avec%20transparence.png'});
  meta('meta[property="og:locale"]',{property:'og:locale',content:'fr_FR'});
  meta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  meta('meta[name="twitter:title"]',{name:'twitter:title',content:title}).setAttribute('content',title);
  meta('meta[name="twitter:description"]',{name:'twitter:description',content:description}).setAttribute('content',description);
  meta('meta[name="twitter:image"]',{name:'twitter:image',content:ORIGIN+'/assets/Logo_avec%20transparence.png'});
  if(!document.head.querySelector('script[type="application/ld+json"]')){
    const data=isBlogArticle?{
      '@context':'https://schema.org','@type':'Article',headline:(document.querySelector('h1')?.textContent||title).trim(),description,mainEntityOfPage:canonical,
      author:{'@type':'Person',name:'Virgile Prezeau'},publisher:{'@type':'Organization',name:'Pimp My BIM',url:ORIGIN}
    }:cleanPath==='/'?{
      '@context':'https://schema.org','@graph':[
        {'@type':'WebSite',name:'Pimp My BIM',url:ORIGIN+'/',description},
        {'@type':'SoftwareApplication',name:'Pimp My BIM',applicationCategory:'BusinessApplication',operatingSystem:'Windows / Web',url:ORIGIN+'/',description,offers:{'@type':'Offer',price:'0',priceCurrency:'EUR'}}
      ]
    }:{'@context':'https://schema.org','@type':'WebPage',name:title,url:canonical,description,isPartOf:{'@type':'WebSite',name:'Pimp My BIM',url:ORIGIN+'/'}};
    const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
  }
})();
