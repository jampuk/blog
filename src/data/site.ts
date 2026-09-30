const siteUrl = (
  import.meta.env.PUBLIC_SITE_URL?.trim() || 'https://read.jampuk.com'
).replace(/\/+$/, '');

const websiteUrl = (
  import.meta.env.PUBLIC_WEBSITE_URL?.trim() || 'https://www.jampuk.com'
).replace(/\/+$/, '');

export const SITE = {
  name: 'Jampuk Read',
  parentName: 'Jampuk Intelligence',
  url: siteUrl,
  websiteUrl,
  locale: 'en_US',
  description:
    'Jampuk Read - field notes on secure, compliant, production-grade AI systems, LLM orchestration, and agentic pipelines. Principal-led, async-first.',
  ogImage: '/images/og-image.jpg',
  // Twitter/X handle used for `twitter:site` / `twitter:creator` attribution.
  // Left empty until the company account exists.
  twitter: '',
  sameAs: [
    'https://www.linkedin.com/company/jampuk',
    'https://github.com/jampuk',
  ],
  volume: '01',
  company: {
    name: 'Jampuk Intelligence Systems',
    ssmRegistrationNo: '202603223177',
    jurisdiction: 'Malaysia',
  },
  email: 'hi@jampuk.com',
  author: {
    name: 'Hafiz Zainudin',
    jobTitle: 'AI Steward & Systems Architect',
    bio: "Hafiz has founded tech ventures, scaled cloud platforms, and advised teams through every hype cycle since long before the LLM wave. Today he architects Jampuk's agentic grid, pairing hands-on engineering with a founder's bias for shipping and a steward's sense of responsibility.",
    profileUrl: 'https://www.jampuk.com/principal-profile',
    linkedinUrl: 'https://www.linkedin.com/in/hafiz-zainudin',
    mastodonUrl: 'https://fosstodon.org/@techconsulnerd',
  },
} as const;

export const SITE_NAME = SITE.name;
