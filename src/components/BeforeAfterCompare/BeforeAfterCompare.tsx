import type { FC } from 'react';

import { classNames } from '@/css/classnames';

import styles from './BeforeAfterCompare.module.scss';

export type BeforeAfterVariant = 'hero' | 'featured' | 'compact';

interface BeforeAfterCompareProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeAlt: string;
  afterAlt: string;
  variant?: BeforeAfterVariant;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const BeforeAfterCompare: FC<BeforeAfterCompareProps> = ({
  beforeImageUrl,
  afterImageUrl,
  beforeAlt,
  afterAlt,
  variant = 'featured',
  className,
  imageWidth = 400,
  imageHeight = 300,
}) => {
  return (
    <div
      className={classNames(styles.compare, styles[variant], className)}
      role="group"
      aria-label="Сравнение до и после перетяжки"
    >
      <figure className={styles.shot}>
        <img
          src={beforeImageUrl}
          alt={beforeAlt}
          className={styles.image}
          width={imageWidth}
          height={imageHeight}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
        />
        <figcaption className={styles.label}>До</figcaption>
      </figure>
      <figure className={styles.shot}>
        <img
          src={afterImageUrl}
          alt={afterAlt}
          className={styles.image}
          width={imageWidth}
          height={imageHeight}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
        />
        <figcaption className={classNames(styles.label, styles.labelAfter)}>После</figcaption>
      </figure>
    </div>
  );
};
