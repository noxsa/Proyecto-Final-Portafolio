// Año
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
document.getElementById('menuBtn').addEventListener('click',()=>{
  const mm = document.getElementById('mobileMenu');
  mm.classList.toggle('hidden');
});

// GSAP
if (window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section, .project, .card, .skill').forEach(el=>{
    gsap.from(el,{
      y: 24, opacity: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: {trigger: el, start: 'top 85%'}
    });
  });
}

// Starfield canvas
(function(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w, h, stars=[];
  function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
  window.addEventListener('resize', resize); resize();
  const COUNT = 180;
  function init(){
    stars = Array.from({length: COUNT}).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*1+0.2,
      r: Math.random()*1.2+0.2,
      vx: (Math.random()-.5)*.2,
      vy: (Math.random()-.5)*.2
    }));
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      s.x+=s.vx; s.y+=s.vy;
      if(s.x<0) s.x=w; if(s.x>w) s.x=0; if(s.y<0) s.y=h; if(s.y>h) s.y=0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,229,255,'+(0.4*s.z)+')';
      ctx.shadowColor = 'rgba(0,229,255,.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  init(); step();
})();

// Modal de proyectos
(function(){
  const modal = document.getElementById('projectModal');
  if(!modal) return;
  const backdrop = modal.querySelector('.modal-backdrop');
  const card = modal.querySelector('.modal-card');
  const img = document.getElementById('modalImg');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');

  function openModal(data){
    title.textContent = data.title || '';
    desc.textContent = data.desc || '';
    if(data.img){
      img.src = data.img;
      img.style.display = '';
    } else {
      img.removeAttribute('src');
      img.style.display = 'none';
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if(window.gsap){
      gsap.set(card,{y:24, scale:0.98, opacity:0});
      gsap.set(backdrop,{opacity:0});
      gsap.to(backdrop,{opacity:1, duration:.25, ease:'power2.out'});
      gsap.to(card,{y:0, scale:1, opacity:1, duration:.35, ease:'power3.out', delay:.05});
    }
  }

  function closeModal(){
    if(window.gsap){
      const tl = gsap.timeline({onComplete:()=>{
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
        img.removeAttribute('src');
        img.style.display = '';
      }});
      tl.to(card,{y:16, scale:0.98, opacity:0, duration:.25, ease:'power2.in'})
        .to(backdrop,{opacity:0, duration:.2, ease:'power2.in'}, '<');
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }
  }

  modal.addEventListener('click', (e)=>{
    if(e.target.closest('[data-close]')) closeModal();
  });
  window.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });

  document.querySelectorAll('.project').forEach(cardEl=>{
    cardEl.addEventListener('click', (e)=>{
      e.preventDefault();
      const d = cardEl.dataset;
      // Si no hay data-img, intenta tomar la imagen de la propia tarjeta
      let imgSrc = d.img;
      if(!imgSrc){
        const tagImg = cardEl.querySelector('img');
        const raw = tagImg ? tagImg.getAttribute('src') : '';
        if(raw && raw.trim().length > 0) imgSrc = raw.trim();
      }
      openModal({title: d.title, desc: d.desc, img: imgSrc});
    });
  });
})();
