import {useState, useEffect, type ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import {PiPlugs, PiPlugsConnected} from 'react-icons/pi';
import {TbShirtSport} from 'react-icons/tb';
import {
  MdSportsGymnastics,
  MdSportsKabaddi,
  MdSportsHockey,
  MdOutlineSportsTennis,
  MdOutlineSportsFootball,
  MdOutlineSportsBasketball,
} from 'react-icons/md';
import {VscJson} from 'react-icons/vsc';
import type {IconType} from 'react-icons';
import styles from './styles.module.css';

const ROTATE_INTERVAL_MS = 2500;

const SPORT_ICONS: IconType[] = [
  TbShirtSport,
  MdSportsGymnastics,
  MdSportsKabaddi,
  MdOutlineSportsTennis,
  MdOutlineSportsFootball,
  MdOutlineSportsBasketball,
  MdSportsHockey,
];

function SportAgnosticIcon(): ReactNode {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SPORT_ICONS.length),
      ROTATE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);
  const Icon = SPORT_ICONS[index];
  return (
    <span className={styles.featureIconSvg}>
      <Icon size={40} aria-hidden />
    </span>
  );
}

function ExtensibleIcon(): ReactNode {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setConnected((c) => !c), ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
  const Icon = connected ? PiPlugsConnected : PiPlugs;
  return (
    <span className={styles.featureIconSvg}>
      <Icon size={40} aria-hidden />
    </span>
  );
}

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Sport-Agnostic',
    icon: <SportAgnosticIcon />,
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
    icon: (
      <span className={styles.featureIconSvg}>
        <VscJson size={40} aria-hidden />
      </span>
    ),
    description: (
      <>
        Valid JSON with a formal JSON Schema (2020-12). Includes a TypeScript
        types package and a CLI validator with 22 built-in rules.
      </>
    ),
  },
  {
    title: 'Extensible',
    icon: <ExtensibleIcon />,
    description: (
      <>
        Namespaced extension mechanism for custom dimensions
        and fields. Add app-specific data without breaking compatibility.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
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
