import type { FC, ReactNode } from 'react';

import { classNames } from '@/css/classnames';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  lead?: ReactNode;
  compact?: boolean;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, lead, compact }) => {
  return (
    <header className={classNames(styles.header, compact && styles.compact)}>
      <h1 className={styles.title}>{title}</h1>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
};
