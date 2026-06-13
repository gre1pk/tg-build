import type { FC, ReactNode } from 'react';

import { AdminExitButton } from '@/components/AdminExitButton/AdminExitButton';
import { Link } from '@/components/Link/Link';
import { classNames } from '@/css/classnames';
import btn from '@/ui/Button.module.scss';

import admin from '@/pages/admin/Admin.module.scss';
import styles from './AdminTopActions.module.scss';

interface AdminTopActionsProps {
  showBack?: boolean;
  backTo?: string;
  className?: string;
  children?: ReactNode;
}

export const AdminTopActions: FC<AdminTopActionsProps> = ({
  showBack = true,
  backTo = '/admin',
  className,
  children,
}) => {
  return (
    <div className={classNames(admin.topActions, styles.bar, className)}>
      {showBack && (
        <Link to={backTo} className={classNames(btn.btn, btn.btnSecondary, styles.back)}>
          ← Назад
        </Link>
      )}
      {children}
      <AdminExitButton className={styles.exit} />
    </div>
  );
};
