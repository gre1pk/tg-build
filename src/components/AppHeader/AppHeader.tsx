import type { FC } from 'react';

import { Link } from '@/components/Link/Link';
import { StaffEntryButton } from '@/components/StaffEntryButton/StaffEntryButton';
import {
  BRAND_HOME_LABEL,
  LOGO_ICON,
  LOGO_WITH_TEXT,
  type LogoAsset,
} from '@/config/brand';
import { classNames } from '@/css/classnames';

import styles from './AppHeader.module.scss';

interface AppHeaderProps {
  variant?: 'full' | 'compact';
}

function LogoPicture({
  asset,
  className,
  priority,
}: {
  asset: LogoAsset;
  className: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={`${asset.webp1x} 1x, ${asset.webp2x} 2x`} />
      <img
        src={asset.png1x}
        srcSet={`${asset.png1x} 1x, ${asset.png2x} 2x`}
        alt=""
        className={className}
        width={asset.width}
        height={asset.height}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}

export const AppHeader: FC<AppHeaderProps> = ({ variant = 'compact' }) => {
  const isFull = variant === 'full';
  const asset = isFull ? LOGO_WITH_TEXT : LOGO_ICON;

  return (
    <header className={classNames(styles.header, isFull ? styles.full : styles.compact)}>
      <div className={styles.bar}>
        <div className={styles.logoSlot}>
          <Link to="/" className={styles.logoLink} aria-label={BRAND_HOME_LABEL}>
            <LogoPicture
              asset={asset}
              className={isFull ? styles.logoFull : styles.logoCompact}
              priority={isFull}
            />
          </Link>
        </div>
        <div className={styles.staffSlot}>
          <StaffEntryButton inline />
        </div>
      </div>
    </header>
  );
};
