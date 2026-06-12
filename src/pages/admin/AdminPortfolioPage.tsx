import { type FC, useState } from 'react';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import { deletePortfolioItem } from '@/data/api/adminApi';
import { usePortfolio } from '@/hooks/usePortfolio';
import btn from '@/ui/Button.module.scss';
import empty from '@/ui/EmptyState.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { AdminGate } from './AdminGate';
import admin from './Admin.module.scss';

export const AdminPortfolioPage: FC = () => {
  const { items, loading, error, refetch } = usePortfolio();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Удалить «${title}»?`)) {
      return;
    }

    setActionError(null);
    setDeletingId(id);
    try {
      await deletePortfolioItem(id);
      refetch();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Не удалось удалить');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminGate>
      <Page>
        <div className={page.page}>
          <PageHeader title="Портфолио" lead="Примеры работ «до / после» на главной" />

          <div className={admin.topActions}>
            <Link to="/admin" className={classNames(btn.btn, btn.btnSecondary)}>
              ← Назад
            </Link>
            <Link to="/admin/portfolio/new" className={classNames(btn.btn, btn.btnPrimary)}>
              Добавить
            </Link>
          </div>

          {actionError && <p className={empty.emptyText}>{actionError}</p>}

          {loading && (
            <Placeholder header="Загрузка…" description="Получаем список работ" />
          )}

          {error && <Placeholder header="Ошибка" description={error} />}

          {!loading && !error && items.length === 0 && (
            <div className={empty.empty}>
              <p className={empty.emptyTitle}>Пока нет работ</p>
              <Link to="/admin/portfolio/new" className={classNames(btn.btn, btn.btnPrimary)}>
                Добавить первую
              </Link>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <ul className={admin.list}>
              {items.map((item) => (
                <li key={item.id} className={admin.listItem}>
                  <img
                    src={item.afterImageUrl}
                    alt=""
                    className={admin.listThumb}
                    loading="lazy"
                  />
                  <div className={admin.listBody}>
                    <p className={admin.listTitle}>{item.title}</p>
                    {item.fabricName && (
                      <p className={admin.listMeta}>Ткань: {item.fabricName}</p>
                    )}
                  </div>
                  <div className={admin.listActions}>
                    <Link
                      to={`/admin/portfolio/${item.id}/edit`}
                      className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                    >
                      Изменить
                    </Link>
                    <button
                      type="button"
                      className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item.id, item.title)}
                    >
                      {deletingId === item.id ? '…' : 'Удалить'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Page>
    </AdminGate>
  );
};
