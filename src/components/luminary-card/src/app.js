import {DEFAULTS,PRESETS,LIMITS,RATIOS,validateConfig,exportConfig} from './config.js';
import {createCardMotion} from './motion.js';
import {t as createAurora} from './aurora.js';

// Queries and events stay within one React-owned shadow root. The upstream
// controls build only static markup; all user content is rendered with textContent.
export function mountLuminaryCard(root) {
const $=s=>root.querySelector(s), STORAGE='uimodel:luminary-card:v1';
const events=new AbortController(), urls=new Set(), exportTimers=new Set();
let disposed=false, sweepAnimation;
const listen=(target,type,handler)=>target.addEventListener(type,handler,{signal:events.signal});
let config={...DEFAULTS}, storageError=false;
try{const saved=localStorage.getItem(STORAGE);if(saved)config=validateConfig(JSON.parse(saved));}catch{storageError=true;}
const form=$('#controls'), card=$('.card'), scene=$('.scene');
const uploadIcon='<svg viewBox="0 0 24 24"><path d="M12 15V3m-5 5 5-5 5 5M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select=(key,label,options)=>`<div class="field-row"><label for="${key}">${label}</label><select id="${key}" name="${key}">${Object.entries(options).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`;
const range=(key,label,unit)=>`<div class="range-field"><div class="range-label"><label for="${key}">${label}</label><output for="${key}" data-unit="${unit}"></output></div><input id="${key}" name="${key}" type="range" min="${LIMITS[key][0]}" max="${LIMITS[key][1]}" step="1"></div>`;
const toggle=(key,label,hint='')=>`<label class="toggle-row" for="${key}"><span class="toggle-copy">${label}${hint?`<small>${hint}</small>`:''}</span><input class="switch" id="${key}" name="${key}" type="checkbox" role="switch"></label>`;
const color=(key,label)=>`<div class="field-row"><label for="${key}-hex">${label}</label><div class="color-pair"><input type="color" name="${key}" aria-label="${label}选色器"><input type="text" id="${key}-hex" data-color="${key}" aria-label="${label}十六进制色值" maxlength="7" spellcheck="false"></div></div>`;
const textField=(key,label,max=40)=>`<div class="text-field"><label for="${key}">${label}</label><input type="text" id="${key}" name="${key}" maxlength="${max}" spellcheck="false"></div>`;
const section=(name,content)=>`<details class="control-section" open><summary>${name}</summary><div class="section-body">${content}</div></details>`;
form.innerHTML=
  section('卡片',select('ratio','比例',{original:'原始比例 · 292:423',credit:'信用卡 · 85.6:53.98',portrait:'竖向 · 2:3',square:'正方形 · 1:1',landscape:'横向 · 4:3'})+range('width','宽度','px')+range('radius','圆角半径','px')+toggle('ticket','票券样式','侧边打孔与撕裂线'))+
  section('配色',`<div class="preset-list" role="group" aria-label="配色预设">${Object.entries(PRESETS).map(([id,p])=>`<button type="button" class="preset-button" data-preset="${id}" aria-pressed="false"><span class="preset-swatch" style="--swatch:linear-gradient(135deg,${p.primary},${p.secondary} 55%,${p.accent})"></span><span>${p.name}</span></button>`).join('')}</div>`+color('primary','主色')+color('secondary','辅助色')+color('accent','点缀色')+range('angle','渐变角度','°'))+
  section('纹理',select('pattern','图案',{rosette:'花饰',guilloche:'玑镂纹',rings:'同心圆',waves:'波纹',grid:'网格',none:'无',custom:'自定义图片'})+`<button type="button" class="upload" id="upload">${uploadIcon}<span>上传图片…</span></button><p class="help">推荐使用无缝纹理，最大 3 MB。</p>`+range('textureScale','缩放','%')+range('textureOpacity','不透明度','%')+select('blend','混合模式',{normal:'正常',overlay:'叠加','soft-light':'柔光',screen:'滤色',multiply:'正片叠底'})+toggle('emboss','浮雕描边'))+
  section('光照',range('foil','金属反光','%')+range('glare','高光','%')+range('grain','颗粒','%')+range('tilt','最大倾斜','°'))+
  section('内容',textField('title','标题',48)+textField('subtitle','副标题',64)+textField('holder','持卡人')+`<div class="two-fields">${textField('number','编号')}${textField('valid','有效期')}</div>`+color('textColor','文字颜色')+`<div class="field-row"><label>标记</label><div class="segments" role="group" aria-label="标记">${Object.entries({star:'星形',rings:'双环',none:'无'}).map(([key,label])=>`<button type="button" data-logo="${key}" aria-pressed="false">${label}</button>`).join('')}</div></div>`)+
  section('场景',toggle('aurora','极光背景','卡片背后的动态光效'));
listen(form,'submit',e=>e.preventDefault());

let disposeAurora, auroraEnabled, toastTimer, saveTimer;
function toast(message){$('.toast').textContent=message;$('.toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('visible'),3200);}
function save(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(config));$('#save-status').textContent='实时预览 · 自动保存到本地';}catch{$('#save-status').textContent='存储已满 · 请导出配置保存';toast('浏览器存储已满，请导出配置以保存卡片。');}},120);}
function syncControls(){
  for(const el of form.querySelectorAll('[name]')){
    if(el.type==='checkbox')el.checked=config[el.name];else el.value=config[el.name];
    if(el.type==='range'){
      const out=form.querySelector(`output[for="${el.name}"]`);
      out.value=config[el.name]+out.dataset.unit;
      el.style.setProperty('--fill',`${(config[el.name]-Number(el.min))/(Number(el.max)-Number(el.min))*100}%`);
    }
  }
  for(const el of form.querySelectorAll('[data-color]'))if(el!==root.activeElement)el.value=config[el.dataset.color];
  form.querySelectorAll('[data-preset]').forEach(el=>el.setAttribute('aria-pressed',String(config.preset===el.dataset.preset)));
  form.querySelectorAll('[data-logo]').forEach(el=>el.setAttribute('aria-pressed',String(config.logo===el.dataset.logo)));
  $('#upload span').textContent=config.customTexture?'替换图片…':'上传图片…';
}
const hexToRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function mix(a,b,t){const x=hexToRgb(a),y=hexToRgb(b);return '#'+x.map((v,i)=>Math.round(v*(1-t)+y[i]*t).toString(16).padStart(2,'0')).join('');}
function gradient(){
  const p=config.primary,s=config.secondary,a=config.accent;
  // The original Elyx spectrum remains underneath the editable pearl palette.
  const spectrum=config.preset==='pearl'||config.preset==='custom';
  const stops=spectrum?[mix(a,'#6c1d9f',.45),mix(p,'#ff3030',.55),mix(s,'#ffbd2e',.5),mix(s,'#ffffff',.8),'#ffffff','#eafff5','#b9ffed',mix(a,'#edb6e9',.35),mix(a,'#4028b0',.55),'#0027ff99']:[mix(a,'#000000',.25),p,s,mix(s,'#ffffff',.3),mix(s,'#ffffff',.7),s,mix(s,a,.25),a,mix(a,'#000000',.15),mix(a,'#000000',.4)];
  const positions=[0,16,25,32,43,51,57,69,83,100];
  return `radial-gradient(ellipse 65% 38% at 0% 0%,${spectrum?mix(s,'#ffdb89',.7):s},transparent),radial-gradient(ellipse 70% 60% at 100% 100%,${spectrum?'#00b7ff99':a+'99'},transparent),radial-gradient(ellipse 70% 60% at 100% 85%,${spectrum?'#00ff9355':s+'55'},transparent),linear-gradient(var(--rainbow-angle),${stops.map((c,i)=>`${c} calc(${positions[i]}% + var(--rainbow-shift))`).join(',')})`;
}
const svgURL=body=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><g fill="none" stroke="white" stroke-width=".8">${body}</g></svg>`)}")`;
const patterns={
  rosette:`url("${new URL('../assets/rosette.png',import.meta.url).href}")`,guilloche:`url("${new URL('../assets/foil.webp',import.meta.url).href}")`,
  rings:svgURL(Array.from({length:18},(_,i)=>`<circle cx="50" cy="50" r="${(i+1)*4}"/>`).join('')),
  waves:svgURL(Array.from({length:24},(_,i)=>`<path d="M-25 ${i*6-35}Q0 ${i*6-10}25 ${i*6-35}T75 ${i*6-35}T125 ${i*6-35}"/>`).join('')),
  grid:svgURL(Array.from({length:20},(_,i)=>`<path d="M${i*5} 0v100M0 ${i*5}h100"/>`).join('')),
  none:'none'
};
function fitCard(){
  const rect=scene.getBoundingClientRect(),ratio=RATIOS[config.ratio];
  const w=Math.min(config.width,rect.width-56,(rect.height-56)*ratio);
  $('.card-target').style.setProperty('--card-width',`${Math.max(80,w)}px`);
  const scale=w/292;
  card.style.setProperty('--card-radius',`${config.radius*scale}px`);
}
function render(){
  const styles={ '--primary':config.primary,'--card-colors':gradient(),'--card-ratio':RATIOS[config.ratio], '--texture-size':`${55.46*config.textureScale/38}px`, '--texture-opacity':config.textureOpacity/100,'--texture-blend':config.blend,'--emboss':config.emboss&&config.pattern==='rosette'?1:0,'--foil-strength':config.foil/100,'--glare-strength':config.glare/100,'--grain-strength':config.grain/100,'--text-color':config.textColor,
    '--texture':config.pattern==='custom'?`url("${config.customTexture}")`:patterns[config.pattern],
    '--card-mask':config.ticket?'radial-gradient(circle 12px at 0% 66%,transparent 98%,#000) 0 0 / 51% 100% no-repeat,radial-gradient(circle 12px at 100% 66%,transparent 98%,#000) 100% 0 / 51% 100% no-repeat':'none'
  };
  for(const [k,v]of Object.entries(styles))card.style.setProperty(k,v);
  card.dataset.wide=String(RATIOS[config.ratio]>=1);
  $('.tear-line').hidden=!config.ticket;
  const title=$('#card-title');title.textContent=config.title;
  // Keep long user titles within the original title area without changing default metrics.
  title.style.fontSize=config.title.length>22?`${Math.max(5.3,11.65*22/config.title.length)}cqw`:'';
  $('#card-subtitle').textContent=config.subtitle;
  $('#card-holder').textContent=config.holder;$('#card-number').textContent=config.number;$('#card-valid').textContent=config.valid;
  card.setAttribute('aria-label',`${config.title} 会员卡。移动鼠标或使用方向键调整倾斜。`);
  $('.card-logo').style.display=config.logo==='none'?'none':'';
  $('.card-logo .star').style.display=config.logo==='star'?'block':'none';
  $('.card-logo .rings').style.display=config.logo==='rings'?'block':'none';
  $('.card-logo').style.color=mix(config.textColor,'#48c9a3',.6);
  scene.dataset.aurora=String(config.aurora);
  if(auroraEnabled!==config.aurora){disposeAurora?.();disposeAurora=null;auroraEnabled=config.aurora;if(config.aurora)disposeAurora=createAurora($('#aurora-canvas'),{placement:'bottom'});}
  syncControls();fitCard();motion.refresh();
}
const motion=createCardMotion($('.card-target'),card,()=>config,root);
function setValue(key,value){config={...config,[key]:value};if(['primary','secondary','accent'].includes(key))config.preset='custom';render();save();}
listen(form,'input',e=>{
  const el=e.target;
  if(el.dataset.color){
    if(/^#[\da-f]{6}$/i.test(el.value)){el.setCustomValidity('');setValue(el.dataset.color,el.value.toUpperCase());}
    else el.setCustomValidity('请输入六位十六进制颜色，例如 #FFC9D8。');
    return;
  }
  if(!el.name)return;
  if(el.name==='pattern'&&el.value==='custom'&&!config.customTexture){el.value=config.pattern;$('#texture-file').click();return;}
  setValue(el.name,el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value);
});
listen(form,'focusout',e=>{if(e.target.dataset.color){e.target.value=config[e.target.dataset.color];e.target.setCustomValidity('');}});
function sweep(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;sweepAnimation?.cancel();sweepAnimation=$('.card-sweep').animate([{transform:'translateX(-70%)',opacity:0},{opacity:.65,offset:.35},{opacity:.45,offset:.65},{transform:'translateX(70%)',opacity:0}],{duration:600,easing:'linear'});}
listen(form,'click',e=>{
  const preset=e.target.closest('[data-preset]'),logo=e.target.closest('[data-logo]');
  if(preset){const {name,...colors}=PRESETS[preset.dataset.preset];config={...config,...colors,preset:preset.dataset.preset};render();save();sweep();}
  if(logo)setValue('logo',logo.dataset.logo);
});
listen($('#upload'),'click',()=>$('#texture-file').click());
listen($('#texture-file'),'change',async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  if(file.size>3*1024*1024){toast('纹理图片不能超过 3 MB。');return;}
  if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)){toast('请选择 PNG、JPEG、WebP 或 SVG 图片。');return;}
  const url=URL.createObjectURL(file);urls.add(url);
  try{
    const image=new Image();image.src=url;await image.decode();if(disposed)return;
    const canvas=document.createElement('canvas');const scale=Math.min(1,1024/Math.max(image.width,image.height));
    canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    config={...config,pattern:'custom',customTexture:canvas.toDataURL('image/png')};render();save();toast('纹理已更新。');
  }catch{if(!disposed)toast('无法读取此图片，请尝试 PNG 或 JPEG 格式。');}finally{URL.revokeObjectURL(url);urls.delete(url);}
});
listen($('#reset'),'click',()=>{config={...DEFAULTS};motion.reset();render();save();sweep();toast('已恢复默认配置。');});
listen($('#export'),'click',()=>{
  const blob=new Blob([exportConfig(config)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  urls.add(url);a.href=url;a.download='luminary-card.json';a.click();
  const timer=setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);exportTimers.delete(timer);},1000);exportTimers.add(timer);toast('配置已导出。');
});
listen($('#import'),'click',()=>$('#import-file').click());
listen($('#import-file'),'change',async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  if(file.size>5*1024*1024){toast('配置文件不能超过 5 MB。');return;}
  try{const next=validateConfig(JSON.parse(await file.text()));if(disposed)return;config=next;render();save();sweep();toast('配置已导入。');}catch(err){if(!disposed)toast(err instanceof SyntaxError?'此文件不是有效的 JSON。':err.message);}
});
const resize=new ResizeObserver(fitCard);resize.observe(scene);
render();if(storageError)toast('无法读取已保存的配置，已加载默认卡片。');
// React StrictMode remounts effects; each instance must release its own resources.
return ()=>{
  disposed=true;events.abort();resize.disconnect();motion.destroy();disposeAurora?.();
  clearTimeout(toastTimer);clearTimeout(saveTimer);for(const timer of exportTimers)clearTimeout(timer);sweepAnimation?.cancel();
  for(const url of urls)URL.revokeObjectURL(url);urls.clear();
};
}
