import { createContext, useMemo, type FC, type ReactNode } from 'react';

import { createRepository } from '@/data/createRepository';
import type { DataRepository } from '@/data/repository';

const DataContext = createContext<DataRepository | null>(null);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const repository = useMemo(() => createRepository(), []);

  return <DataContext.Provider value={repository}>{children}</DataContext.Provider>;
};

export { DataContext };
