// ICA · menu mobile, bulle de contact, visionneuses
(function(){
  var body=document.body;
  var tabs=document.getElementById('navTabs');
  var overlay=document.getElementById('navOverlay');
  var burger=document.getElementById('navBurger');
  var panel=document.getElementById('bubblePanel');
  var bubbleBtn=document.getElementById('bubbleBtn');

  function setMenu(open){
    tabs.classList.toggle('open',open);
    overlay.classList.toggle('open',open);
    body.classList.toggle('menu-open',open);
    burger.setAttribute('aria-expanded',open);
  }
  function setBubble(open){
    panel.hidden=!open;
    bubbleBtn.setAttribute('aria-expanded',open);
  }

  // Visionneuses (image seule ou magazine)
  var lb=document.getElementById('lb');
  var mag=document.getElementById('mag-lb');
  var pages=[],cur=0;
  function showPage(){
    var img=document.getElementById('mag-img');
    img.src=pages[cur];
    document.getElementById('mag-cur').textContent=cur+1;
    document.getElementById('mag-prev').disabled=cur===0;
    document.getElementById('mag-next').disabled=cur===pages.length-1;
  }
  function closeAll(){
    if(lb)lb.classList.remove('open');
    if(mag)mag.classList.remove('open');
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.closest('#navBurger')){setMenu(true);return;}
    if(t.closest('#navClose')||t===overlay){setMenu(false);return;}
    if(t.closest('#bubbleBtn')){setBubble(panel.hidden);return;}
    if(t.closest('#bubbleClose')){setBubble(false);return;}
    if(t.closest('.nav-tabs a'))setMenu(false);
    if(!t.closest('#bubble'))setBubble(false);

    var one=t.closest('[data-lb]');
    if(one&&lb){
      document.getElementById('lb-img').src=one.getAttribute('data-lb');
      document.getElementById('lb-img').alt=one.getAttribute('data-alt')||'';
      document.getElementById('lb-caption').textContent=one.getAttribute('data-cap')||'';
      lb.classList.add('open');return;
    }
    var m=t.closest('[data-mag]');
    if(m&&mag){pages=m.getAttribute('data-mag').split(',');cur=0;showPage();mag.classList.add('open');return;}
    if(t.closest('#mag-prev')&&cur>0){cur--;showPage();return;}
    if(t.closest('#mag-next')&&cur<pages.length-1){cur++;showPage();return;}
    if(t.closest('.lb-close')||t===lb||t===mag)closeAll();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){setMenu(false);setBubble(false);closeAll();}
    if(mag&&mag.classList.contains('open')){
      if(e.key==='ArrowLeft'&&cur>0){cur--;showPage();}
      if(e.key==='ArrowRight'&&cur<pages.length-1){cur++;showPage();}
    }
  });
})();
