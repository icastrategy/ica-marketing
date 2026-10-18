// ICA V2 · en-tête, menu, apparitions, phrase révélée, horloge, bulle, visionneuse
(function(){
  var doc=document.documentElement, body=document.body;
  doc.classList.add('js');
  window.addEventListener('load',function(){body.classList.add('loaded');});
  setTimeout(function(){body.classList.add('loaded');},900);

  // En-tête : fond au défilement, se cache en descendant
  var hd=document.querySelector('.hd'), lastY=0;
  function onScroll(){
    var y=window.scrollY;
    hd.classList.toggle('scrolled',y>30);
    hd.classList.toggle('hide',y>lastY&&y>400&&!body.classList.contains('menu-open'));
    lastY=y;
    var bubble=document.getElementById('bubble');
    if(bubble){var c=document.getElementById('contact');var away=false;
      if(c){var r=c.getBoundingClientRect();away=r.top<window.innerHeight*.6&&r.bottom>0;}
      bubble.classList.toggle('away',away);}
    words();
  }
  window.addEventListener('scroll',onScroll,{passive:true});

  // Menu plein écran
  var menu=document.getElementById('menu'), burger=document.getElementById('burger');
  function setMenu(open){
    menu.classList.toggle('open',open);body.classList.toggle('menu-open',open);
    burger.setAttribute('aria-expanded',open);menu.setAttribute('aria-hidden',!open);
    if(open){var f=menu.querySelector('a');if(f)setTimeout(function(){f.focus();},300);}else{burger.focus();}
  }
  burger.addEventListener('click',function(){setMenu(true);});
  document.getElementById('menuClose').addEventListener('click',function(){setMenu(false);});

  // Apparitions
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.rv,.img-rv').forEach(function(el){io.observe(el);});

  // Phrase révélée mot à mot
  var st=document.querySelector('.statement');
  var ws=[];
  if(st){
    st.innerHTML=st.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>';}).join(' ');
    ws=[].slice.call(st.querySelectorAll('.w'));
  }
  function words(){
    if(!ws.length)return;
    var r=st.getBoundingClientRect(), vh=window.innerHeight;
    var p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));
    var n=Math.round(p*ws.length);
    ws.forEach(function(w,i){w.classList.toggle('on',i<n);});
  }

  // Horloge de Paris
  var clk=document.querySelector('.clock');
  if(clk){
    var fmt=new Intl.DateTimeFormat(doc.lang==='en'?'en-GB':'fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'});
    var tick=function(){clk.textContent=fmt.format(new Date());};tick();setInterval(tick,15000);
  }

  // Bulle de contact
  var panel=document.getElementById('bubblePanel'), bb=document.getElementById('bubbleBtn');
  function setBubble(o){panel.hidden=!o;bb.setAttribute('aria-expanded',o);}
  bb.addEventListener('click',function(e){e.stopPropagation();setBubble(panel.hidden);});
  document.getElementById('bubbleClose').addEventListener('click',function(){setBubble(false);});
  document.addEventListener('click',function(e){if(!e.target.closest('#bubble'))setBubble(false);});

  // Visionneuse (image ou magazine)
  var lb=document.getElementById('lb'), pages=[], cur=0;
  function show(){
    var img=lb.querySelector('img');img.src=pages[cur];
    var nav=lb.querySelector('.lb-nav');nav.hidden=pages.length<2;
    lb.querySelector('.lb-count').textContent=(cur+1)+' / '+pages.length;
    lb.querySelector('[data-prev]').disabled=cur===0;
    lb.querySelector('[data-next]').disabled=cur===pages.length-1;
  }
  function closeLb(){if(lb){lb.classList.remove('open');body.style.overflow='';}}
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-view]');
    if(t&&lb){
      pages=t.getAttribute('data-view').split(',');cur=0;
      lb.querySelector('img').alt=t.getAttribute('data-alt')||'';
      lb.querySelector('figcaption').textContent=t.getAttribute('data-cap')||'';
      show();lb.classList.add('open');body.style.overflow='hidden';lb.querySelector('.lb-close').focus();return;
    }
    if(!lb||!lb.classList.contains('open'))return;
    if(e.target.closest('[data-prev]')&&cur>0){cur--;show();return;}
    if(e.target.closest('[data-next]')&&cur<pages.length-1){cur++;show();return;}
    if(e.target.closest('.lb-close')||e.target===lb)closeLb();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){setMenu&&menu.classList.contains('open')&&setMenu(false);setBubble(false);closeLb();}
    if(lb&&lb.classList.contains('open')){
      if(e.key==='ArrowLeft'&&cur>0){cur--;show();}
      if(e.key==='ArrowRight'&&cur<pages.length-1){cur++;show();}
    }
  });
  onScroll();
})();
