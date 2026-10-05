export const DEFAULTS = Object.freeze({
  ratio:'original', width:292, radius:28, ticket:true,
  preset:'pearl', primary:'#FFC9D8', secondary:'#F3E7BD', accent:'#C9B8EE', angle:200,
  pattern:'rosette', textureScale:38, textureOpacity:72, blend:'normal', emboss:true, customTexture:'',
  foil:100, glare:100, grain:100, tilt:10,
  title:'Luminary Club', subtitle:'Founding Member', holder:'Alex Chen', number:'0042', valid:'2028.09', textColor:'#1B3326', logo:'star', aurora:true
});
export const PRESETS = {
  pearl:{name:'珍珠', primary:'#FFC9D8', secondary:'#F3E7BD', accent:'#C9B8EE', angle:200},
  aurora:{name:'极光', primary:'#D9ACD5', secondary:'#A6F3D5', accent:'#94B9F3', angle:200},
  rose:{name:'玫瑰', primary:'#F8B9A6', secondary:'#F8D4AB', accent:'#D787B3', angle:200},
  abyss:{name:'深渊', primary:'#12254F', secondary:'#173956', accent:'#402A78', angle:200},
  graphite:{name:'石墨', primary:'#DBDBDB', secondary:'#A2A2A2', accent:'#616161', angle:200}
};
export const LIMITS = {width:[200,600],radius:[0,40],angle:[0,360],textureScale:[10,200],textureOpacity:[0,100],foil:[0,100],glare:[0,100],grain:[0,100],tilt:[0,18]};
const OPTIONS = {ratio:['original','credit','portrait','square','landscape'],preset:[...Object.keys(PRESETS),'custom'],pattern:['rosette','guilloche','rings','waves','grid','none','custom'],blend:['normal','overlay','soft-light','screen','multiply'],logo:['star','rings','none']};
export const RATIOS = {original:292/423, credit:85.6/53.98, portrait:2/3, square:1, landscape:4/3};
// 错误使用中文字段名；持久化与导入导出的字段、枚举值保持原格式。
const FIELD_LABELS = {ratio:'卡片比例',width:'宽度',radius:'圆角半径',ticket:'票券样式',preset:'配色预设',primary:'主色',secondary:'辅助色',accent:'点缀色',angle:'渐变角度',pattern:'纹理图案',textureScale:'纹理缩放',textureOpacity:'纹理不透明度',blend:'混合模式',emboss:'浮雕描边',customTexture:'自定义纹理',foil:'金属反光',glare:'高光',grain:'颗粒',tilt:'最大倾斜',title:'标题',subtitle:'副标题',holder:'持卡人',number:'编号',valid:'有效期',textColor:'文字颜色',logo:'标记',aurora:'极光背景'};
export function validateConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('请选择有效的卡片配置 JSON 文件。');
  if (input.version !== undefined && input.version !== 1) throw new Error('不支持此配置文件的版本。');
  const data = input.config ?? input;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('卡片配置格式无效。');
  if (!Object.keys(DEFAULTS).some(k => Object.hasOwn(data,k))) throw new Error('此文件中没有卡片配置。');
  const result = {...DEFAULTS};
  for (const [key,value] of Object.entries(data)) {
    if (!Object.hasOwn(DEFAULTS,key)) continue;
    if (LIMITS[key]) {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${FIELD_LABELS[key]}必须为有效数字。`);
      result[key] = Math.max(LIMITS[key][0],Math.min(LIMITS[key][1],Math.round(value)));
    } else if (OPTIONS[key]) {
      if (!OPTIONS[key].includes(value)) throw new Error(`${FIELD_LABELS[key]}选项无效。`);
      result[key] = value;
    } else if (typeof DEFAULTS[key] === 'boolean') {
      if (typeof value !== 'boolean') throw new Error(`${FIELD_LABELS[key]}必须为布尔值。`);
      result[key] = value;
    } else if (['primary','secondary','accent','textColor'].includes(key)) {
      if (!/^#[\da-f]{6}$/i.test(value)) throw new Error(`${FIELD_LABELS[key]}必须为六位十六进制颜色。`);
      result[key] = value.toUpperCase();
    } else if (key === 'customTexture') {
      if (typeof value !== 'string' || value.length > 4500000 || (value && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value))) throw new Error('纹理图片格式无效。');
      result[key] = value;
    } else {
      if (typeof value !== 'string') throw new Error(`${FIELD_LABELS[key]}必须为文本。`);
      result[key] = value.slice(0, key === 'title' ? 48 : key === 'subtitle' ? 64 : 40);
    }
  }
  if (result.pattern === 'custom' && !result.customTexture) result.pattern = 'rosette';
  return result;
}
export function exportConfig(config) { return JSON.stringify({version:1,config:validateConfig(config)},null,2); }
