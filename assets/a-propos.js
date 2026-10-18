// ICA · page À propos interactive (le contenu est dans le HTML, ici seulement les comportements)
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function all(sel,root){return [].slice.call((root||document).querySelectorAll(sel));}

  // Polaroid qui suit la souris
  var pol=document.getElementById('abPolaroid');
  if(pol&&!reduce){
    var box=pol.parentElement;
    box.addEventListener('mousemove',function(e){
      var r=box.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      pol.style.transform='rotate('+(-4+x*6)+'deg) translate('+(x*8)+'px,'+(y*8)+'px)';
    });
    box.addEventListener('mouseleave',function(){pol.style.transform='';});
  }

  // Onglets (dossier du parcours et étapes de la méthode)
  function tabs(btns,onShow){
    function open(i){
      btns.forEach(function(b,j){
        var on=i===j;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;
        document.getElementById(b.getAttribute('aria-controls')).hidden=!on;
      });
      if(onShow)onShow(i);
    }
    btns.forEach(function(b,i){
      b.addEventListener('click',function(){open(i);});
      b.addEventListener('keydown',function(e){
        var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
        if(d){var n=(i+d+btns.length)%btns.length;open(n);btns[n].focus();}
      });
    });
    return open;
  }
  tabs(all('.ab-ftab'));

  var steps=all('.ab-step'),cur=0;
  var prev=document.getElementById('abPrev'),next=document.getElementById('abNext'),bar=document.getElementById('abBar');
  if(steps.length&&prev&&next){
    var show=tabs(steps,function(i){
      cur=i;prev.disabled=i===0;next.disabled=i===steps.length-1;
      bar.style.width=((i+1)/steps.length*100)+'%';
    });
    prev.addEventListener('click',function(){if(cur>0)show(cur-1);});
    next.addEventListener('click',function(){if(cur<steps.length-1)show(cur+1);});
    show(0);
  }

  // Cartes à retourner (langues et promesses)
  all('.ab-tag,.ab-pr').forEach(function(b){
    b.addEventListener('click',function(){
      var on=b.getAttribute('aria-pressed')!=='true';
      // une seule carte retournée à la fois : les autres reviennent à leur place
      all('.ab-tag,.ab-pr',b.parentNode).forEach(function(x){if(x!==b)x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed',on);
    });
  });

  // Filtres des outils
  var chips=all('.ab-chip'),tools=all('#abTools .sk');
  chips.forEach(function(c){
    c.addEventListener('click',function(){
      var k=c.dataset.cat;
      chips.forEach(function(x){x.setAttribute('aria-pressed',x===c);});
      tools.forEach(function(s){s.classList.toggle('dim',k!=='all'&&s.dataset.cat!==k);});
    });
  });
})();
