import type { FC } from 'react';

import { Link } from '@/components/Link/Link';
import type { Fabric } from '@/data/types';
import { formatPricePerMeter } from '@/helpers/formatPrice';

import styles from './FabricPreviewCard.module.scss';

interface FabricPreviewCardProps {
  fabric: Fabric;
}

export const FabricPreviewCard: FC<FabricPreviewCardProps> = ({ fabric }) => {
  return (
    <Link to={`/fabrics/${fabric.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={fabric.imageUrl}
          alt={`Ткань ${fabric.name}, ${fabric.color}`}
          className={styles.image}
          width={152}
          height={152}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{fabric.name}</p>
        <p className={styles.meta}>
          {fabric.material} · {fabric.color}
        </p>
        <p className={styles.price}>{formatPricePerMeter(fabric.pricePerMeter)}</p>
      </div>
    </Link>
  );
};
