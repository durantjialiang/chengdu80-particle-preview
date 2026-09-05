import { globeNodes } from './network';
import { registration } from './navigation';
export type { CityNode } from './network';

export const siteContent = {
  hero: {
    eyebrow: 'AN 80-HOUR GLOBAL FINTECH HACKATHON',
    title: 'CHENGDU 80',
    year: '2026',
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
