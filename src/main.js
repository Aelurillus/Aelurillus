/* Motion stays on transforms/opacity. Native scroll, scoped loops, no layout work on pointermove. */
if(window.gsap && window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 const motionButton=document.querySelector('.motion-toggle');
 const systemReduce=matchMedia('(prefers-reduced-motion: reduce)');
 let override=null;try{override=localStorage.getItem('itzming-motion');}catch{}
 let full=override ? override==='full' : !systemReduce.matches;
 function setupMotion(){
 mm.revert();document.documentElement.dataset.motion=full?'full':'reduce';
 motionButton.textContent=full?'動效：完整':'開啟動效';motionButton.setAttribute('aria-pressed',String(full));
 mm.add({motion:full?'all':'not all',fine:'(hover: hover) and (pointer: fine)',mobile:'(max-width: 600px)'},ctx=>{
  if(!ctx.conditions.motion)return;
  const {fine,mobile}=ctx.conditions,cleanups=[],loops=[];
  const on=(el,event,fn)=>{el.addEventListener(event,fn);cleanups.push(()=>el.removeEventListener(event,fn));};
  const loop=(animation,trigger)=>{const item={animation,active:false};loops.push(item);ScrollTrigger.create({trigger,start:'top bottom',end:'bottom top',onToggle:s=>{item.active=s.isActive;animation.paused(!s.isActive||document.hidden);}});};
  gsap.timeline({defaults:{ease:'power3.out'}})
   .from('.top',{y:-18,opacity:0,duration:.65})
   .from('.name-char',{yPercent:110,rotation:4,stagger:.065,duration:.95},.12)
   .from('.title-line',{scaleX:0,transformOrigin:'left',ease:'none',duration:.9},.35)
   .from('.hero-bottom',{y:22,opacity:0,duration:.7},.65)
   .from('.rhythm i',{scaleY:0,stagger:.025,transformOrigin:'bottom',duration:.6},.6);
  gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.25}});
  gsap.to('.name-mask',{yPercent:i=>i%2?-15:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});
  gsap.to('.hero-title',{xPercent:mobile?0:2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}});
  loop(gsap.to('.dot',{scale:1.65,opacity:.4,duration:1.1,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),'.hero');
  loop(gsap.to('.scroll-arrow span',{y:6,duration:.85,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),'.hero');
  const phrases=gsap.utils.toArray('.phrase'),phrasesTL=gsap.timeline({repeat:-1,paused:true});
  phrases.forEach((p,i)=>{phrasesTL.to({},{duration:2.6}).to(p,{yPercent:-110,opacity:0,duration:.55,ease:'power2.inOut'}).fromTo(phrases[(i+1)%phrases.length],{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.55,ease:'power2.inOut',immediateRender:false},'<');});
  loop(phrasesTL,'.hero-bottom');
  loop(gsap.to('.rhythm i',{scaleY:i=>.25+(i%5)*.15,repeat:-1,yoyo:true,stagger:{each:.055,repeat:-1,yoyo:true},duration:1.1,ease:'sine.inOut',paused:true}),'.rhythm');
  gsap.to('.rhythm',{xPercent:-2,ease:'none',scrollTrigger:{trigger:'.rhythm',start:'top bottom',end:'bottom top',scrub:.5}});
  gsap.from('.heading-char',{yPercent:100,opacity:0,stagger:.075,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.section-heading',start:'top 90%',once:true}});
  gsap.from('.board',{y:35,duration:.9,ease:'power2.out',scrollTrigger:{trigger:'.board',start:'top 95%',once:true}});
  gsap.utils.toArray('.card').forEach((card,i)=>{
   gsap.timeline({scrollTrigger:{trigger:card,start:'top 95%',once:true},delay:(i%(mobile?2:3))*.09})
    .from(card,{y:mobile?24:45,opacity:0,duration:.7,ease:'power3.out'})
    .from(card.querySelector('.card-rule'),{scaleX:0,transformOrigin:'left',ease:'none',duration:.65},.12)
    .from(card.querySelectorAll('h3,.card-bottom,.note-title'),{y:16,opacity:0,stagger:.09,duration:.55,ease:'power2.out'},.18)
    .from(card.querySelector('.arrow,.small-star'),{rotation:-45,scale:0,opacity:0,duration:.5},.28);
   if(fine && card.matches('a')){
    const title=card.querySelector('h3'),arrow=card.querySelector('.arrow');
    const xTo=gsap.quickTo(title,'x',{duration:.4,ease:'power3.out'}),yTo=gsap.quickTo(title,'y',{duration:.4,ease:'power3.out'});
    let rect;
    const enter=()=>{rect=card.getBoundingClientRect();gsap.fromTo(card.querySelector('.card-rule'),{scaleX:.15},{scaleX:1,duration:.55,ease:'power2.out',overwrite:true});gsap.to(arrow,{x:4,y:-4,rotation:45,duration:.3,overwrite:true});};
    const leave=()=>{xTo(0);yTo(0);gsap.to(arrow,{x:0,y:0,rotation:0,duration:.4,overwrite:true});};
    on(card,'pointerenter',enter);on(card,'pointermove',e=>{if(!rect)return;xTo(((e.clientX-rect.left)/rect.width-.5)*12);yTo(((e.clientY-rect.top)/rect.height-.5)*10);});on(card,'pointerleave',leave);on(card,'focus',enter);on(card,'blur',leave);
   }
  });
  loop(gsap.to('.orbit',{rotation:360,duration:24,repeat:-1,ease:'none',paused:true}),'.note');
  loop(gsap.to('.small-star',{rotation:180,duration:8,repeat:-1,ease:'none',paused:true}),'.note');
  gsap.utils.toArray('.outro-line,.end-line').forEach(el=>gsap.from(el,{scaleX:0,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 65%',scrub:.4}}));
  gsap.from('.outro-char',{yPercent:90,rotation:5,opacity:0,stagger:.09,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.outro',start:'top 85%',once:true}});
  gsap.to('.outro-star',{rotation:140,ease:'none',scrollTrigger:{trigger:'.outro',start:'top bottom',end:'bottom bottom',scrub:.6}});
  loop(gsap.to('.outro-star-inner',{rotation:360,repeat:-1,duration:22,ease:'none',paused:true}),'.outro');
  on(document,'visibilitychange',()=>loops.forEach(({animation,active})=>animation.paused(document.hidden||!active)));
  return()=>cleanups.forEach(fn=>fn());
 });
 }
 setupMotion();
 motionButton.addEventListener('click',()=>{full=!full;override=full?'full':'reduce';try{localStorage.setItem('itzming-motion',override);}catch{}setupMotion();ScrollTrigger.refresh();});
 systemReduce.addEventListener('change',()=>{if(!override){full=!systemReduce.matches;setupMotion();ScrollTrigger.refresh();}});
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}

