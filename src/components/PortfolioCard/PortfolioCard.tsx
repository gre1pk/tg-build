import type { FC } from 'react';

import type { PortfolioItem } from '@/data/mock/portfolio';
import { classNames } from '@/css/classnames';

import styles from './PortfolioCard.module.scss';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export const PortfolioCard: FC<PortfolioCardProps> = ({ item }) => {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{item.title}</h3>
      <div className={styles.compare}>
        <figure className={styles.shot}>
          <img
            src={item.beforeImageUrl}
            alt={`${item.title} — до перетяжки`}
            className={styles.image}
            loading="lazy"
            width={160}
            height={120}
          />
          <figcaption className={styles.label}>До</figcaption>
        </figure>
        <figure className={styles.shot}>
          <img
            src={item.afterImageUrl}
            alt={`${item.title} — после перетяжки`}
            className={styles.image}
            loading="lazy"
            width={160}
            height={120}
          />
          <figcaption className={classNames(styles.label, styles.labelAfter)}>После</figcaption>
        </figure>
      </div>
      <p className={styles.fabric}>Ткань: {item.fabricName}</p>
    </article>
  );
};
