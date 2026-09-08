import { globeNodes } from './network';
import { registration } from './navigation';
import { bilingual as b, currentCompetition } from './competition';
export type { CityNode } from './network';

export const siteContent = {
  hero: {
    identityLinks: {
      swufe: {
        url: 'https://www.swufe.edu.cn/',
        label: b(
          'SWUFE official website (opens in a new tab)',
          'SWUFE · 西南财经大学官网（在新标签页打开）',
        ),
      },
      fic: {
        url: 'https://fic.swufe.edu.cn/',
        label: b(
          'FIC official website (opens in a new tab)',
          'FIC · 金融科技国际联合实验室官网（在新标签页打开）',
        ),
      },
    },
    eyebrow: 'AN 80-HOUR GLOBAL FINTECH HACKATHON',
    title: 'CHENGDU 80',
    year: String(currentCompetition.year),
    tagline: 'Build the Future of Finance.',
    competitionName: [
      'Chengdu 80 Global FinTech',
      'Product Design & Development Competition',
    ],
    primaryCta: {
      label: registration.label,
      url: registration.href,
    },
    secondaryCta: {
      label: 'View Past Winners',
      url: '/winners',
    },
    registration: {
      label: '2026 REGISTRATION',
      status: registration.compactStatus,
    },
    scrollPrompt: 'Scroll to Explore',
  },
  cities: globeNodes,

  // Replace with organizer-verified figures before production launch.
  // The previous 8+, 50+, and 1,000+ placeholders are not published.
  statistics: [] as {
    value: number;
    suffix: string;
    label: string;
    sourceUrl: string;
  }[],
} as const;
