import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Sport-Agnostic',
    emoji: '\u{1F3CB}',
    description: (
      <>
        Works for strength training, endurance, conditioning, and hybrid
        programs. 10 execution modes and 21 composable dimensions cover any
        training methodology.
      </>
    ),
  },
  {
    title: 'Machine-Readable',
    emoji: '{ }',
    description: (
      <>
        Valid JSON with a formal JSON Schema (2020-12). Includes a TypeScript
        types package and a CLI validator with 22 built-in rules.
      </>
    ),
  },
  {
    title: 'Extensible',
    emoji: '\u{1F50C}',
    description: (
      <>
        Namespaced extension mechanism for custom dimensions
        and fields. Add app-specific data without breaking compatibility.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{emoji}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
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
