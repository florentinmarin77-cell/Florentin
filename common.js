// common.js - gestioneaza meniul, inchidere la click si tooltips pe mobil

(function(){
  const hamburger = document.getElementById('hamburger');
  const menuWrap = document.getElementById('menu-wrap');
  const menu = document.getElementById('menu');

  function openMenu(){
    menuWrap.classList.add('show');
    menuWrap.classList.remove('hidden');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
    menuWrap.classList.add('show');
    menuWrap.setAttribute('aria-hidden','false');
    // small delay to ensure transition
  }
  function closeMenu(){
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    // start hide animation
    menuWrap.classList.remove('show');
    // after transition end hide completely
    setTimeout(()=> menuWrap.classList.add('hidden'), 250);
    menuWrap.setAttribute('aria-hidden','true');
    removeMobileTooltip();
  }

  // toggle
  hamburger.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(menuWrap.classList.contains('show')) closeMenu(); else openMenu();
  });

  // close when clicking outside
  document.addEventListener('click', (e)=>{
    if(!menuWrap.contains(e.target) && !hamburger.contains(e.target)){
      if(menuWrap.classList.contains('show')) closeMenu();
    }
  });

  // close on link click and allow navigation
  const links = menu.querySelectorAll('a');
  links.forEach(a=>{
    a.addEventListener('click', (ev)=>{
      // ensure menu closes before navigation; let browser navigate normally
      closeMenu();
      // no preventDefault -> navigation proceeds
    });
  });

  /* ========== MOBILE: long-press tooltip ========== */
  let touchTimer = null;
  let mobileTipEl = null;

  function removeMobileTooltip(){
    if(mobileTipEl && mobileTipEl.parentNode) mobileTipEl.parentNode.removeChild(mobileTipEl);
    mobileTipEl = null;
    if(touchTimer){ clearTimeout(touchTimer); touchTimer = null; }
  }

  function showMobileTooltip(target){
    removeMobileTooltip();
    const desc = target.getAttribute('data-desc');
    if(!desc) return;
    const tip = document.createElement('div');
    tip.className = 'mobile-tooltip';
    tip.textContent = desc;
    // position under target
    const rect = target.getBoundingClientRect();
    tip.style.position = 'absolute';
    tip.style.left = (rect.left) + 'px';
    const top = rect.bottom + window.scrollY + 8;
    tip.style.top = top + 'px';
    tip.style.minWidth = '160px';
    tip.style.maxWidth = Math.min(window.innerWidth*0.8, 480) + 'px';
    tip.style.background = '#fff';
    tip.style.color = '#000';
    tip.style.border = '1px solid #888';
    tip.style.padding = '8px 10px';
    tip.style.fontSize = '14px';
    tip.style.borderRadius = '6px';
    tip.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    tip.style.zIndex = 3000;
    document.body.appendChild(tip);
    mobileTipEl = tip;
  }

  // handle long press on each link (mobile)
  links.forEach(link=>{
    link.addEventListener('touchstart', (ev)=>{
      touchTimer = setTimeout(()=> {
        // show tooltip (but do not navigate)
        showMobileTooltip(link);
      }, 520); // long press 520ms
    }, {passive:true});
    link.addEventListener('touchend', (ev)=>{
      if(touchTimer) { clearTimeout(touchTimer); touchTimer = null; }
      // if tooltip is visible, touching again should remove it
      if(mobileTipEl){
        removeMobileTooltip();
      }
    }, {passive:true});
    link.addEventListener('touchmove', ()=>{
      if(touchTimer) { clearTimeout(touchTimer); touchTimer = null; }
      removeMobileTooltip();
    }, {passive:true});
  });

  // ensure tooltip cleans on orientation change / resize
  window.addEventListener('orientationchange', removeMobileTooltip);
  window.addEventListener('resize', removeMobileTooltip);

})();
