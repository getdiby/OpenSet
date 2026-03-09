import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const exampleJson = `{
  "openset_version": "1.0",
  "type": "workout",
  "name": "Upper Body Push",
  "blocks": [{
    "name": "Main Work",
    "series": [{
      "execution_mode": "SUPERSET",
      "exercises": [
        {
          "exercise_id": "bench_press",
          "sets": [{
            "dimensions": ["reps", "load"],
            "reps": { "type": "fixed", "value": 5 },
            "load": { "type": "fixed", "value": 100, "unit": "kg" }
          }]
        },
        {
          "exercise_id": "bent_over_row",
          "sets": [{
            "dimensions": ["reps", "load"],
            "reps": { "type": "range", "min": 8, "max": 10 },
            "load": { "type": "fixed", "value": 70, "unit": "kg" },
            "rpe": { "type": "fixed", "value": 8 }
          }]
        }
      ]
    }]
  }]
}`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.versionBadge}>v1.0 Specification</div>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className={styles.heroPrimary} to="/docs/spec/overview">
            Read the Spec
          </Link>
          <Link className={styles.heroSecondary} to="/docs/tools/validator">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Open JSON Standard for Workouts and Training Programs"
      description="OpenSet is an open, sport-agnostic JSON standard for structured workouts and training programs with JSON Schema, validation tools, and TypeScript support."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.codeExample}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <Heading as="h2" className={clsx('text--center', styles.codeExampleHeading)}>
                  Simple, Structured JSON
                </Heading>
                <p className={clsx('text--center', styles.codeExampleSubtext)}>
                  Describe any workout with a clear, validated schema.
                </p>
                <CodeBlock language="json" title="workout.json">
                  {exampleJson}
                </CodeBlock>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
