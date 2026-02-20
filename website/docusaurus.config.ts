import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenSet',
  tagline: 'An open, sport-agnostic JSON standard for structured training',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://openset.dev',
  baseUrl: '/',

  organizationName: 'getdiby',
  projectName: 'openset',

  onBrokenLinks: 'throw',

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
          href: 'https://github.com/getdiby/openset',
          label: 'GitHub',
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
          ],
        },
        {
          title: 'Tools',
          items: [
            {label: 'Validator', to: '/docs/tools/validator'},
            {label: 'TypeScript Types', to: '/docs/tools/typescript-types'},
            {label: 'Code Generator', to: '/docs/tools/codegen'},
            {label: 'Conversion Tool', to: '/docs/tools/conversion'},
            {label: 'Online Converter', href: 'https://getdiby.com'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/getdiby/openset'},
            {label: 'npm', href: 'https://www.npmjs.com/org/openset'},
          ],
        },
        {
          title: 'Company',
          items: [
            {label: 'Diby', href: 'https://getdiby.com'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} OpenSet Contributors. Released under the MIT License.<br/>Built by <a href="https://getdiby.com" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; font-weight: 500;">Diby</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
