const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const mug=$('#mug'),bowl=$('#bowl'),panel=$('#panel'),art=$('#art'),pad=$('#pad');
let st=0,name='',mood=-1,mute=false,G=0,M=0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const say=t=>{$('#bubble').textContent=t};
function beep(f=660,d=.12){if(mute)return;try{const a=beep.a||(beep.a=new(window.AudioContext||window.webkitAudioContext)());if(a.state==='suspended')a.resume();const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.08,a.currentTime);o.connect(g);g.connect(a.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.stop(a.currentTime+d)}catch(e){}}
function pt(s,e){const p=s.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(s.getScreenCTM().inverse())}
function anim(a,b,ms,fn,done){const t0=performance.now();(function f(t){const k=clamp((t-t0)/ms,0,1);fn(a+(b-a)*k);k<1?requestAnimationFrame(f):done&&done()})(t0)}
function drawMug(){
 const H=222,gTop=322-H*G*.62,tTop=gTop-H*M*.38,half=118-.13*(tTop-100);
 $('#gr').setAttribute('y',gTop);$('#gr').setAttribute('height',322-gTop);
 $('#cr').setAttribute('y',tTop);$('#cr').setAttribute('height',gTop-tTop);
 const s=$('#surf');s.setAttribute('cy',tTop);s.setAttribute('rx',half-6);s.setAttribute('ry',(half-6)*.26);s.style.display=G>0?'':'none';
}
const bar=p=>{const b=$('#bar i');if(b)b.style.width=p*100+'%'};
function next(){panel.insertAdjacentHTML('beforeend','<button class="go" id="nx">Lanjut</button>');const n=$('#nx');n.onclick=()=>go(st+1);n.focus({preventScroll:true})}

