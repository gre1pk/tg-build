import { type FC } from 'react';

import { Link } from '@/components/Link/Link';
import { classNames } from '@/css/classnames';
import { useStaff } from '@/hooks/useStaff';
import textLink from '@/ui/TextLink.module.scss';

import styles from './StaffEntryButton.module.scss';

export const StaffEntryButton: FC = () => {
  const { isStaff, role, loading } = useStaff();

  if (loading || !isStaff || !role) {
    return null;
  }

  const label = role === 'admin' ? 'Админка' : 'Панель мастера';

  return (
    <div className={styles.wrap}>
      <Link
        to="/admin"
        className={classNames(textLink.textLink, styles.link)}
        aria-label={label}
      >
        {label}
      </Link>
    </div>
  );
};
