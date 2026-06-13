import type { Fabric } from '@/data/types';
import {
  DEMO_FABRIC_CHENILLE,
  DEMO_FABRIC_JACQUARD,
  DEMO_FABRIC_LEATHER,
  DEMO_FABRIC_LINEN,
  DEMO_FABRIC_VELVET,
  DEMO_FABRIC_WOOL,
} from '@/content/marketingImagery';

export const mockFabrics: Fabric[] = [
  {
    id: '1',
    name: 'Велюр «Песок»',
    material: 'Велюр',
    color: 'Бежевый',
    pricePerMeter: 1890,
    imageUrl: DEMO_FABRIC_VELVET,
    description: 'Мягкий велюр с коротким ворсом. Подходит для диванов и кресел.',
    petFriendly: true,
  },
  {
    id: '2',
    name: 'Рогожка «Олива»',
    material: 'Рогожка',
    color: 'Зелёный',
    pricePerMeter: 1450,
    imageUrl: DEMO_FABRIC_WOOL,
    description: 'Плотная рогожка, износостойкая, легко чистится.',
    petFriendly: true,
  },
  {
    id: '3',
    name: 'Шенилл «Графит»',
    material: 'Шенилл',
    color: 'Серый',
    pricePerMeter: 2100,
    imageUrl: DEMO_FABRIC_CHENILLE,
    description: 'Благородная фактура, хорошо смотрится на угловых диванах.',
  },
  {
    id: '4',
    name: 'Экокожа «Карамель»',
    material: 'Экокожа',
    color: 'Коричневый',
    pricePerMeter: 2350,
    imageUrl: DEMO_FABRIC_LEATHER,
    description: 'Практичный вариант для кухонных уголков и стульев.',
    petFriendly: true,
  },
  {
    id: '5',
    name: 'Лён «Молоко»',
    material: 'Лён',
    color: 'Светлый',
    pricePerMeter: 1680,
    imageUrl: DEMO_FABRIC_LINEN,
    description: 'Натуральная фактура, светлые интерьеры и сканди-стиль.',
  },
  {
    id: '6',
    name: 'Жаккард «Индиго»',
    material: 'Жаккард',
    color: 'Синий',
    pricePerMeter: 1980,
    imageUrl: DEMO_FABRIC_JACQUARD,
    description: 'Выразительный узор, акцент на классических формах мебели.',
  },
];

export const fabricMaterials = [...new Set(mockFabrics.map((f) => f.material))];
