import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  specSidebar: [
    'spec/overview',
    {
      type: 'category',
      label: 'Entities',
      link: { type: 'doc', id: 'spec/entities' },
      items: [
        { type: 'link', label: 'Program', href: '/docs/spec/entities#program' },
        { type: 'link', label: 'Phase', href: '/docs/spec/entities#phase' },
        { type: 'link', label: 'Workout', href: '/docs/spec/entities#workout' },
        { type: 'link', label: 'Block', href: '/docs/spec/entities#block' },
        { type: 'link', label: 'Series', href: '/docs/spec/entities#series' },
        { type: 'link', label: 'Exercise', href: '/docs/spec/entities#exercise' },
        { type: 'link', label: 'Set', href: '/docs/spec/entities#set' },
      ],
    },
    'spec/execution-modes',
    'spec/set-dimensions',
    'spec/value-types',
    {
      type: 'category',
      label: 'Libraries',
      items: [
        'spec/exercise-library',
        'spec/workout-library',
      ],
    },
    'spec/extensions',
    'spec/examples',
    {
      type: 'category',
      label: 'Execution',
      collapsed: false,
      items: [
        'spec/workout-execution',
      ],
    },
  ],
  toolsSidebar: [
    'tools/validator',
    'tools/typescript-types',
    'tools/codegen',
    'tools/conversion',
  ],
  faqSidebar: ['faq', 'contributors'],
};

export default sidebars;
