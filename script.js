// ── STATE ──
let want = '';
let noCount = 0;
let currentScreen = 's1';
const noMsgs = [
  "Aww, are you sure? 🥺",
  "He might actually cry 😭",
  "Okay but… last chance? 💔",
  "Fine… but he's not giving up. 😤💕"
];
const poems = {
  insta: "Roses are red, violets are blue,\nhis Instagram is boring —\nbut it lights up for you. 💕\n\nThank you for giving him a chance,\nyou've made his whole year!",
  snap:  "Snap, crackle, pop —\nthat's his heart every single time\nyou walk in.\n\nThank you for snapping back\ninto his world. 💫",
  phone: "If love had a number,\nit would be yours.\n\nHe'll text you good morning\nand call when the stars are out. 🌙\n\nYou are his favourite notification. 💌"
};

// ── BG CANVAS (particles) ──
const bgC = document.getElementById('bgCanvas');
const bgCtx = bgC.getContext('2d');
let particles = [];
function resizeBg(){bgC.width=window.innerWidth;bgC.height=window.innerHeight}
resizeBg();window.addEventListener('resize',resizeBg);

class Particle{
  constructor(){this.reset(true)}
  reset(initial=false){
    this.x = Math.random()*bgC.width;
    this.y = initial ? Math.random()*bgC.height : bgC.height+20;
    this.size = 8+Math.random()*14;
    this.speed = 0.3+Math.random()*0.8;
    this.opacity = 0.08+Math.random()*0.18;
    this.char = ['❤','🌸','✿','♥','·'][Math.floor(Math.random()*5)];
    this.drift = (Math.random()-0.5)*0.4;
    this.wobble = Math.random()*Math.PI*2;
    this.wobbleSpeed = 0.01+Math.random()*0.02;
  }
  update(){
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble)*this.drift;
    if(this.y<-30)this.reset();
  }
  draw(ctx){
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px serif`;
    ctx.fillText(this.char,this.x,this.y);
    ctx.restore();
  }
}
for(let i=0;i<30;i++)particles.push(new Particle());

// Bokeh for screen 2
let bokeh = [];
class Bokeh{
  constructor(){this.reset(true)}
  reset(init=false){
    this.x=Math.random()*bgC.width;
    this.y=init?Math.random()*bgC.height:bgC.height+100;
    this.r=30+Math.random()*80;
    this.speed=0.1+Math.random()*0.3;
    this.op=0.03+Math.random()*0.06;
    this.col=Math.random()<0.5?'212,83,126':'147,51,160';
    this.phase=Math.random()*Math.PI*2;
  }
  update(){this.y-=this.speed;this.phase+=0.008;if(this.y<-this.r*2)this.reset()}
  draw(ctx){
    const a=this.op+Math.sin(this.phase)*0.015;
    ctx.save();ctx.globalAlpha=Math.max(0,a);
    const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
    g.addColorStop(0,`rgba(${this.col},0.5)`);
    g.addColorStop(1,`rgba(${this.col},0)`);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}
for(let i=0;i<16;i++)bokeh.push(new Bokeh());

function animBg(){
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  if(currentScreen!=='s2'){
    particles.forEach(p=>{p.update();p.draw(bgCtx)});
  }
  if(currentScreen==='s4'){
    bokeh.forEach(b=>{b.update();b.draw(bgCtx)});
  }
  // requestAnimationFrame(animBg); // Motion removed as requested
}
// animBg(); // Motion removed as requested

// ── CONFETTI CANVAS ──
const confC = document.getElementById('confettiCanvas');
const confCtx = confC.getContext('2d');
let confetti=[];
let confRunning=false;
function resizeConf(){confC.width=window.innerWidth;confC.height=window.innerHeight}
resizeConf();window.addEventListener('resize',resizeConf);
class Conf{
  constructor(x,y){
    this.x=x;this.y=y;
    this.vx=(Math.random()-0.5)*12;
    this.vy=-8-Math.random()*8;
    this.gravity=0.35;
    this.char=['❤','💕','✨','🌸','💖'][Math.floor(Math.random()*5)];
    this.size=14+Math.random()*14;
    this.op=1;this.fade=0.012+Math.random()*0.01;
    this.rot=Math.random()*Math.PI*2;
    this.rotSpeed=(Math.random()-0.5)*0.15;
  }
  update(){
    this.vy+=this.gravity;this.x+=this.vx;this.y+=this.vy;
    this.op-=this.fade;this.rot+=this.rotSpeed;
  }
  draw(ctx){
    if(this.op<=0)return;
    ctx.save();ctx.globalAlpha=Math.max(0,this.op);
    ctx.translate(this.x,this.y);ctx.rotate(this.rot);
    ctx.font=`${this.size}px serif`;ctx.fillText(this.char,0,0);
    ctx.restore();
  }
}
function spawnConfetti(x,y,n=60){
  for(let i=0;i<n;i++)confetti.push(new Conf(x||confC.width/2,y||confC.height/2));
}
function animConf(){
  if(!confRunning)return;
  confCtx.clearRect(0,0,confC.width,confC.height);
  confetti=confetti.filter(c=>c.op>0);
  confetti.forEach(c=>{c.update();c.draw(confCtx)});
  // continuous rain in s4
  if(currentScreen==='s4'&&Math.random()<0.25){
    confetti.push(new Conf(Math.random()*confC.width,-10));
  }
  requestAnimationFrame(animConf);
}

// ── UI ──
function selectWant(val,el){
  want=val;
  document.querySelectorAll('.tog').forEach(t=>t.classList.remove('sel'));
  el.classList.add('sel');
}

function showDots(n){
  document.querySelectorAll('.dot').forEach((d,i)=>{
    if(i<n)d.classList.add('on');else d.classList.remove('on');
  });
}

function curtainWipe(cb){
  const cur=document.getElementById('curtain');
  cur.style.transition='transform 0.5s cubic-bezier(0.77,0,0.18,1)';
  cur.style.transform='translateY(0)';
  setTimeout(()=>{
    if(cb)cb();
    setTimeout(()=>{
      cur.style.transition='transform 0.5s cubic-bezier(0.77,0,0.18,1)';
      cur.style.transform='translateY(-100%)';
      setTimeout(()=>{cur.style.transform='translateY(100%)';cur.style.transition='none'},600);
    },300);
  },500);
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  currentScreen=id;
}

function launch(){
  const line=document.getElementById('line').value.trim();
  if(!line){alert('Please write your pick-up line first! 💘');return}
  if(!want){alert('Choose what you want from her! 💕');return}
  
  // Enter fullscreen & Lock orientation on user gesture
  const doc = document.documentElement;
  const requestFS = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
  
  if (requestFS) {
    requestFS.call(doc).then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(err => {
          console.log("Orientation lock failed:", err);
        });
      }
    }).catch(err => {
      console.log(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  }

  document.body.classList.add('is-viewing');

  curtainWipe(()=>{
    setupS2(line);
    showScreen('s2');
  });
}

// ── TICKER HELPER ──
function runTicker(text, isStatic = false, duration = 2500) {
  return new Promise((resolve) => {
    const track = document.getElementById('tickerTrack');
    track.style.transition = 'none';
    track.style.opacity = '0';
    track.style.textAlign = ''; // Reset
    track.style.width = '';     // Reset
    track.textContent = isStatic ? text : '  ' + text + '  ';
    
    if (isStatic) {
      track.style.transform = 'translateX(0)';
      track.style.textAlign = 'center';
      track.style.width = '100%';
      void track.offsetWidth;
      track.style.transition = 'opacity 0.3s ease'; // Faster fade for snapiness
      track.style.opacity = '1';
      setTimeout(() => {
        track.style.opacity = '0';
        setTimeout(resolve, 310); // Resolve right after fade
      }, duration);
    } else {
      track.style.transform = 'translateX(100vw)';
      track.style.width = 'auto';
      void track.offsetWidth;
      
      const endX = -track.scrollWidth;
      const totalDistance = track.scrollWidth + window.innerWidth;
      const scrollDuration = Math.round((totalDistance / 280) * 1000);
      
      track.style.opacity = '1';
      track.style.transition = `transform ${scrollDuration}ms linear`;
      track.style.transform = `translateX(${endX}px)`;
      
      setTimeout(resolve, scrollDuration + 100); // Tiny buffer, much snappier
    }
  });
}

async function setupS2(line) {
  noCount = 0;
  const eyes = document.getElementById('eyesWrap');
  const after = document.getElementById('s2After');
  
  // Hide everything initially
  eyes.style.display = 'none';
  eyes.style.opacity = '0';
  eyes.style.transform = 'translateY(20px)';
  after.style.display = 'none';
  after.classList.remove('show');
  
  document.getElementById('noMsg').classList.remove('show');
  document.getElementById('noMsg').textContent = '';
  const nb = document.getElementById('noBtn');
  nb.style.display = 'inline-block';
  nb.style.transform = '';

  const labels = { insta: 'Instagram handle', snap: 'Snapchat', phone: 'number' };
  const question = `Can I get your ${labels[want]}? 🌹`;

  // Step 1: Scroll the pick-up line
  await runTicker(line);

  // Step 2: Show "So..." (Stay for 1.4 seconds for better impact)
  await runTicker("So...", true, 1600);

  // Step 3: Scroll the question
  await runTicker(question);

  // Step 4: Show Buttons & Eyes
  eyes.style.display = 'flex';
  after.style.display = 'flex';
  void eyes.offsetWidth; // force reflow
  void after.offsetWidth;
  
  eyes.style.opacity = '1';
  eyes.style.transform = 'translateY(0)';
  after.classList.add('show');
}

function handleNo(){
  noCount++;
  const nb=document.getElementById('noBtn');
  
  // Pick a corner randomly but stay within visible bounds (especially with huge eyes)
  const corners = [
    {x: -33, y: -35}, // Top Left (closer to eyes)
    {x: 33, y: -35},  // Top Right (closer to eyes)
    {x: -35, y: -5},  // Mid-Bottom Left (safe from bottom edge)
    {x: 35, y: -5}    // Mid-Bottom Right (safe from bottom edge)
  ];
  const corner = corners[Math.floor(Math.random() * corners.length)];
  
  nb.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
  nb.style.transform = `translate(${corner.x}vw, ${corner.y}vh)`;
  const msg=document.getElementById('noMsg');
  msg.classList.remove('show');
  msg.textContent=noMsgs[Math.min(noCount-1,noMsgs.length-1)];
  void msg.offsetWidth;
  msg.classList.add('show');
  if(noCount>=4){nb.style.display='none'}
}

function goS3(){
  curtainWipe(()=>{
    setupS3();
    showScreen('s3');
  });
}

function setupS3(){
  const cfg={
    insta:{icon:'📸',title:'Drop your Instagram ✨',sub:"He promises to only slide into DMs respectfully",lbl:'Instagram handle',ph:'@yourhandle'},
    snap:{icon:'👻',title:'Your Snapchat, please 👻',sub:"He's not a bot, just a hopeless romantic",lbl:'Snapchat username',ph:'yourusername'},
    phone:{icon:'📱',title:'Drop your number ',sub:"He pinky-promises to text something sweet first",lbl:'Your phone number',ph:'+91 98765 43210'}
  };
  const c=cfg[want];
  document.getElementById('s3icon').textContent=c.icon;
  document.getElementById('s3title').textContent=c.title;
  document.getElementById('s3sub').textContent=c.sub;
  document.getElementById('s3lbl').textContent=c.lbl;
  document.getElementById('s3inp').placeholder=c.ph;
  document.getElementById('s3inp').value='';
  const card=document.getElementById('s3card');
  card.style.animation='none';void card.offsetWidth;
  card.style.animation='slideLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards';
}

function submitDetails(){
  const btn=document.getElementById('s3btn');
  btn.textContent='💌 Sending…';
  btn.disabled=true;
  
  // Confetti effect
  const rect=btn.getBoundingClientRect();
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  spawnConfetti(cx,cy,50);
  confRunning=true; animConf();

  setTimeout(()=>{
    curtainWipe(()=>{
      showGift();
    });
  }, 1000);
}

function setupS4(){
  const poemEl=document.getElementById('poemEl');
  poemEl.textContent='';
  document.getElementById('restartBtn').style.display='none';
  document.getElementById('restartBtn').style.opacity='0';
  const text=poems[want];
  typeS('poemEl', text, 40, () => {
    setTimeout(()=>{
      const rb=document.getElementById('restartBtn');
      rb.style.display='block';
      void rb.offsetWidth;
      rb.style.animation='fadeUp 0.7s ease forwards';
    },600);
  });
  
  // start continuous rain
  confetti=[];
  setTimeout(()=>{ animConf(); },300);
}

// ── NEW STAGES LOGIC ──

function typeS(id, text, speed, callback) {
  const el = document.getElementById(id);
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i] === '\\n' ? '\n' : text[i];
      if (el.style) el.style.whiteSpace = 'pre-line';
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }
  type();
}

function showGift() {
  showScreen('s-gift');
  typeS('giftText', 'I have a gift for you...', 60, () => {
    setTimeout(() => {
      curtainWipe(() => { showSinger(); });
    }, 1200);
  });
}

function showSinger() {
  showScreen('s-singer');
}

// ── PICKUP LIBRARY LOGIC (NEW) ──
const defaultPickups = [
  "I was going to wait for the perfect moment to say hi, but then I realized there’s no such thing.",
  "I have a good opening line, but it’s so terrible it might actually work. Want to hear it?",
  "I feel like we’ve been staring at each other for a while, so I figured I’d come over and officially introduce myself. Hi!",
  "You seem like you have excellent taste. What’s the best thing you’ve seen lately?",
  "If we were in a rom-com, this is where I’d say something witty. Since we’re not, I’ll just say hi.",
  "I’m playing a game of 'guess the favorite drink.' Can I buy you one and see if I’m right?",
  "My friends dared me to come over and say something interesting. I’m currently failing, but maybe you can save me?",
  "You look like the kind of person who has a really great story behind that style.",
  "I promise not to use a cheesy pickup line if you promise to at least hear me out.",
  "I couldn't help but notice you from over there and I wanted to come introduce myself.",
  "I love your energy! Where did you get that jacket? I've been looking for something like that.",
  "I’m new here—any recommendations on what I should be trying?",
  "Excuse me, I’m just trying to figure out if you’re as friendly as you look.",
  "I know this is random, but I just had to come over and tell you that you have a great vibe.",
  "I think you’re incredibly attractive and I’d regret it if I didn’t come over to say hi.",
  "Hi! What’s been the highlight of your day so far?",
  "You look like you’re having a great time. Mind if I join you for a bit?",
  "I'm a bit nervous approaching you, but I thought you were someone I really needed to meet.",
  "Is this seat taken? I’d love to have some company if you’re open to it.",
  "I was told to go talk to the most interesting person in the room. So, here I am."
];

let pickupLibrary = JSON.parse(localStorage.getItem('pickupLibrary')) || defaultPickups;

function toggleLibrary() {
  const sidebar = document.getElementById('pickupSidebar');
  sidebar.classList.toggle('active');
  if (sidebar.classList.contains('active')) renderPickups();
}

function renderPickups() {
  const container = document.getElementById('pickupList');
  const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  
  container.innerHTML = pickupLibrary.map((line, i) => `
    <div class="pickup-card" style="animation-delay: ${i * 0.05}s">
      <p>${line}</p>
      <div class="card-actions">
        <button class="copy-btn" onclick="copyPickup(${i}, this)" title="Copy to clipboard">
          ${copyIcon}
        </button>
      </div>
    </div>
  `).join('');
}

function copyPickup(idx, btn) {
  const text = pickupLibrary[idx];
  const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = checkIcon;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = copyIcon;
      btn.classList.remove('copied');
    }, 2000);
  });
}

function addPickup() {
  const input = document.getElementById('newPickupInp');
  const val = input.value.trim();
  if (!val) return;
  pickupLibrary.unshift(val);
  localStorage.setItem('pickupLibrary', JSON.stringify(pickupLibrary));
  input.value = '';
  renderPickups();
}

function selectSinger(name) {
  const audio = document.getElementById('bgSong');
  if (audio) {
    audio.currentTime = 0; // Start from beginning
    audio.play().catch(e => console.log("Audio play failed (maybe no file yet?):", e));
    
    // Transition ONLY when song finishes as requested
    audio.onended = () => {
      curtainWipe(() => {
        showScreen('s4');
        setupS4();
      });
    };
  }
  
  const responses = [
    `Excellent choice! I actually taught ${name} how to sing that high note... 😉`,
    `Oh, you have taste! But sorry, I already promised ${name} I wouldn't share their number...`,
    `${name}? You're definitely the GOAT for choosing them! 🐐`,
    `Ah, a person of culture! This song was actually written about you (at least in my head)...`
  ];
  const funny = responses[Math.floor(Math.random() * responses.length)];
  
  curtainWipe(() => {
    showScreen('s-funny');
    // Text removed as requested
  });
}

function restart(){
  confRunning=false;confetti=[];
  confCtx.clearRect(0,0,confC.width,confC.height);
  
  // Cleanup orientation & viewing state
  document.body.classList.remove('is-viewing');
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  curtainWipe(()=>{
    want='';noCount=0;
    document.getElementById('line').value='';
    document.querySelectorAll('.tog').forEach(t=>t.classList.remove('sel'));
    
    // Reset No Button
    const nb = document.getElementById('noBtn');
    nb.style.transform = '';
    nb.style.display = 'inline-block';
    
    showScreen('s1');
  });
}

window.addEventListener('pointermove', (e) => {
  if (currentScreen !== 's2') return;
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => {
    const rect = eye.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Angle from eye center to cursor
    const angle = Math.atan2(e.clientY - y, e.clientX - x);
    
    // Calculate distance from center, clamped to eye boundary
    const maxDist = 90; // Scaled for 5x eyes
    const dist = Math.min(maxDist, Math.hypot(e.clientX - x, e.clientY - y) / 6);
    
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    
    eye.style.setProperty('--px', `${px}px`);
    eye.style.setProperty('--py', `${py}px`);
  });
});
