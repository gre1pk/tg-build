import { type FC, useCallback, useEffect, useState } from 'react';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import { fetchAdminOrders, deleteOrderPhoto, updateOrderStatus } from '@/data/api/adminOrdersApi';
import {
  ORDER_NEXT_ACTIONS,
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
} from '@/data/types';
import btn from '@/ui/Button.module.scss';
import empty from '@/ui/EmptyState.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { AdminGate } from './AdminGate';
import admin from './Admin.module.scss';

type OrdersTab = 'active' | 'archive';

const TAB_STATUSES: Record<OrdersTab, OrderStatus[]> = {
  active: ['new', 'in_progress'],
  archive: ['done', 'cancelled'],
};

function formatOrderDate(value: string): string {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AdminOrdersPage: FC = () => {
  const [tab, setTab] = useState<OrdersTab>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  const loadOrders = useCallback(async (nextTab: OrdersTab) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchAdminOrders(TAB_STATUSES[nextTab]);
      setOrders(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить заявки');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders(tab);
  }, [tab, loadOrders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setActionError(null);
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders(tab);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Не удалось обновить статус');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeletePhoto = async (orderId: string) => {
    if (!window.confirm('Удалить фото заявки? Файл будет удалён из хранилища без восстановления.')) {
      return;
    }

    setActionError(null);
    setDeletingPhotoId(orderId);
    try {
      await deleteOrderPhoto(orderId);
      await loadOrders(tab);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Не удалось удалить фото');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  return (
    <AdminGate>
      <Page>
        <div className={page.page}>
          <PageHeader title="Заявки" lead="Активные заявки клиентов и архив" />

          <div className={admin.topActions}>
            <Link to="/admin" className={classNames(btn.btn, btn.btnSecondary)}>
              ← Назад
            </Link>
          </div>

          <div className={admin.tabs} role="tablist" aria-label="Фильтр заявок">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'active'}
              className={classNames(admin.tab, tab === 'active' && admin.tabActive)}
              onClick={() => setTab('active')}
            >
              Активные
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'archive'}
              className={classNames(admin.tab, tab === 'archive' && admin.tabActive)}
              onClick={() => setTab('archive')}
            >
              Архив
            </button>
          </div>

          {actionError && <p className={empty.emptyText}>{actionError}</p>}

          {loading && (
            <Placeholder header="Загрузка…" description="Получаем список заявок" />
          )}

          {error && <Placeholder header="Ошибка" description={error} />}

          {!loading && !error && orders.length === 0 && (
            <div className={empty.empty}>
              <p className={empty.emptyTitle}>
                {tab === 'active' ? 'Нет активных заявок' : 'Архив пуст'}
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <ul className={admin.list}>
              {orders.map((order) => {
                const actions = ORDER_NEXT_ACTIONS[order.status];
                return (
                  <li key={order.id} className={admin.listItem}>
                    {order.photoUrl ? (
                      <img
                        src={order.photoUrl}
                        alt=""
                        className={admin.listThumb}
                        loading="lazy"
                      />
                    ) : (
                      <div className={admin.listThumbPlaceholder} aria-hidden>
                        —
                      </div>
                    )}
                    <div className={admin.listBody}>
                      <p className={admin.listTitle}>
                        {order.userFirstName}
                        {order.userUsername ? ` (@${order.userUsername})` : ''}
                      </p>
                      <p className={admin.listMeta}>
                        {formatOrderDate(order.createdAt)} · ID {order.telegramId}
                      </p>
                      <p className={admin.listMeta}>
                        {ORDER_STATUS_LABELS[order.status]}
                        {order.fabricSnapshot ? ` · ${order.fabricSnapshot}` : ''}
                      </p>
                      {order.comment && <p className={admin.orderComment}>{order.comment}</p>}
                    </div>
                    {actions.length > 0 && (
                      <div className={admin.listActions}>
                        {actions.map((action) => (
                          <button
                            key={action.status}
                            type="button"
                            className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                            disabled={updatingId === order.id}
                            onClick={() => void handleStatusChange(order.id, action.status)}
                          >
                            {updatingId === order.id ? '…' : action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {tab === 'archive' && order.photoUrl && (
                      <div className={admin.listActions}>
                        <button
                          type="button"
                          className={classNames(btn.btn, btn.btnSecondary, admin.iconBtn)}
                          disabled={deletingPhotoId === order.id}
                          onClick={() => void handleDeletePhoto(order.id)}
                        >
                          {deletingPhotoId === order.id ? '…' : 'Удалить фото'}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Page>
    </AdminGate>
  );
};
