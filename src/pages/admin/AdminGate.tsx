import type { FC, ReactNode } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Page } from '@/components/Page';
import { useStaff } from '@/hooks/useStaff';
import { Placeholder } from '@telegram-apps/telegram-ui';

interface AdminGateProps {
  children: ReactNode;
}

export const AdminGate: FC<AdminGateProps> = ({ children }) => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isStaff, loading: staffLoading, error: staffError } = useStaff();

  if (authLoading || staffLoading) {
    return (
      <Page>
        <Placeholder header="Проверяем доступ…" description="Подождите несколько секунд" />
      </Page>
    );
  }

  if (authError) {
    return (
      <Page>
        <Placeholder header="Не удалось войти" description={authError} />
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

  if (staffError) {
    return (
      <Page>
        <Placeholder header="Ошибка" description={staffError} />
      </Page>
    );
  }

  if (!isStaff) {
    return (
      <Page>
        <Placeholder
          header="Нет доступа"
          description="Эта страница доступна только мастеру студии."
        />
      </Page>
    );
  }

  return <>{children}</>;
};
