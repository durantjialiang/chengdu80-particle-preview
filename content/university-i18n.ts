import type { Language } from './competition';
import type {
  University,
  UniversityId,
  RelationshipType,
} from './universities';

const names: Record<UniversityId, string> = {
  swufe: '西南财经大学',
  tsinghua: '清华大学',
  pku: '北京大学',
  sjtu: '上海交通大学',
  uestc: '电子科技大学',
  sustech: '南方科技大学',
  cqu: '重庆大学',
  hku: '香港大学',
  nus: '新加坡国立大学',
  berkeley: '加州大学伯克利分校',
  gatech: '佐治亚理工学院',
  toronto: '多伦多大学',
  queens: '女王大学',
  eth: '苏黎世联邦理工学院',
  uzh: '苏黎世大学',
  tau: '特拉维夫大学',
  emlyon: '法国里昂商学院',
  unsw: '新南威尔士大学',
};
const places: Record<string, string> = {
  Chengdu: '成都',
  Beijing: '北京',
  Shanghai: '上海',
  Shenzhen: '深圳',
  Chongqing: '重庆',
  'Hong Kong': '香港',
  Singapore: '新加坡',
  Berkeley: '伯克利',
  Atlanta: '亚特兰大',
  Toronto: '多伦多',
  Kingston: '金斯顿',
  Zurich: '苏黎世',
  'Tel Aviv': '特拉维夫',
  Lyon: '里昂',
  China: '中国',
  'China · Hong Kong SAR': '中国香港特别行政区',
  'United States': '美国',
  Canada: '加拿大',
  Switzerland: '瑞士',
  Israel: '以色列',
  France: '法国',
  Australia: '澳大利亚',
  Sydney: '悉尼',
};
export const universityName = (u: University, language: Language) =>
  language === 'zh' ? names[u.id] : u.name;
export const universityLocation = (u: University, language: Language) => {
  const local = (value: string) =>
    language === 'zh' ? (places[value] ?? value) : value;
  return u.city === u.country
    ? local(u.city)
    : `${local(u.city)} · ${local(u.country)}`;
};
const roles: Record<RelationshipType, [string, string]> = {
  organizer: ['Organizer', '主办高校'],
  winner: ['Award recipient', '获奖高校'],
  participant: ['Participant', '参赛高校'],
  ecosystem: ['Ecosystem exchange', '生态交流'],
};
export const universityRole = (role: RelationshipType, language: Language) =>
  roles[role][language === 'zh' ? 1 : 0];
export const recordNote = (u: University, language: Language) => {
  if (language !== 'zh') return u.recordNote;
  if (u.recordNoteZh) return u.recordNoteZh;
  if (u.id === 'swufe')
    return '成都汇聚点。西南财经大学为有据可查的主办方；这里的参赛年份指校队参赛，不代表全部主办年份。';
  return '当前资料覆盖部分历届记录，不代表完整参赛历史；未建档的奖项或项目不等于不存在。';
};
