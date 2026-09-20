import * as T from './three.module.js';
const host=document.querySelector('#judoka-canvas'),stage=document.querySelector('#judoka-stage'),motion=document.querySelector('#model-motion');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;function fallback(){host.innerHTML='<img class="model-fallback" src="assets/logo.png" alt="Logo original du CSAB Judo">';document.querySelector('.model-hint').textContent='3D indisponible sur ce navigateur';document.querySelector('.model-controls').hidden=true;}
try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{fallback();}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.appendChild(renderer.domElement);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50);camera.position.set(0,.5,10.8);camera.lookAt(0,.1,0);
const studio=new T.Scene();studio.background=new T.Color('#596774');function box(w,h,x,y,z,power){const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color().setScalar(power),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m);}box(3,8,-4,3,4,4);box(2,8,4,1,1,3);box(5,4,0,6,-2,4);const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.05,.1,40).texture;pmrem.dispose();
scene.add(new T.HemisphereLight(0xdbefff,0x203046,2.1));const key=new T.DirectionalLight(0xfff5eb,4);key.position.set(-3,5,5);scene.add(key);const rim=new T.DirectionalLight(0x83caff,3);rim.position.set(4,2,-3);scene.add(rim);const fill=new T.DirectionalLight(0xffffff,1);fill.position.set(0,0,5);scene.add(fill);
const weave=document.createElement('canvas');weave.width=weave.height=256;const c=weave.getContext('2d');c.fillStyle='#828282';c.fillRect(0,0,256,256);for(let y=0;y<256;y+=4)for(let x=0;x<256;x+=4){c.fillStyle=((x+y)/4)%2?'#a5a5a5':'#636363';c.fillRect(x,y,2,3);}const texture=new T.CanvasTexture(weave);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(9,9);texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
const gi=new T.MeshPhysicalMaterial({color:0xe3e9ec,roughness:.84,metalness:0,bumpMap:texture,bumpScale:.018,sheen:.8,sheenColor:0xffffff,sheenRoughness:.8});const lapelMat=gi.clone();lapelMat.color.set(0xf5f7f8);const trousers=gi.clone();trousers.color.set(0xe0e5e8);const skin=new T.MeshPhysicalMaterial({color:0xdedbd4,roughness:.48,metalness:0,clearcoat:.12});const black=new T.MeshStandardMaterial({color:0x111820,roughness:.8,bumpMap:texture,bumpScale:.009});const seamMat=new T.MeshStandardMaterial({color:0xaabcc8,roughness:.9});
const floating=new T.Group(),model=new T.Group();floating.add(model);scene.add(floating);model.rotation.y=-.2;
function part(geometry,material,pos=[0,0,0],scale=[1,1,1],parent=model){const m=new T.Mesh(geometry,material);m.position.set(...pos);m.scale.set(...scale);parent.add(m);return m;}
function ellipsoid(pos,scale,mat=gi){return part(new T.SphereGeometry(1,40,28),mat,pos,scale);}
// Continuous ring meshes taper the judogi and trousers, with subtle fabric folds.
function clothForm(rings,mat=gi,depth=.75){const points=rings.map(([r,y])=>new T.Vector2(r,y));const geo=new T.LatheGeometry(points,80);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i),theta=Math.atan2(x,z);const fold=1+.017*Math.sin(theta*9+y*8)+.01*Math.sin(y*22+theta*3);a.setXYZ(i,x*fold,y,z*depth*fold);}geo.computeVertexNormals();return part(geo,mat);}
const torso=clothForm([[.38,-.15],[.45,.1],[.5,.55],[.56,1.05],[.61,1.35],[.51,1.56],[.31,1.69],[.2,1.7]],gi,.67);
ellipsoid([0,.02,0],[.44,.31,.29],trousers);
function limb(a,b,r1,r2,mat=gi){const start=new T.Vector3(...a),end=new T.Vector3(...b),length=start.distanceTo(end);const rings=[[r2*.95,-length/2],[r2,-length/2+.05],[r2*1.1,-length*.3],[(r1+r2)*.52,-length*.1],[r1*.95,length*.28],[r1,length/2]];const m=clothForm(rings,mat,.93);m.position.copy(start.clone().add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),start.clone().sub(end).normalize());return m;}
// Grounded, relaxed guard stance; both legs and arms have actual 3D volume.
limb([-.27,-.07,0],[-.46,-1.2,.13],.3,.225,trousers);limb([-.46,-1.2,.13],[-.5,-2.22,.06],.23,.165,trousers);
limb([.27,-.07,-.03],[.47,-1.18,-.07],.3,.23,trousers);limb([.47,-1.18,-.07],[.62,-2.22,-.06],.23,.17,trousers);
ellipsoid([-.46,-1.2,.12],[.226,.27,.218],trousers);ellipsoid([.47,-1.18,-.06],[.227,.27,.215],trousers);
ellipsoid([-.51,-2.38,.21],[.19,.145,.37],skin);ellipsoid([.63,-2.38,.09],[.19,.145,.37],skin);
for(const [x,z] of [[-.51,.21],[.63,.09]]){for(let i=0;i<4;i++)ellipsoid([x-.115+i*.071,-2.39,z+.27],[.04,.07,.10-i*.008],skin);}
ellipsoid([-.56,1.35,0],[.31,.32,.28]);ellipsoid([.56,1.35,0],[.31,.32,.28]);
limb([-.63,1.35,0],[-.94,.65,.12],.29,.235);limb([-.94,.65,.12],[-.76,.24,.55],.235,.175);ellipsoid([-.94,.65,.12],[.232,.26,.231]);
limb([.63,1.35,0],[.94,.75,.2],.29,.23);limb([.94,.75,.2],[.76,.60,.78],.23,.16);ellipsoid([.94,.75,.2],[.23,.25,.23]);
const leftHand=ellipsoid([-.72,.12,.66],[.14,.20,.11],skin);leftHand.rotation.z=-.3;const rightHand=ellipsoid([.72,.56,.91],[.145,.18,.115],skin);rightHand.rotation.x=.5;
for(let i=0;i<4;i++){ellipsoid([-.813+i*.052,.005,.705],[.031,.085,.038],skin);ellipsoid([.625+i*.052,.52,1.006],[.034,.079,.043],skin);}ellipsoid([-.61,.16,.73],[.065,.1,.07],skin);ellipsoid([.58,.61,.94],[.064,.1,.07],skin);
part(new T.CylinderGeometry(.155,.19,.34,40),skin,[0,1.77,0]);const head=ellipsoid([0,2.17,.015],[.315,.425,.29],skin);head.rotation.y=.06;ellipsoid([0,1.91,.07],[.255,.2,.215],skin);ellipsoid([-.307,2.12,.008],[.049,.105,.065],skin);ellipsoid([.307,2.12,.008],[.049,.105,.065],skin);
// A faceless sculptural mannequin, with a natural brow and nose plane.
ellipsoid([0,2.15,.279],[.042,.095,.035],skin);
function ribbon(points,width,material=lapelMat,thickness=.025){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const shape=new T.Shape();shape.moveTo(-width/2,-thickness);shape.lineTo(width/2,-thickness);shape.lineTo(width/2,thickness);shape.lineTo(-width/2,thickness);shape.closePath();return part(new T.ExtrudeGeometry(shape,{steps:70,bevelEnabled:false,extrudePath:curve}),material);}
// Crossover lapels and overlapping skirt panels make the silhouette read as judogi.
ribbon([[-.22,1.71,.02],[-.32,1.47,.23],[-.22,1.09,.365],[.02,.6,.36],[.29,.1,.29]],.145);
ribbon([[.22,1.71,.02],[.31,1.47,.23],[.21,1.09,.4],[-.05,.6,.4],[-.28,.1,.32]],.155);
function skirt(side){const geo=new T.PlaneGeometry(.59,.63,14,18);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setXYZ(i,x+side*.23,y-.31,.30+Math.cos(x*4)*.065+Math.sin(y*15)*.018);}geo.computeVertexNormals();const mat=gi.clone();mat.side=T.DoubleSide;const m=part(geo,mat);m.rotation.z=side*.06;return m;}skirt(-1);skirt(1);clothForm([[.49,-.61],[.53,-.46],[.49,-.12],[.44,.15]],gi,.68);
// Belt follows an elliptical waist, with real knot and hanging ends.
const beltPoints=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2;beltPoints.push(new T.Vector3(Math.sin(a)*.46,.14,Math.cos(a)*.33));}const beltCurve=new T.CatmullRomCurve3(beltPoints);const sh=new T.Shape();sh.moveTo(-.075,-.024);sh.lineTo(.075,-.024);sh.lineTo(.075,.024);sh.lineTo(-.075,.024);sh.closePath();part(new T.ExtrudeGeometry(sh,{steps:160,bevelEnabled:false,extrudePath:beltCurve}),black);
ribbon([[-.17,.12,.36],[0,.18,.45],[.15,.09,.37]],.13,black,.028);ribbon([[.14,.17,.38],[0,.075,.46],[-.10,.19,.4]],.13,black,.028);ribbon([[-.03,.12,.42],[-.13,-.16,.46],[-.18,-.55,.45],[-.26,-.74,.49]],.12,black,.022);ribbon([[.03,.12,.42],[.16,-.11,.44],[.31,-.41,.44],[.36,-.61,.51]],.12,black,.022);
function seam(points){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));part(new T.TubeGeometry(curve,50,.004,4,false),seamMat);}seam([[0,1.65,-.13],[0,1.2,-.36],[0,.6,-.34],[0,.18,-.3]]);seam([[-.59,1.4,-.08],[-.79,1.08,-.14],[-.98,.69,.05]]);seam([[.59,1.4,-.08],[.79,1.1,-.12],[.98,.78,.12]]);

