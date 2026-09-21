(()=>{if(window.__journeyBooted||!window.gsap||!window.ScrollTrigger)return;window.__journeyBooted=true;
gsap.registerPlugin(ScrollTrigger);
gsap.config({force3D:true,nullTargetWarn:false});

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const chapters=gsap.utils.toArray('.chapter');
const albumCover=document.querySelector('#albumCover');
const albumTitle=document.querySelector('#albumTitle');
const routeBoard=document.querySelector('#routeBoard');
const currentDay=document.querySelector('#currentDay');
const albums=[
  {title:'男孩',cover:'https://via.placeholder.com/300/222222/d88449?text=BOY',route:'海口 · 起飞 13:30'},
  {title:'灵魂歌手',cover:'https://via.placeholder.com/300/3a1d0e/f0b080?text=SOUL+SINGER',route:'龙脊梯田 · 金坑大寨 · 前方右转'},
  {title:'日落大道',cover:'https://via.placeholder.com/300/49200b/f2a36c?text=SUNSET+BLVD',route:'阳朔 · 十里画廊 · 60km'},
  {title:'出现又离开',cover:'https://via.placeholder.com/300/171717/d9824b?text=COME+AND+GO',route:'返程'}
];

let active=-1;
function setChapter(i){
  if(i===active)return;
  active=i;
  const a=albums[i];
  gsap.to([albumCover,albumTitle,routeBoard],{opacity:0,duration:.18,onComplete:()=>{
    albumCover.src=a.cover;
    albumCover.alt='《'+a.title+'》临时专辑封面';
    albumTitle.textContent=a.title;
    routeBoard.textContent=a.route;
    currentDay.textContent=String(i+1).padStart(2,'0');
    gsap.to([albumCover,albumTitle,routeBoard],{opacity:1,duration:.35});
  }});
}

const particles=document.querySelector('#particles');
for(let i=0;i<20;i++){
  const p=document.createElement('span');
  const note=i%3!==0;
  p.className='particle'+(note?'':' dot');
  p.textContent=note?(i%2?'♪':'♫'):'';
  p.style.left=(4+Math.random()*92)+'%';
  p.style.top=(7+Math.random()*86)+'%';
  particles.appendChild(p);
  if(!reduce)gsap.to(p,{y:()=>gsap.utils.random(-28,28),x:()=>gsap.utils.random(-10,10),opacity:()=>gsap.utils.random(.2,.72),duration:()=>gsap.utils.random(2.8,5.8),repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2});
}

if(!reduce){
  gsap.to('.glow',{scale:1.1,opacity:.5,duration:4.8,repeat:-1,yoyo:true,ease:'sine.inOut'});
  gsap.utils.toArray('.edge-sign').forEach((el,i)=>gsap.to(el,{y:i?18:-16,x:i?-6:8,rotation:i?3:-2,duration:3.5+i,repeat:-1,yoyo:true,ease:'sine.inOut'}));
}

const holoCard=document.querySelector('#holoCard');
let holoResetTimer;
function resetHolo(){
  clearTimeout(holoResetTimer);
  holoCard.classList.add('is-resetting');
  holoCard.style.transform='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
  [['--mx','50%'],['--my','50%'],['--bgx','0px'],['--bgy','0px'],['--subx','0px'],['--suby','0px'],['--linex','0px'],['--liney','0px'],['--ghostx','0px'],['--ghosty','0px']].forEach(([k,v])=>holoCard.style.setProperty(k,v));
  holoResetTimer=setTimeout(()=>holoCard.classList.remove('is-resetting'),650);
}
function tiltHolo(e){
  if(reduce||e.pointerType==='touch')return;
  const r=holoCard.getBoundingClientRect();
  const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
  const nx=x-.5;
  const ny=y-.5;
  holoCard.classList.remove('is-resetting');
  holoCard.style.transform=`translate3d(0,0,0) rotateX(${-ny*18}deg) rotateY(${nx*22}deg)`;
  holoCard.style.setProperty('--mx',`${x*100}%`);
  holoCard.style.setProperty('--my',`${y*100}%`);
  holoCard.style.setProperty('--bgx',`${-nx*8}px`);
  holoCard.style.setProperty('--bgy',`${-ny*8}px`);
  holoCard.style.setProperty('--subx',`${nx*13}px`);
  holoCard.style.setProperty('--suby',`${ny*13}px`);
  holoCard.style.setProperty('--linex',`${nx*20}px`);
  holoCard.style.setProperty('--liney',`${ny*20}px`);
  holoCard.style.setProperty('--ghostx',`${nx*28}px`);
  holoCard.style.setProperty('--ghosty',`${ny*28}px`);
}
holoCard.addEventListener('pointermove',tiltHolo);
holoCard.addEventListener('pointerleave',resetHolo);
holoCard.addEventListener('blur',resetHolo);
holoCard.addEventListener('keydown',e=>{
  const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
  if(!d)return;
  e.preventDefault();
  holoCard.classList.remove('is-resetting');
  holoCard.style.transform=`translate3d(0,0,0) rotateX(${-d[1]*8}deg) rotateY(${d[0]*9}deg)`;
});

gsap.to('.vinyl',{rotation:720,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1.2}});
gsap.to('.dot-orbit',{rotation:720,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1.2}});
[['.mountain.far',-5],['.mountain.mid',-10],['.mountain.near',-17]].forEach(([t,y])=>gsap.to(t,{yPercent:y,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1.2}}));
gsap.to('#progressBar',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1.2}});
gsap.to('.masthead',{opacity:0,y:-90,ease:'none',scrollTrigger:{trigger:'.chapter:first-child',start:'top top',end:'30% top',scrub:1.2}});

