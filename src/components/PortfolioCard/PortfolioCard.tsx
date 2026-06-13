import type { FC } from 'react';

import { BeforeAfterCompare } from '@/components/BeforeAfterCompare/BeforeAfterCompare';
import type { PortfolioItem } from '@/data/types';
import { classNames } from '@/css/classnames';

import styles from './PortfolioCard.module.scss';

interface PortfolioCardProps {
  item: PortfolioItem;
  variant?: 'featured' | 'compact';
}

export const PortfolioCard: FC<PortfolioCardProps> = ({ item, variant = 'compact' }) => {
  const compareVariant = variant === 'featured' ? 'featured' : 'compact';

  return (
    <article className={classNames(styles.card, styles[variant])}>
      <h3 className={styles.title}>{item.title}</h3>
      <BeforeAfterCompare
        beforeImageUrl={item.beforeImageUrl}
        afterImageUrl={item.afterImageUrl}
        beforeAlt={`${item.title} — до перетяжки`}
        afterAlt={`${item.title} — после перетяжки`}
        variant={compareVariant}
      />
      <p className={styles.fabric}>Ткань: {item.fabricName}</p>
    </article>
  );
};
