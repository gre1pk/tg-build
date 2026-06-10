import type { Fabric } from '@/data/types';

export const mockFabrics: Fabric[] = [
  {
    id: '1',
    name: 'Велюр «Песок»',
    material: 'Велюр',
    color: 'Бежевый',
    pricePerMeter: 1890,
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    description: 'Мягкий велюр с коротким ворсом. Подходит для диванов и кресел.',
    petFriendly: true,
  },
  {
    id: '2',
    name: 'Рогожка «Олива»',
    material: 'Рогожка',
    color: 'Зелёный',
    pricePerMeter: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2d2?w=600&q=80',
    description: 'Плотная рогожка, износостойкая, легко чистится.',
    petFriendly: true,
  },
  {
    id: '3',
    name: 'Шенилл «Графит»',
    material: 'Шенилл',
    color: 'Серый',
    pricePerMeter: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'Благородная фактура, хорошо смотрится на угловых диванах.',
  },
  {
    id: '4',
    name: 'Экокожа «Карамель»',
    material: 'Экокожа',
    color: 'Коричневый',
    pricePerMeter: 2350,
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=80',
    description: 'Практичный вариант для кухонных уголков и стульев.',
    petFriendly: true,
  },
  {
    id: '5',
    name: 'Лён «Молоко»',
    material: 'Лён',
    color: 'Светлый',
    pricePerMeter: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1600166898335-aa9510810d8c?w=600&q=80',
    description: 'Натуральная фактура, светлые интерьеры и сканди-стиль.',
  },
  {
    id: '6',
    name: 'Жаккард «Индиго»',
    material: 'Жаккард',
    color: 'Синий',
    pricePerMeter: 1980,
    imageUrl: 'https://images.unsplash.com/photo-1616046229425-8315e4d1d1c8?w=600&q=80',
    description: 'Выразительный узор, акцент на классических формах мебели.',
  },
];

export const fabricMaterials = [...new Set(mockFabrics.map((f) => f.material))];
