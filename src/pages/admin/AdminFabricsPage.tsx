import { type FC, useState } from 'react';

import { AdminTopActions } from '@/components/AdminTopActions/AdminTopActions';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import { deleteFabric } from '@/data/api/adminApi';
import { formatPricePerMeter } from '@/helpers/formatPrice';
import { useFabrics } from '@/hooks/useFabrics';
import btn from '@/ui/Button.module.scss';
import empty from '@/ui/EmptyState.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { AdminGate } from './AdminGate';
import admin from './Admin.module.scss';

export const AdminFabricsPage: FC = () => {
  const { fabrics, loading, error, refetch } = useFabrics();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Удалить «${name}»?`)) {
      return;
    }

    setActionError(null);
    setDeletingId(id);
    try {
      await deleteFabric(id);
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
          <PageHeader title="Ткани" lead="Каталог для клиентов в Mini App" />

          <AdminTopActions>
            <Link to="/admin/fabrics/new" className={classNames(btn.btn, btn.btnPrimary)}>
              Добавить
            </Link>
          </AdminTopActions>

          {actionError && <p className={empty.emptyText}>{actionError}</p>}

          {loading && (
            <Placeholder header="Загрузка…" description="Получаем список тканей" />
          )}

          {error && (
            <Placeholder header="Ошибка" description={error} />
          )}

          {!loading && !error && fabrics.length === 0 && (
            <div className={empty.empty}>
              <p className={empty.emptyTitle}>Пока нет тканей</p>
              <Link to="/admin/fabrics/new" className={classNames(btn.btn, btn.btnPrimary)}>
                Добавить первую
              </Link>
            </div>
          )}

          {!loading && !error && fabrics.length > 0 && (
            <ul className={admin.list}>
              {fabrics.map((fabric) => (
                <li key={fabric.id} className={admin.listItem}>
                  <img
                    src={fabric.imageUrl}
                    alt=""
                    className={admin.listThumb}
                    loading="lazy"
                  />
                  <div className={admin.listBody}>
                    <p className={admin.listTitle}>{fabric.name}</p>
                    <p className={admin.listMeta}>
                      {fabric.material} · {fabric.color} · {formatPricePerMeter(fabric.pricePerMeter)}
                    </p>
                  </div>
                  <div className={admin.listActions}>
                    <Link
                      to={`/admin/fabrics/${fabric.id}/edit`}
                      className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                    >
                      Изменить
                    </Link>
                    <button
                      type="button"
                      className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                      disabled={deletingId === fabric.id}
                      onClick={() => void handleDelete(fabric.id, fabric.name)}
                    >
                      {deletingId === fabric.id ? '…' : 'Удалить'}
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
