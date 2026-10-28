document.querySelector('#year').textContent=new Date().getFullYear();
if(window.gsap&&window.ScrollTrigger){
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
gsap.from('h1',{y:45,opacity:0,duration:.85,ease:'power2.out',delay:.1});
gsap.from('.title-line',{scaleX:0,duration:1,ease:'none',delay:.25});
gsap.from('.hero-bottom',{y:14,opacity:0,duration:.65,delay:.4,ease:'power2.out'});
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:.25}});
gsap.from('.rhythm i',{scaleY:.15,stagger:{each:.025,from:'start'},ease:'none',scrollTrigger:{trigger:'.rhythm',start:'top 95%',end:'bottom 40%',scrub:.35}});
gsap.from('.section-heading',{y:24,opacity:0,duration:.65,ease:'power2.out',scrollTrigger:{trigger:'.section-heading',start:'top 90%',once:true}});
gsap.utils.toArray('.card').forEach((card,i)=>{gsap.from(card,{y:35,opacity:0,duration:.6,delay:(i%3)*.08,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 94%',once:true}});});
for(const selector of ['.outro-line','.end-line'])gsap.from(selector,{scaleX:0,ease:'none',scrollTrigger:{trigger:selector,start:'top 95%',end:'top 55%',scrub:.35}});
gsap.from('.outro-star',{rotation:-80,ease:'none',scrollTrigger:{trigger:'.outro',start:'top bottom',end:'bottom bottom',scrub:.5}});
});document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
