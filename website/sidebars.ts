import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  specSidebar: [
    'spec/overview',
    'spec/document-hierarchy',
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
  ],
  toolsSidebar: [
    'tools/validator',
    'tools/typescript-types',
    'tools/codegen',
    'tools/conversion',
  ],
};

export default sidebars;