// Original club mark and supplied garment details are mapped onto curved surfaces.
// Texture windows select fabric only: none of the source studio background is rendered.
const loader=new T.TextureLoader();
function garmentPatch(source,rect,w,h,position,rotationY=0,curve=.02){const map=loader.load(source);map.colorSpace=T.SRGBColorSpace;map.anisotropy=renderer.capabilities.getMaxAnisotropy();if(rect){const [x,y,cw,ch]=rect;map.repeat.set(cw/1024,ch/1536);map.offset.set(x/1024,1-(y+ch)/1536);}const g=new T.PlaneGeometry(w,h,20,20),a=g.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i);a.setZ(i,-curve*Math.pow(x/(w/2),2));}g.computeVertexNormals();const material=new T.MeshStandardMaterial({map,transparent:!rect,roughness:.84,metalness:0,polygonOffset:true,polygonOffsetFactor:-2});const patch=part(g,material,position);patch.rotation.y=rotationY;return patch;}
garmentPatch('assets/logo.png',null,.27,.31,[.34,1.12,.344],.18,.04);
garmentPatch('assets/judoka-back.png',[392,240,244,209],.70,.60,[0,1.07,-.393],Math.PI,.065);
garmentPatch('assets/judoka-front.png',[682,329,71,87],.24,.29,[.726,1.19,.219],.75,.025);
garmentPatch('assets/judoka-front.png',[261,327,70,81],.24,.28,[-.725,1.19,.219],-.75,.025);
garmentPatch('assets/judoka-front.png',[365,734,64,43],.17,.115,[-.32,-.46,.40],0,.009);
// Multiple parallel stitch lines add physical detail at the lapels and cuffs.
for(const delta of [-.037,-.018,.018,.037]){seam([[-.23+delta,1.63,.14],[-.27+delta,1.35,.31],[-.10+delta,.86,.415],[.21+delta,.22,.354]]);seam([[.24+delta,1.63,.14],[.27+delta,1.35,.32],[.10+delta,.86,.44],[-.21+delta,.22,.39]]);}