/* ---------- tahap ---------- */
function intro(){
 say('Hai! Aku maskot kecil. Yuk bikin matcha bareng.');
 panel.innerHTML=`<h1>Bikin matcha yuk</h1><p>Satu gelas kecil, khusus buat kamu.</p>
 <label>Nama panggilanmu<input id="nm" maxlength="20" value="${esc(name)}" placeholder="${esc(CONFIG.defaultName)}" autocomplete="off"></label>
 <p><b>Hari ini kamu lagi:</b></p>
 <div class="moods">${CONFIG.moods.map((m,i)=>`<button class="mood" data-i="${i}" aria-pressed="false">${m.e}<span>${m.l}</span></button>`).join('')}</div>
 <button class="go" id="start" disabled>Mulai</button>`;
 panel.querySelectorAll('.mood').forEach(b=>b.onclick=()=>{panel.querySelectorAll('.mood').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');mood=+b.dataset.i;$('#start').disabled=false;beep(520)});
 const begin=()=>{if(mood<0)return;name=$('#nm').value.trim()||CONFIG.defaultName;go(1)};
 $('#start').onclick=begin;
 $('#nm').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(mood>=0)begin();else say('Pilih dulu perasaanmu hari ini ya.')}};
}
function bahan(){
 say(`Halo ${name}! Ambil tiga bahan ini satu per satu.`);
 const it=[['🍃','Bubuk matcha'],['♨️','Air panas'],['🍯','Sedikit manis']];let n=0;
 panel.innerHTML=`<h2>Siapkan bahan</h2><div class="ings">${it.map((x,i)=>`<button class="ing" data-i="${i}"><span>${x[0]}</span><span>${x[1]}<small></small></span></button>`).join('')}</div>`;
 panel.querySelectorAll('.ing').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;b.classList.add('done');const r=CONFIG.reasons[+b.dataset.i]||'';b.querySelector('small').textContent=r;say(r);beep(500+n*120);if(++n===3)next()});
}
function whisk(){
 say('Aduk pelan-pelan dengan jarimu. Bikin busa yang banyak ya!');
 panel.innerHTML='<h2>Aduk matcha</h2><p>Gerakkan jari atau mouse melingkar di dalam mangkuk.</p><div class="bar" id="bar"><i></i></div>';
 const foam=$('#foam'),liq=$('#liq'),w=$('#whisk');foam.innerHTML='';liq.setAttribute('fill','#d8e8bd');w.setAttribute('transform','translate(200 164)');
 bowl.setAttribute('tabindex','0');
 bowl.setAttribute('aria-label','Mangkuk matcha. Seret jari atau gerakkan whisk dengan tombol panah.');
 let d=0,lx=null,ly=null,active=false,fin=false,vb=0,bub=0,ang=0;
 function progress(amount,p){
  if(fin)return;
  d+=amount;
  if(p){w.setAttribute('transform',`translate(${clamp(p.x,90,310)} ${clamp(p.y,150,200)-18})`)}
  vb+=amount;
  if(vb>90){vb=0;if(navigator.vibrate)navigator.vibrate(8)}
  const pr=Math.min(1,d/1200);bar(pr);
  liq.setAttribute('fill',`rgb(${216-69*pr|0},${232-54*pr|0},${189-107*pr|0})`);
  while(bub<pr*45){bub++;let x,y;do{x=200+(Math.random()-.5)*260;y=182+(Math.random()-.5)*70}while(((x-200)/130)**2+((y-182)/32)**2>1);
   const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',3+Math.random()*6);c.setAttribute('fill','#cfe3a0');c.setAttribute('opacity','.85');foam.appendChild(c)}
  if(pr>=1){fin=true;active=false;lx=ly=null;say('Busanya cantik banget!');beep(784);next()}
 }
 bowl.onpointerdown=e=>{
  if(fin)return;
  e.preventDefault();
  bowl.setPointerCapture(e.pointerId);
  active=true;
  const p=pt(bowl,e);
  lx=p.x;ly=p.y;
  w.setAttribute('transform',`translate(${clamp(p.x,90,310)} ${clamp(p.y,150,200)-18})`);
 };
 bowl.onpointermove=e=>{
  if(!active||fin)return;
  const p=pt(bowl,e);
  w.setAttribute('transform',`translate(${clamp(p.x,90,310)} ${clamp(p.y,150,200)-18})`);
  if(lx!==null&&ly!==null)progress(Math.hypot(p.x-lx,p.y-ly),p);
  lx=p.x;ly=p.y;
 };
 bowl.onpointerup=bowl.onpointercancel=e=>{
  active=false;lx=ly=null;
  if(e&&bowl.hasPointerCapture&&bowl.hasPointerCapture(e.pointerId))bowl.releasePointerCapture(e.pointerId);
 };
 bowl.onkeydown=e=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||fin)return;
  e.preventDefault();
  ang+=.9;progress(120,{x:200+Math.cos(ang)*70,y:182+Math.sin(ang)*20});
 };
}
function tuang(){
 say('Matcha-nya dituang ke gelas dulu ya...');
 panel.innerHTML='<h2>Tuang susu</h2><p>Tahan tombol sampai gelas hampir penuh, lalu lepas.</p><div class="bar" id="bar"><i></i></div><button class="go" id="hold" disabled>Tahan untuk tuang susu</button>';
 G=0;M=0;drawMug();
 let hold=false,last=0,fin=false,ready=false;const btn=$('#hold');
 anim(0,1,1000,v=>{G=v;drawMug()},()=>{ready=true;btn.disabled=false;say('Sekarang tuang susunya. Tahan tombolnya!')});
 function loop(t){if(!hold||fin)return;M=Math.min(1,M+(t-last)/1000*.5);last=t;drawMug();bar(M);M>=1?finish():requestAnimationFrame(loop)}
 function start(){if(!ready||fin||hold)return;hold=true;last=performance.now();requestAnimationFrame(loop)}
 function stop(){if(!hold)return;hold=false;if(M>=.8)finish();else say('Sedikit lagi, tahan terus ya.')}
 function finish(){fin=true;hold=false;btn.disabled=true;anim(M,1,300,v=>{M=v;drawMug();bar(v)},()=>{say('Pas banget!');beep(784);next()})}
 btn.onpointerdown=e=>{if(!ready||fin)return;e.preventDefault();btn.setPointerCapture(e.pointerId);start()};
 btn.onpointerup=e=>{if(btn.hasPointerCapture(e.pointerId))btn.releasePointerCapture(e.pointerId);stop()};
 btn.onpointercancel=stop;btn.onpointerleave=()=>{};btn.oncontextmenu=e=>e.preventDefault();
 btn.onkeydown=e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();start()}};btn.onkeyup=e=>{if(e.key===' '||e.key==='Enter')stop()};
}
const stamp=(t,x,y,k=1)=>{const f='#FBF3DC';
 if(t==='heart')return`<path transform="translate(${x} ${y}) scale(${1.6*k})" d="M0 10C-16-2-10-14 0-6C10-14 16-2 0 10Z" fill="${f}"/>`;
 if(t==='star')return`<path transform="translate(${x} ${y}) scale(${1.3*k})" d="M0-10L3-3L10-3L4 2L6 9L0 5L-6 9L-4 2L-10-3L-3-3Z" fill="${f}"/>`;
 return`<g transform="translate(${x} ${y}) scale(${k})" fill="${f}">${[0,72,144,216,288].map(a=>`<ellipse cy="-7" rx="4.5" ry="7" transform="rotate(${a})"/>`).join('')}</g>`};
