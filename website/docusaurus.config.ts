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

  organizationName: 'openset',
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
          editUrl: 'https://github.com/openset/openset/tree/main/website/',
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
          href: 'https://github.com/openset/openset',
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
            {label: 'Execution Types', to: '/docs/spec/execution-types'},
            {label: 'Dimensions', to: '/docs/spec/dimensions'},
          ],
        },
        {
          title: 'Tools',
          items: [
            {label: 'Validator', to: '/docs/tools/validator'},
            {label: 'TypeScript Types', to: '/docs/tools/typescript-types'},
            {label: 'Conversion Tool', to: '/docs/tools/conversion'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/openset/openset'},
            {label: 'npm', href: 'https://www.npmjs.com/org/openset'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} OpenSet Contributors. Released under the MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
