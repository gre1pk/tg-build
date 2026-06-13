export interface Fabric {
  id: string;
  name: string;
  material: string;
  color: string;
  pricePerMeter: number;
  imageUrl: string;
  description?: string;
  petFriendly?: boolean;
}

/** @deprecated Use Fabric */
export type Product = Fabric;

export interface PortfolioItem {
  id: string;
  title: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  fabricName: string;
}

export interface UserProfile {
  uid: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
}

export type OrderStatus = 'new' | 'in_progress' | 'done' | 'cancelled';

export interface Order {
  id: string;
  telegramId: number;
  userFirstName: string;
  userUsername?: string;
  comment?: string;
  fabricId?: string;
  fabricSnapshot?: string;
  photoUrl?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отклонена',
};

export const ORDER_NEXT_ACTIONS: Record<
  OrderStatus,
  { status: OrderStatus; label: string }[]
> = {
  new: [
    { status: 'in_progress', label: 'В работу' },
    { status: 'cancelled', label: 'Отклонить' },
  ],
  in_progress: [
    { status: 'done', label: 'Завершить' },
    { status: 'cancelled', label: 'Отклонить' },
  ],
  done: [],
  cancelled: [],
};
