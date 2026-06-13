import type { FC } from 'react';

import { Link } from '@/components/Link/Link';
import { classNames } from '@/css/classnames';
import btn from '@/ui/Button.module.scss';

import styles from './AdminExitButton.module.scss';

interface AdminExitButtonProps {
  fullWidth?: boolean;
  className?: string;
}

const HomeIcon: FC = () => (
  <svg
    className={styles.icon}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);

export const AdminExitButton: FC<AdminExitButtonProps> = ({ fullWidth = false, className }) => {
  return (
    <Link
      to="/"
      className={classNames(
        btn.btn,
        btn.btnSecondaryOutlined,
        styles.exit,
        fullWidth && styles.fullWidth,
        className,
      )}
      aria-label="В приложение"
    >
      <HomeIcon />
      <span>В приложение</span>
    </Link>
  );
};
