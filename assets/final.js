// Version finale · carrousel de projets (un à la fois, flèches, points, clavier, glisser au doigt)
(function(){
  document.querySelectorAll('[data-carousel]').forEach(function(car){
    var sec=car.closest('section');
    var slides=[].slice.call(car.querySelectorAll('.car-slide'));
    if(slides.length<2)return;
    var prev=sec.querySelector('[data-car-prev]'),next=sec.querySelector('[data-car-next]');
    var count=sec.querySelector('.car-count b'),dots=[].slice.call(sec.querySelectorAll('[data-car-dot]'));
    var cur=0;
    function show(i){
      cur=(i+slides.length)%slides.length;
      slides.forEach(function(s,k){s.hidden=k!==cur;});
      dots.forEach(function(d,k){if(k===cur)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});
      if(count)count.textContent=cur+1;
    }
    prev.addEventListener('click',function(){show(cur-1);});
    next.addEventListener('click',function(){show(cur+1);});
    dots.forEach(function(d,k){d.addEventListener('click',function(){show(k);});});
    car.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1);});
    var x0=null;
    car.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    car.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));x0=null;});
  });
})();

// Dossiers du haut de page : un toucher ouvre le dossier (mobile), un clic dehors le referme
(function(){
  var pfs=[].slice.call(document.querySelectorAll('.pf'));
  pfs.forEach(function(pf){
    pf.addEventListener('click',function(e){
      if(e.target.closest('a')&&pf.classList.contains('open'))return;
      if(e.target.closest('a')&&window.matchMedia('(hover:hover)').matches)return;
      e.preventDefault();
      var o=!pf.classList.contains('open');
      pfs.forEach(function(x){x.classList.remove('open');});
      pf.classList.toggle('open',o);
    });
    pf.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target===pf){pf.classList.toggle('open');}});
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.pf'))pfs.forEach(function(x){x.classList.remove('open');});});
})();

// Heures de Paris, Lisbonne, Londres et Madrid
(function(){
  var els=[].slice.call(document.querySelectorAll('[data-tz]'));
  if(!els.length)return;
  var loc=document.documentElement.lang==='en'?'en-GB':'fr-FR';
  function tick(){var d=new Date();els.forEach(function(e){try{e.textContent=new Intl.DateTimeFormat(loc,{hour:'2-digit',minute:'2-digit',timeZone:e.dataset.tz}).format(d);}catch(x){}});}
  tick();setInterval(tick,15000);
})();

// Processus : les lignes du cahier tombent pile sous le texte
(function(){
  var secs=[].slice.call(document.querySelectorAll('.band .v1 .process-section'));
  function align(){
    secs.forEach(function(s){
      var nb=s.querySelector('.process-nb'),ul=s.querySelector('.proc-grid ul');
      if(!nb||!ul)return;
      var off=(ul.getBoundingClientRect().top-nb.getBoundingClientRect().top)%30-6;
      nb.style.backgroundPosition='0 '+off+'px';
    });
  }
  if(secs.length){align();window.addEventListener('resize',align);window.addEventListener('load',align);}
})();

// FAQ : une seule question ouverte à la fois (pour les navigateurs qui ignorent details[name])
(function(){
  [].slice.call(document.querySelectorAll('details[name]')).forEach(function(d){
    d.addEventListener('toggle',function(){
      if(!d.open)return;
      [].slice.call(document.querySelectorAll('details[name="'+d.getAttribute('name')+'"]')).forEach(function(x){if(x!==d)x.open=false;});
    });
  });
})();

// À propos : cartes à piocher (la carte du dessus passe sous le paquet)
(function(){
  var d=document.querySelector('.deck');if(!d)return;
  function draw(){var f=d.firstElementChild;f.style.transform='translate(-40px,-30px) rotate(-14deg)';setTimeout(function(){f.style.transform='';d.appendChild(f);},260);}
  d.addEventListener('click',draw);
  d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();draw();}});
})();
