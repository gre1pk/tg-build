import type { FC, ReactNode } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Page } from '@/components/Page';
import { useAdmin } from '@/hooks/useAdmin';
import { Placeholder } from '@telegram-apps/telegram-ui';

interface AdminGateProps {
  children: ReactNode;
}

export const AdminGate: FC<AdminGateProps> = ({ children }) => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <Page>
        <Placeholder header="Проверяем доступ…" description="Подождите несколько секунд" />
      </Page>
    );
  }

  if (authError) {
    return (
      <Page>
        <Placeholder
          header="Не удалось войти"
          description={authError}
        />
      </Page>
    );
  }

  if (!user) {
    return (
      <Page>
        <Placeholder
          header="Нужна авторизация"
          description="Откройте админку из Telegram Mini App или войдите в приложении."
        />
      </Page>
    );
  }

  if (adminError) {
    return (
      <Page>
        <Placeholder header="Ошибка" description={adminError} />
      </Page>
    );
  }

  if (!isAdmin) {
    return (
      <Page>
        <Placeholder
          header="Нет доступа"
          description={`Ваш Telegram ID: ${user.telegramId}. Добавьте его в ADMIN_TELEGRAM_IDS на сервере.`}
        />
      </Page>
    );
  }

  return <>{children}</>;
};
