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
    label: 'Winners',
    href: '/winners',
    description: 'Discover the teams behind the ideas.',
  },
  {
    label: 'Global Network',
    href: '/global-network',
    description: 'University innovation across borders.',
  },
  {
    label: 'Partners',
    href: '/partners',
    description: 'The organisations behind the next edition.',
  },
] as const;

export const registration = {
  label: 'Join the Challenge',
  // This is an informative destination, never a non-functional registration button.
  href: '/competition#join',
  applicationUrl: null as string | null,
  status: 'Details to be announced',
  compactStatus: 'DETAILS TO FOLLOW',
  description:
    'Confirmed dates, eligibility, and the official application link will be published here when available.',
} as const;
