import type { FC } from 'react';

import { env } from '@/config/env';

import styles from './DevModeBadge.module.scss';

export const DevModeBadge: FC = () => {
  if (!env.isDev) {
    return null;
  }

  return (
    <div className={`${styles.badge} ${env.useMockData ? styles.mock : styles.live}`}>
      {env.useMockData ? 'Mock data' : 'Live'}
    </div>
  );
};
