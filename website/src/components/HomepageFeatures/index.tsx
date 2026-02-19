import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Sport-Agnostic',
    description: (
      <>
        Works for strength training, endurance, conditioning, and hybrid
        programs. 10 execution modes and 16 execution types cover any
        training methodology.
      </>
    ),
  },
  {
    title: 'Machine-Readable',
    description: (
      <>
        Valid JSON with a formal JSON Schema (2020-12). Includes a TypeScript
        types package and a CLI validator with 22 built-in rules.
      </>
    ),
  },
  {
    title: 'Extensible',
    description: (
      <>
        Namespaced extension mechanism for custom dimensions, execution types,
        and fields. Add app-specific data without breaking compatibility.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
