/* One passive scroll source. Native scrolling is never captured. */
const story = document.querySelector('.editorial-story');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = [
 ['LE CORPS.', 'L’ESPRIT.', 'Tout commence par un salut.', 'Le respect avant la technique. La confiance avant la performance. Une école de vie, dès 3 ans.', 'LE RESPECT'],
 ['APPRENDRE.', 'SE RELEVER.', 'Tomber. Apprendre. Recommencer.', 'Chaque geste se construit avec patience. Chaque chute est une nouvelle occasion de se relever. Chacun avance à son rythme.', 'LA PERSÉVÉRANCE'],
 ['PROGRESSER.', 'ENSEMBLE.', 'Une force collective.', 'Trois dojos à Cayenne. Les plus expérimentés transmettent aux plus jeunes. Sur le tatami, on grandit ensemble.', 'LA TRANSMISSION']
];
let chapter = -1, scheduled = false;
const buttons = [...document.querySelectorAll('[data-story-chapter]')];
const scenes = [...document.querySelectorAll('[data-scene]')];
const smooth = (a,b,v) => { const t=Math.max(0,Math.min(1,(v-a)/(b-a))); return t*t*(3-2*t); };
function paintScenes(p) {
 const reduced=preference.matches;
 const toSecond=smooth(1/3-.035,1/3+.035,p);
 const toThird=smooth(2/3-.035,2/3+.035,p);
 const opacity=[1-toSecond,toSecond*(1-toThird),toThird];
 scenes.forEach((scene,i)=>{
  scene.style.opacity=reduced ? String(i===chapter?1:0) : opacity[i].toFixed(4);
  const local=Math.max(0,Math.min(1,p*3-i));
  scene.style.transform=reduced?'none':`translate3d(0,${(local-.5)*-9}px,0) scale(${1.018+local*.012})`;
 });
}
function showChapter(next) {
 if (next === chapter) return;
 chapter = next;
 const c = chapters[next];
 ['story-line-1','story-line-2','story-title','story-text','story-value'].forEach((id,i) => document.getElementById(id).textContent = c[i]);
 document.getElementById('story-number').textContent = '0' + (next+1);
 story.dataset.chapter = next;
 buttons.forEach((b,i) => { if(i===next) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
 if (!preference.matches) for (const selector of ['.hero-type h1','.hero-editorial']) {
  const el = document.querySelector(selector);
  el.getAnimations().forEach(a=>a.cancel());
  el.animate([{opacity:.2,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'});
 }
}
function updateStory() {
 scheduled=false;
 const rect=story.getBoundingClientRect();
 const p=preference.matches ? Math.max(0,chapter)/3 : Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));
 story.style.setProperty('--story-progress',p);
 story.dataset.progress=p.toFixed(4);
 if (!preference.matches) showChapter(Math.min(2,Math.floor(p*3))); else if(chapter<0) showChapter(0);
 paintScenes(p);
}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{
 if (preference.matches) {showChapter(i);updateStory();return;}
 const rect=story.getBoundingClientRect();
 const target=scrollY+rect.top+(rect.height-innerHeight)*(i/3+.015);
 window.scrollTo({top:target,behavior:'smooth'});
}));
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateStory);}},{passive:true});
addEventListener('resize',updateStory);
preference.addEventListener('change',updateStory);
updateStory();