chapters.forEach((section,i)=>{
  const wrap=section.querySelector('.card-wrap');
  const card=section.querySelector('.card');
  const fromX=i%2===0?'-115vw':'115vw';
  const outX=i%2===0?'34vw':'-34vw';
  gsap.set(wrap,{x:fromX,opacity:0,rotationY:i%2===0?-28:28,transformOrigin:'50% 50%'});
  gsap.timeline({scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:1.2,onEnter:()=>setChapter(i),onEnterBack:()=>setChapter(i)}})
    .to(wrap,{x:0,opacity:1,rotationY:0,duration:.24,ease:'power2.out'})
    .to(card,{rotationY:180,duration:.32,ease:'power2.inOut'},.43)
    .to(wrap,{x:outX,opacity:0,rotationY:i%2===0?14:-14,duration:.2,ease:'power1.in'},.8);
});

gsap.timeline({scrollTrigger:{trigger:'.holo-section',start:'top bottom',end:'bottom top',scrub:1.2}})
  .fromTo('.holo-copy',{opacity:0,x:-90},{opacity:1,x:0,duration:.3,ease:'power2.out'},0)
  .fromTo('.holo-shell',{opacity:0,y:120,rotationY:-16},{opacity:1,y:0,rotationY:0,duration:.34,ease:'power2.out'},0)
  .to(['.holo-copy','.holo-shell'],{opacity:0,y:-70,duration:.18,ease:'power1.in'},.82);
gsap.timeline({scrollTrigger:{trigger:'.holo-section',start:'top 70%',end:'bottom 30%',scrub:1.2}})
  .to(['.record-stage','.route-board','.edge-sign','.chapter-index'],{opacity:.12,duration:.28},0)
  .to(['.record-stage','.route-board','.edge-sign','.chapter-index'],{opacity:0,duration:.22},.74);
gsap.to('.outro-copy',{opacity:1,y:0,ease:'power2.out',scrollTrigger:{trigger:'.outro',start:'top 70%',end:'center center',scrub:1.2}});
gsap.to(['.record-stage','.route-board','.edge-sign','.chapter-index'],{opacity:0,ease:'none',scrollTrigger:{trigger:'.outro',start:'top 70%',end:'center center',scrub:1.2}});

document.querySelectorAll('.card').forEach(card=>{
  const toggle=()=>card.classList.toggle('is-manual-flipped');
  card.addEventListener('click',toggle);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
});
setChapter(0);
ScrollTrigger.refresh();
})();
