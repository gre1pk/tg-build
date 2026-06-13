import { useEffect, useMemo } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { DevModeBadge } from '@/components/DevModeBadge/DevModeBadge';
import { syncThemeColorMeta } from '@/helpers/syncThemeColorMeta';
import { routes } from '@/navigation/routes.tsx';
import { AppProviders } from '@/providers/AppProviders';
import { isMiniAppDark, retrieveLaunchParams, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  useEffect(() => {
    syncThemeColorMeta();
  }, [isDark]);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <AppProviders>
        <HashRouter>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.Component />} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
        <DevModeBadge />
      </AppProviders>
    </AppRoot>
  );
}
