import { currentCompetition } from './competition';
import siteRoutes from './site-routes.json';

// Keep future navigation labels without publishing links to unfinished routes.
export const navigationReady = (href: string) => href === '/global-network' || siteRoutes.some(route => route.path === href + '/');

export const navigation = [
  {
    label: 'About',
    href: '/about',
    description: 'The story behind Chengdu 80.',
  },
  {
    label: 'Competition',
    href: '/competition',
    description: 'From a challenge to a working product.',
  },
  {
    label: 'History',
    href: '/history',
    description: 'Explore the editions since 2018.',
  },
  {
    label: 'Projects & Awards',
    href: '/winners',
    description: 'Discover the teams behind the ideas.',
  },
  {
    label: 'Global Network',
    href: '/global-network',
    description: 'University innovation across borders.',
  },
  {
    label: 'Partners & Impact',
    href: '/partners',
    description: 'Historical collaboration and industry connections.',
  },
] as const;

export const registration = {
  label: '2026 Competition',
  // This is an informative destination, never a non-functional registration button.
  href: '/competition#join',
  applicationUrl: null as string | null,
  status: 'Details to be announced',
  compactStatus: 'DETAILS TO FOLLOW',
  description: currentCompetition.dateLabel.en + ' Eligibility and application arrangements will be published when confirmed.',
} as const;
