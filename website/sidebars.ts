import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  specSidebar: [
    'spec/overview',
    'spec/document-hierarchy',
    'spec/execution-modes',
    'spec/execution-types',
    'spec/value-types',
    'spec/dimensions',
    'spec/exercise-library',
    'spec/extensions',
    'spec/examples',
  ],
  toolsSidebar: [
    'tools/validator',
    'tools/typescript-types',
    'tools/conversion',
  ],
};

export default sidebars;