let target=-.18,angle=-.18,progress=0,down=false,lastX=0,last=performance.now(),visible=true,auto=!reduced,manual=0;
function setMotion(){motion.setAttribute('aria-pressed',String(auto));motion.textContent=auto?'Pause':'Animer';motion.setAttribute('aria-label',auto?'Mettre la rotation automatique en pause':'Activer la rotation automatique');}setMotion();motion.onclick=()=>{auto=!auto;setMotion()};
function turn(delta){target+=delta;manual=performance.now();}document.querySelector('#turn-left').onclick=()=>turn(-Math.PI/4);document.querySelector('#turn-right').onclick=()=>turn(Math.PI/4);document.querySelector('#view-front').onclick=()=>{target=Math.round(angle/(Math.PI*2))*Math.PI*2;manual=performance.now();};document.querySelector('#view-back').onclick=()=>{target=Math.round(angle/(Math.PI*2))*Math.PI*2+Math.PI;manual=performance.now();};
host.addEventListener('pointerdown',e=>{down=true;lastX=e.clientX;host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(down){turn((e.clientX-lastX)*.012);lastX=e.clientX}});host.addEventListener('pointerup',()=>down=false);host.addEventListener('pointercancel',()=>down=false);host.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();turn(Math.max(-150,Math.min(150,e.deltaY*(e.deltaMode===1?16:1)))*.006)},{passive:false});host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home'){target=-.18;manual=performance.now();}else turn(e.key==='ArrowLeft'?-.3:.3)}});
window.addEventListener('judoka-scroll',e=>{const next=e.detail.progress;if(!reduced){target+=(next-progress)*Math.PI*2;camera.position.z=(camera.aspect<.65?12:10.8)-Math.sin(next*Math.PI)*.65;}progress=next;});
const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=camera.aspect<.65?12:10.8;camera.updateProjectionMatrix()});resize.observe(host);new IntersectionObserver(e=>visible=e[0].isIntersecting,{rootMargin:'100px'}).observe(stage);
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(auto&&!down&&now-manual>4000)target+=dt*.15;angle=T.MathUtils.damp(angle,target,reduced?35:7,dt);model.rotation.y=angle;floating.position.y=reduced||!auto?0:Math.sin(now*.0011)*.045;floating.rotation.z=reduced||!auto?0:Math.sin(now*.00045)*.012;renderer.render(scene,camera);host.dataset.rotation=angle.toFixed(3);}requestAnimationFrame(animate);host.dataset.model='judoka';
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback()});
}
