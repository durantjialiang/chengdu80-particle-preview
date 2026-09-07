import { bilingual as b } from './competition';

// Editorial/export-only checklist. Do not import into public page modules.
export const schoolRequests = [
  {
    id: 'edition',
    title: b('2026 competition', '2026当届赛事'),
    text: b(
      'Confirmed organizing roles, exact dates and venue, entry process, team eligibility, judging, awards and deliverables.',
      '正式主办、承办与协办名单，准确日期地点，邀请或报名机制，队伍条件，评审、奖项及交付要求。',
    ),
  },
  {
    id: 'international',
    title: b('International participation', '国际参与'),
    text: b(
      'Working language, travel and accommodation, costs, on-site arrangements and a current consultation contact.',
      '工作语言、交通住宿、费用支持、来华与现场安排，以及有效咨询人和邮箱。',
    ),
  },
  {
    id: 'people',
    title: b('People', '赛事人物'),
    text: b(
      'Confirmed current committee, judges and mentors; dated roles, approved portraits and biographies.',
      '本届委员会、评委与导师确认名单，准确职务、获准公开的肖像与简介。',
    ),
  },
  {
    id: 'industry',
    title: b('Industry & incubation', '产业与孵化'),
    text: b(
      'Current Jiaozi and industry participation, incubator operating status and publishable follow-up projects or collaboration cases.',
      '交子及产业单位的当届参与方式，孵化器实际运行情况，可公开的项目进展与对接案例。',
    ),
  },
  {
    id: 'media',
    title: b('Project images & media', '作品与媒体素材'),
    text: b(
      'Project-matched screenshots and demo footage with rights clearance; high-resolution event photos, interviews and usage scope.',
      '能够对应具体作品的产品界面图与演示视频及使用授权；高清现场照片、访谈与使用范围。',
    ),
  },
  {
    id: 'operations',
    title: b('Ongoing updates', '持续运营'),
    text: b(
      'Official contact channels, public social accounts, editorial owner and publication process.',
      '官方联系渠道、公众号等有效账号，以及内容更新负责人和发布流程。',
    ),
  },
];
