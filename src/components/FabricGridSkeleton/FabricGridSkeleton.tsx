import type { FC } from 'react';

import grid from '@/ui/FabricGrid.module.scss';
import sk from '@/ui/Skeleton.module.scss';

interface FabricGridSkeletonProps {
  count?: number;
}

export const FabricGridSkeleton: FC<FabricGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className={grid.grid} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={sk.card}>
          <div className={`${sk.block} ${sk.square}`} />
          <div className={`${sk.block} ${sk.line} ${sk.short}`} />
          <div className={`${sk.block} ${sk.line}`} />
        </div>
      ))}
    </div>
  );
};
