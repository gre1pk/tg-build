import type { FC } from 'react';

import { AdminExitButton } from '@/components/AdminExitButton/AdminExitButton';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import btn from '@/ui/Button.module.scss';
import page from '@/ui/Page.module.scss';

import { AdminGate } from './AdminGate';
import admin from './Admin.module.scss';

export const AdminHomePage: FC = () => {
  return (
    <AdminGate>
      <Page>
        <div className={page.page}>
          <PageHeader
            title="Админка"
            lead="Управление каталогом, заявками и примерами работ"
          />
          <nav className={admin.nav} aria-label="Разделы админки">
            <Link
              to="/admin/orders"
              className={classNames(btn.btn, btn.btnSecondaryOutlined, admin.navLink)}
            >
              Заявки
            </Link>
            <Link
              to="/admin/fabrics"
              className={classNames(btn.btn, btn.btnSecondaryOutlined, admin.navLink)}
            >
              Ткани
            </Link>
            <Link
              to="/admin/portfolio"
              className={classNames(btn.btn, btn.btnSecondaryOutlined, admin.navLink)}
            >
              Портфолио
            </Link>
          </nav>
          <div className={admin.homeExit}>
            <AdminExitButton fullWidth />
          </div>
        </div>
      </Page>
    </AdminGate>
  );
};
