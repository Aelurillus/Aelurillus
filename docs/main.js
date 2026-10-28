/* Motion stays on transforms/opacity. Native scroll, scoped loops, no layout work on pointermove. */
if(window.gsap && window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 const motionButton=document.querySelector('.motion-control');
 const systemReduce=matchMedia('(prefers-reduced-motion: reduce)');
 let override=null;try{override=localStorage.getItem('itzming-motion-v4');}catch{}
 let full=override==='full'||(override===null&&!systemReduce.matches);
 function setupMotion(){
 mm.revert();document.documentElement.dataset.motion=full?'full':'reduce';
 motionButton.querySelector('span').textContent=full?'Ⅱ':'▶';motionButton.setAttribute('aria-label',full?'暫停動畫':'開啟動畫');motionButton.setAttribute('aria-pressed',String(full));
 mm.add({motion:full?'all':'not all',fine:'(hover: hover) and (pointer: fine)',mobile:'(max-width: 600px)'},ctx=>{
  if(!ctx.conditions.motion)return;
  const {fine,mobile}=ctx.conditions,cleanups=[],loops=[];
  const on=(el,event,fn)=>{el.addEventListener(event,fn);cleanups.push(()=>el.removeEventListener(event,fn));};
  const loop=(animation,trigger)=>{const item={animation,active:false};loops.push(item);const st=ScrollTrigger.create({trigger,start:'top bottom',end:'bottom top',onToggle:s=>{item.active=s.isActive;animation.paused(!s.isActive||document.hidden);}});item.active=st.isActive;animation.paused(!item.active||document.hidden);};
  const letters=gsap.utils.toArray('.name-char');
  const hit=gsap.timeline({paused:true,repeat:-1,repeatDelay:1.6});
  // Four-beat phrase: two short hits, a roll, then a deliberate rest.
  hit.to(letters,{scaleY:1.12,scaleX:.94,yPercent:-5,rotation:i=>i%2?1.5:-1.5,duration:.12,stagger:.035,ease:'power4.out'})
   .to(letters,{scaleY:1,scaleX:1,yPercent:0,rotation:0,duration:.3,stagger:.035,ease:'back.out(2)'},.15)
   .to(letters,{scaleY:.9,scaleX:1.04,duration:.1,stagger:{each:.025,from:'end'},ease:'power4.in'},.65)
   .to(letters,{scaleY:1,scaleX:1,duration:.28,stagger:{each:.025,from:'end'},ease:'back.out(2.4)'},.78)
   .to(letters,{yPercent:i=>i%2?9:-12,rotation:i=>i%2?3:-3,duration:.16,stagger:.055,ease:'power3.out'},1.3)
   .to(letters,{yPercent:0,rotation:0,duration:.34,stagger:.055,ease:'back.out(1.7)'},1.5)
   .fromTo('.title-line i',{scaleX:0},{scaleX:1,duration:.32,ease:'power4.out'},.1)
   .to('.title-line i',{scaleX:0,transformOrigin:'right',duration:.25,ease:'power3.in'},.65);
  loop(hit,'.hero-title');
  const intro=gsap.timeline({defaults:{ease:'power4.out'}});
  intro.from('.name-ink',{yPercent:i=>i%2?-130:130,rotation:i=>i%2?14:-14,scaleY:.45,opacity:0,stagger:.055,duration:.7})
   .from('.title-line',{scaleX:0,transformOrigin:'left',ease:'power4.out',duration:.35},.38)
   .from('.hero-bottom',{y:38,opacity:0,duration:.45},.6)
   .from('.rhythm i',{scaleY:0,stagger:.016,transformOrigin:'bottom',duration:.35},.65);
  hit.delay(1.35);
  gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
  gsap.to('.name-mask',{yPercent:i=>i%2?-48:42,xPercent:i=>(i-3)*5,rotation:i=>i%2?5:-5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.18}});
  const tickBeat=gsap.timeline({paused:true,repeat:-1,repeatDelay:.6});
  tickBeat.to('.rhythm i',{scaleY:i=>i%3?.28:1.4,duration:.12,stagger:.018,ease:'power4.out'})
   .to('.rhythm i',{scaleY:1,duration:.28,stagger:.018,ease:'power3.out'},.18)
   .to('.rhythm i',{scaleY:i=>i%2?.2:1.3,duration:.1,stagger:{each:.018,from:'end'},ease:'power4.out'},.75)
   .to('.rhythm i',{scaleY:1,duration:.25,stagger:{each:.018,from:'end'},ease:'power3.out'},.9);
  loop(tickBeat,'.rhythm');
  const arrowBeat=gsap.timeline({paused:true,repeat:-1,repeatDelay:.9});
  arrowBeat.to('.scroll-glyph',{x:5,y:5,duration:.12,ease:'power4.out'}).to('.scroll-glyph',{x:0,y:0,duration:.3,ease:'power3.out'})
   .fromTo('.scroll-dash',{scaleX:.2},{scaleX:1,duration:.28,ease:'power4.out'},0);
  loop(arrowBeat,'.hero-bottom');
  if(fine){
   const inks=gsap.utils.toArray('.name-ink'),moves=inks.map(el=>({x:gsap.quickTo(el,'x',{duration:.22,ease:'power3.out'}),y:gsap.quickTo(el,'y',{duration:.22,ease:'power3.out'}),r:gsap.quickTo(el,'rotation',{duration:.22,ease:'power3.out'})}));
   const title=document.querySelector('h1');let bounds;
   on(title,'pointerenter',()=>{bounds=title.getBoundingClientRect();});
   on(title,'pointermove',event=>{if(!bounds)return;const p=(event.clientX-bounds.left)/bounds.width*7; moves.forEach((move,i)=>{const strength=Math.max(0,1-Math.abs(p-i-.5)/1.8);move.y(-24*strength);move.x((i+.5-p)*8*strength);move.r((i+.5-p)*6*strength);});});
   on(title,'pointerleave',()=>moves.forEach(move=>{move.x(0);move.y(0);move.r(0);}));
  }
  const phrases=gsap.utils.toArray('.phrase'),phrasesTL=gsap.timeline({repeat:-1,paused:true});
  phrases.forEach((p,i)=>{phrasesTL.to({},{duration:1.6}).to(p,{yPercent:-110,opacity:0,duration:.24,ease:'power4.inOut'}).fromTo(phrases[(i+1)%phrases.length],{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.24,ease:'power4.inOut',immediateRender:false},'<');});
  loop(phrasesTL,'.hero-bottom');
  gsap.from('.heading-char',{yPercent:100,opacity:0,stagger:.045,duration:.45,ease:'back.out(1.6)',scrollTrigger:{trigger:'.section-heading',start:'top 90%',once:true}});
  gsap.from('.board',{scale:.94,rotation:-1.5,duration:.6,ease:'power4.out',scrollTrigger:{trigger:'.board',start:'top 95%',once:true}});
  gsap.utils.toArray('.card').forEach((card,i)=>{
   gsap.timeline({scrollTrigger:{trigger:card,start:'top 95%',once:true},delay:(i%(mobile?2:3))*.11})
    .from(card,{xPercent:i%2?18:-18,y:mobile?45:80,rotation:i%2?5:-5,scale:.88,opacity:0,duration:.62,ease:'back.out(1.35)'})
    .from(card.querySelector('.card-rule'),{scaleX:0,transformOrigin:'left',ease:'none',duration:.28},.12)
    .from(card.querySelectorAll('h3,.note-title'),{x:22,scaleX:.85,opacity:0,stagger:.08,duration:.32,ease:'power4.out'},.18)
    .from(card.querySelector('.arrow,.small-star'),{rotation:-135,scale:0,opacity:0,duration:.4,ease:'back.out(2)'},.28);
   if(fine && card.matches('a')){
    const title=card.querySelector('h3'),arrow=card.querySelector('.arrow');
    const xTo=gsap.quickTo(title,'x',{duration:.4,ease:'power3.out'}),yTo=gsap.quickTo(title,'y',{duration:.4,ease:'power3.out'});
    let rect;
    const enter=()=>{rect=card.getBoundingClientRect();gsap.fromTo(card.querySelector('.card-rule'),{scaleX:.15},{scaleX:1,duration:.55,ease:'power2.out',overwrite:true});gsap.to(arrow,{x:7,y:-7,rotation:45,duration:.18,overwrite:true});};
    const leave=()=>{xTo(0);yTo(0);gsap.to(arrow,{x:0,y:0,rotation:0,duration:.4,overwrite:true});};
    on(card,'pointerenter',enter);on(card,'pointermove',e=>{if(!rect)return;xTo(((e.clientX-rect.left)/rect.width-.5)*12);yTo(((e.clientY-rect.top)/rect.height-.5)*10);});on(card,'pointerleave',leave);on(card,'focus',enter);on(card,'blur',leave);
   }
  });
  loop(gsap.to('.orbit',{rotation:360,duration:9,repeat:-1,ease:'none',paused:true}),'.note');
  loop(gsap.to('.small-star',{rotation:180,duration:3,repeat:-1,ease:'none',paused:true}),'.note');
  gsap.utils.toArray('.outro-line,.end-line').forEach(el=>gsap.from(el,{scaleX:0,transformOrigin:'left',ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 65%',scrub:.4}}));
  gsap.from('.outro-char',{yPercent:110,rotation:12,scaleY:.6,opacity:0,stagger:.065,duration:.6,ease:'back.out(1.7)',scrollTrigger:{trigger:'.outro',start:'top 85%',once:true}});
  gsap.to('.outro-star',{rotation:140,ease:'none',scrollTrigger:{trigger:'.outro',start:'top bottom',end:'bottom bottom',scrub:.6}});
  loop(gsap.to('.outro-star-inner',{rotation:360,repeat:-1,duration:22,ease:'none',paused:true}),'.outro');
  on(document,'visibilitychange',()=>loops.forEach(({animation,active})=>animation.paused(document.hidden||!active)));
  return()=>cleanups.forEach(fn=>fn());
 });
 }
 setupMotion();
 motionButton.addEventListener('click',()=>{full=!full;override=full?'full':'reduce';try{localStorage.setItem('itzming-motion-v4',override);}catch{}setupMotion();ScrollTrigger.refresh();});
 systemReduce.addEventListener('change',event=>{if(override!==null)return;full=!event.matches;setupMotion();ScrollTrigger.refresh();});

 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}


