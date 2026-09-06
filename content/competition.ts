export type Language = 'en' | 'zh';
export type Localized = { en: string; zh: string };
export const bilingual = (en: string, zh: string): Localized => ({ en, zh });

// Project-owner supplied in the next-stage brief, 2026-09-06.
// This is NOT a public announcement or a verified organizer release.
export const currentCompetition = {
  year: 2026, edition: null, status: 'upcoming', datePrecision: 'month', month: 10,
  startDate: null, endDate: null, timeZone: 'Asia/Shanghai',
  registrationStatus: 'unannounced', applicationUrl: null, eligibility: null,
  venue: null, challenge: null, contact: null,
  sourceRefs: ['project-owner-next-stage-2026-09-06'],
  confirmationStatus: 'project-owner-supplied',
  dateLabel: bilingual('October 2026. Exact dates to be announced.', '2026年10月，具体日期待公布。'),
  registrationLabel: bilingual('Application arrangements have not been announced.', '报名安排尚未公布。'),
} as const;
export const year2025 = {
  year: 2025, edition: null, status: 'not-held',
  sourceRefs: ['project-owner-next-stage-2026-09-06'],
  confirmationStatus: 'project-owner-supplied',
} as const;
export const historicalFormat = [
  bilingual('Challenge release', '赛题发布'), bilingual('80-hour development', '80小时集中开发'),
  bilingual('Prototype submission', '原型提交'), bilingual('Demo & defence', '展示与答辩'),
  bilingual('Judging & awards', '评审与获奖结果'),
];
export const faqCategories = [
  { id: 'entry', title: bilingual('Entry & teams', '参赛与组队') },
  { id: 'format', title: bilingual('Format & materials', '赛制与材料') },
  { id: 'travel', title: bilingual('Dates, venue & travel', '时间地点与出行') },
  { id: 'contact', title: bilingual('Contact & resources', '联系与资料') },
];
export const faqs = [
  { id: 'eligibility', category: 'entry', question: bilingual('Who can enter, and how do we apply?', '哪些人可以参加？如何报名？'), answer: bilingual('2026 eligibility and the invitation or open-application process have not been announced. An application link will appear on this page only when confirmed.', '2026参赛资格，以及高校邀请或开放申请方式尚未公布。确认后的正式报名入口将在本页提供。') },
  { id: 'teams', category: 'entry', question: bilingual('How should we form a team?', '如何组队？是否需要带队老师？'), answer: bilingual('Team size, cross-university teams and adviser requirements for 2026 are not yet confirmed. Do not rely on previous editions’ rules.', '2026队伍人数、跨校组队与带队要求尚待确认。请勿直接沿用往届规则。') },
  { id: 'requirements', category: 'format', question: bilingual('What are the challenge, languages and deliverables?', '赛题、开发与展示语言、提交材料是什么？'), answer: bilingual('The 2026 challenge, technical environment, support, presentation language and submission requirements are to be announced with the official rules.', '2026赛题、技术环境与支持、展示语言及提交材料要求，将随正式规则公布。') },
  { id: 'eighty-hours', category: 'format', question: bilingual('What does “80 hours” refer to?', '“80小时”指什么？'), answer: bilingual('It describes the concentrated development period in the historical format, not travel or the entire event programme. The 2026 schedule and rules remain to be confirmed.', '它指历史赛制中的集中开发时段，并不包括出行，也不等同于整个活动的总时长。2026完整日程与规则仍待确认。') },
  { id: 'dates', category: 'travel', question: bilingual('When and where is the 2026 competition?', '2026年比赛何时、何地举行？'), answer: currentCompetition.dateLabel, note: bilingual('Month supplied by the project owner. The venue and exact dates are awaiting an official announcement.', '月份由项目负责人提供。场地与具体日期待正式公布。') },
  { id: 'costs', category: 'travel', question: bilingual('Are travel, accommodation and participation costs covered?', '差旅、住宿与参赛费用如何安排？'), answer: bilingual('2026 funding, fees and accommodation arrangements have not been confirmed. No reimbursement or fee waiver is promised by this preview.', '2026资助、费用及住宿安排尚未确认。本预览不作报销或费用减免承诺。') },
  { id: 'updates', category: 'contact', question: bilingual('Where can I find updates, rules and a contact?', '在哪里查看更新、规则和联系方式？'), answer: bilingual('This competition page is the update location. No current consultation address or approved 2026 download has been supplied yet. Historical contact details are not presented as current contacts.', '本赛事信息页将作为更新入口。目前尚未提供有效的本届咨询渠道或获准公开的2026资料。往届联系方式不作为本届联系人展示。') },
];
// Only add a download after verifying both the actual file and publication rights.
export const approvedDownloads: { title: Localized; language: string; version: string; date: string; year: number; url: string }[] = [];
