import type { PortfolioItem } from '@/data/types';
import {
  DEMO_AFTER_CHAIR,
  DEMO_AFTER_INTERIOR,
  DEMO_AFTER_SOFA,
  DEMO_BEFORE_CHAIR,
  DEMO_BEFORE_CHAIRS,
  DEMO_BEFORE_INTERIOR,
} from '@/content/marketingImagery';

export const mockPortfolio: PortfolioItem[] = [
  {
    id: '1',
    title: 'Угловой диван',
    beforeImageUrl: DEMO_BEFORE_CHAIR,
    afterImageUrl: DEMO_AFTER_SOFA,
    fabricName: 'Велюр «Песок»',
  },
  {
    id: '2',
    title: 'Кресло-реклайнер',
    beforeImageUrl: DEMO_BEFORE_INTERIOR,
    afterImageUrl: DEMO_AFTER_INTERIOR,
    fabricName: 'Рогожка «Олива»',
  },
  {
    id: '3',
    title: 'Обеденные стулья',
    beforeImageUrl: DEMO_BEFORE_CHAIRS,
    afterImageUrl: DEMO_AFTER_CHAIR,
    fabricName: 'Экокожа «Карамель»',
  },
];
