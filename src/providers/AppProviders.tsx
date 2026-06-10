import type { FC, ReactNode } from 'react';

import { AuthProvider } from '@/auth/AuthProvider';
import { DataProvider } from '@/data/DataProvider';

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
};
