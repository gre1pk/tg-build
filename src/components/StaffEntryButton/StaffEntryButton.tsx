import { type FC } from 'react';

import { Link } from '@/components/Link/Link';
import { useStaff } from '@/hooks/useStaff';

import styles from './StaffEntryButton.module.scss';

const AdminIcon: FC = () => (
  <svg
    className={styles.icon}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MasterIcon: FC = () => (
  <svg
    className={styles.icon}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

interface StaffEntryButtonProps {
  /** When true, omits outer margin (for use inside AppHeader). */
  inline?: boolean;
}

export const StaffEntryButton: FC<StaffEntryButtonProps> = ({ inline = false }) => {
  const { isStaff, role, loading } = useStaff();

  if (loading || !isStaff || !role) {
    return null;
  }

  const isAdmin = role === 'admin';
  const label = isAdmin ? 'Админка' : 'Панель мастера';

  return (
    <div className={inline ? styles.inline : styles.wrap}>
      <Link to="/admin" className={styles.badge} aria-label={label}>
        <span className={styles.iconBadge} aria-hidden>
          {isAdmin ? <AdminIcon /> : <MasterIcon />}
        </span>
        <span className={styles.label}>{label}</span>
      </Link>
    </div>
  );
};