function latte(){
 G=1;M=1;drawMug();pad.style.display='';
 say('Hias busanya! Tap untuk menempel, atau pilih Gambar.');
 art.innerHTML=stamp('heart',190,100,2.1);
 let tool='heart',drawing=false,cur;
 panel.innerHTML=`<h2>Latte art</h2><div class="tools">${[['heart','♥','Hati'],['star','★','Bintang'],['sak','🌸','Sakura'],['draw','✏️','Gambar']].map(t=>`<button class="tool" data-t="${t[0]}" aria-pressed="${t[0]==='heart'}">${t[1]}<span>${t[2]}</span></button>`).join('')}</div>
 <button class="pill alt" id="clr">Hapus semua</button><button class="go" id="fin">Selesai</button>`;
 panel.querySelectorAll('.tool').forEach(b=>b.onclick=()=>{panel.querySelectorAll('.tool').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');tool=b.dataset.t});
 $('#clr').onclick=()=>art.innerHTML='';
 $('#fin').onclick=()=>go(5);
 pad.onpointerdown=e=>{pad.setPointerCapture(e.pointerId);const p=pt(mug,e);
  if(tool==='draw'){drawing=true;cur=document.createElementNS(NS,'path');cur.setAttribute('d',`M${p.x} ${p.y}`);['fill:none','stroke:#FBF3DC','stroke-width:6','stroke-linecap:round','stroke-linejoin:round'].forEach(s=>{const[k,v]=s.split(':');cur.setAttribute(k,v)});art.appendChild(cur)}
  else{art.insertAdjacentHTML('beforeend',stamp(tool,p.x,p.y));beep(880,.08)}};
 pad.onpointermove=e=>{if(drawing){const p=pt(mug,e);cur.setAttribute('d',cur.getAttribute('d')+` L${p.x} ${p.y}`)}};
 pad.onpointerup=pad.onpointercancel=()=>drawing=false;
}
function reward(){
 pad.style.display='none';$('#deco').style.opacity=1;beep(988,.3);confetti();
 say(`Selamat ${name}, matcha-mu sudah jadi!`);
 const m=CONFIG.moods[mood]||CONFIG.moods[0];
 panel.innerHTML=`<h2>Matcha untuk ${esc(name)} sudah jadi</h2>
 <article class="letter"><p><b>Hai ${esc(name)},</b></p><p>${esc(m.m)}</p><p>${esc(CONFIG.letter)}</p></article>
 <h3>Kupon buat kamu (tap untuk buka)</h3>
 <div class="coupons">${CONFIG.coupons.map(c=>`<button class="coupon" aria-expanded="false"><span>🎟️ ${esc(c[0])}</span><span class="b">${esc(c[1])}</span></button>`).join('')}</div>
 ${CONFIG.photos.length?`<div class="photos">${CONFIG.photos.map(s=>`<img src="${esc(s)}" alt="Kenangan kita" loading="lazy">`).join('')}</div>`:''}
 <p style="margin-top:14px"><button class="pill alt" id="save">Simpan gelasku</button><button class="pill" id="again">Main lagi</button></p>`;
 panel.querySelectorAll('.coupon').forEach(b=>b.onclick=()=>{b.classList.toggle('open');b.setAttribute('aria-expanded',b.classList.contains('open'));beep(700,.08)});
 $('#save').onclick=save;
 $('#again').onclick=()=>{G=0;M=0;art.innerHTML='';$('#deco').style.opacity=0;mood=-1;drawMug();go(0)};
}
function save(){
 const c=mug.cloneNode(true);c.removeAttribute('hidden');c.setAttribute('width',800);c.setAttribute('height',740);
 c.querySelector('#pad').remove();c.insertAdjacentHTML('afterbegin','<defs>'+$('#defs').innerHTML+'</defs>');
 const fname='matcha-'+(name.replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/^-+|-+$/g,'')||'untukmu')+'.png';
 const img=new Image();
 img.onerror=()=>say('Maaf, gambarnya gagal disimpan. Coba screenshot saja ya.');
 img.onload=()=>{
  const cv=document.createElement('canvas');cv.width=800;cv.height=740;const x=cv.getContext('2d');
  x.fillStyle='#FFD9C4';x.fillRect(0,0,800,740);x.drawImage(img,0,0,800,740);
  cv.toBlob(async b=>{
   if(!b){say('Maaf, gambarnya gagal disimpan. Coba screenshot saja ya.');return}
   const file=new File([b],fname,{type:'image/png'});
   try{
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Matcha untukmu'});return}
   }catch(e){if(e&&e.name==='AbortError')return}
   const u=URL.createObjectURL(b),a=document.createElement('a');a.download=fname;a.href=u;document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(u),4000);say('Gelasmu sudah disimpan!');
  },'image/png');
 };
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(c));
}
function confetti(){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const c=$('#cf'),x=c.getContext('2d');const fit=()=>{c.width=innerWidth;c.height=innerHeight};fit();addEventListener('resize',fit);
 const P=Array.from({length:70},()=>({x:Math.random()*c.width,y:-Math.random()*c.height*.6,v:1.5+Math.random()*2.5,s:4+Math.random()*6,r:Math.random()*6,w:(Math.random()-.5)*.1,p:Math.random()<.65,d:Math.random()*2-1}));
 let t=0;(function f(){x.clearRect(0,0,c.width,c.height);P.forEach(q=>{q.y+=q.v;q.x+=q.d+Math.sin(q.y/30);q.r+=q.w*3;x.save();x.translate(q.x,q.y);x.rotate(q.r);x.fillStyle=q.p?'#F6B8C6':'#A6C06B';x.beginPath();x.ellipse(0,0,q.s,q.s*.6,0,0,7);x.fill();x.restore()});++t<300?requestAnimationFrame(f):x.clearRect(0,0,c.width,c.height)})();
}

/* ---------- navigasi ---------- */
const steps=[intro,bahan,whisk,tuang,latte,reward];
function go(i){st=i;$('#dots').innerHTML=steps.map((_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('');
 mug.toggleAttribute('hidden',i===2);bowl.toggleAttribute('hidden',i!==2);pad.style.display='none';
 bowl.onpointerdown=null;bowl.onpointermove=null;bowl.onpointerup=null;bowl.onpointercancel=null;bowl.onkeydown=null;
 bowl.removeAttribute('tabindex');bowl.removeAttribute('aria-label');
 steps[i]();window.scrollTo({top:0,behavior:'smooth'})}
$('#mute').onclick=e=>{mute=!mute;e.currentTarget.textContent=mute?'🔇':'🔊'};
let taps=0;$('#mini').onclick=()=>{beep(900,.1);if(++taps%5===0)say(CONFIG.secret)};
drawMug();go(0);

/* ---------- PWA ---------- */
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
let deferred=null;const ib=$('#install');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;ib.hidden=false});
ib.onclick=async()=>{if(!deferred)return;deferred.prompt();try{await deferred.userChoice}catch(e){}deferred=null;ib.hidden=true};
addEventListener('appinstalled',()=>{ib.hidden=true;deferred=null});
