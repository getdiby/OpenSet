import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenSet',
  tagline: 'An open, sport-agnostic JSON standard for structured training',
  favicon: 'img/favicon.ico',

  headTags: [
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png' } },
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon-16x16.png' } },
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' } },
    { tagName: 'link', attributes: { rel: 'manifest', href: '/img/site.webmanifest' } },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'OpenSet',
        url: 'https://openset.dev',
        logo: 'https://openset.dev/img/openset-og.png',
        sameAs: ['https://github.com/getdiby/openset'],
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'OpenSet',
        url: 'https://openset.dev',
      }),
    },
  ],

  future: {
    v4: true,
  },

  url: 'https://openset.dev',
  baseUrl: '/',

  organizationName: 'getdiby',
  projectName: 'openset',

  onBrokenLinks: 'throw',

  customFields: {
    /** When set (e.g. DOCUSAURUS_GATE_PASSWORD=secret), the whole site is behind a password gate; unlock is stored in localStorage. */
    gatePassword: process.env.DOCUSAURUS_GATE_PASSWORD ?? 'Kodelab2026',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/getdiby/openset/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      { name: 'description', content: 'Open, sport-agnostic JSON standard for structured training workouts and programs. Schema, validator, TypeScript types, and tools.' },
      { name: 'keywords', content: 'workout format, training data, JSON schema, exercise prescription, open standard, sports data, validator, TypeScript' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://openset.dev' },
      { property: 'og:title', content: 'OpenSet' },
      { property: 'og:description', content: 'Open, sport-agnostic JSON standard for structured training workouts and programs. Schema, validator, TypeScript types, and tools.' },
      { property: 'og:image', content: 'https://openset.dev/img/openset-og.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'OpenSet - Open JSON Standard for Workouts and Training Programs' },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenSet',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'specSidebar',
          position: 'left',
          label: 'Specification',
        },
        {
          type: 'docSidebar',
          sidebarId: 'toolsSidebar',
          position: 'left',
          label: 'Tools',
        },
        {
          type: 'docSidebar',
          sidebarId: 'faqSidebar',
          position: 'left',
          label: 'FAQ',
        },
        {
          type: 'custom-githubIcon',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Specification',
          items: [
            {label: 'Overview', to: '/docs/spec/overview'},
            {label: 'Dimensions', to: '/docs/spec/set-dimensions'},
            {label: 'FAQ', to: '/docs/faq'},
          ],
        },
        {
          title: 'Tools',
          items: [
            {label: 'Validator', to: '/docs/tools/validator'},
            {label: 'TypeScript Types', to: '/docs/tools/typescript-types'},
            {label: 'Code Generator', to: '/docs/tools/codegen'},
            {label: 'Conversion Tool', to: '/docs/tools/conversion'},
            {label: 'Online Converter', href: 'https://getdiby.com/openset'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Contributors', to: '/docs/contributors'},
            {label: 'Contact', href: 'mailto:hello@openset.dev'},
            {label: 'GitHub', href: 'https://github.com/getdiby/openset'},
            {label: 'npm', href: 'https://www.npmjs.com/org/diby'},
          ],
        },
        {
          title: 'Company',
          items: [
            {label: 'Diby', href: 'https://getdiby.com'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} OpenSet Contributors. Released under the MIT License.<br/><span class="footer__backed-by">Backed by</span> <a href="https://getdiby.com" target="_blank" rel="noopener noreferrer" class="footer__diby-logo" aria-label="Built by Diby"><img src="/img/diby-logo.png" alt="Diby" loading="lazy" /></a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
