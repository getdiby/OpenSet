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
  "type": "session",
  "name": "Upper Body Push",
  "blocks": [{
    "name": "Main Work",
    "series": [{
      "execution_mode": "SUPERSET",
      "exercises": [
        {
          "exercise_id": "bench_press",
          "sets": [{
            "execution_type": "reps_load",
            "reps": { "type": "fixed", "value": 5 },
            "load": { "type": "fixed", "value": 100, "unit": "kg" }
          }]
        },
        {
          "exercise_id": "bent_over_row",
          "sets": [{
            "execution_type": "reps_load",
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
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/spec/overview">
            Read the Spec
          </Link>
          <Link
            className="button button--secondary button--outline button--lg"
            style={{marginLeft: '1rem'}}
            to="/docs/tools/validator">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description="An open, sport-agnostic JSON standard for structured training">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.codeExample}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <Heading as="h2" className="text--center">
                  Simple, Structured JSON
                </Heading>
                <p className="text--center">
                  Describe any workout with a clear, validated schema.
                </p>
                <CodeBlock language="json" title="session.json">
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
