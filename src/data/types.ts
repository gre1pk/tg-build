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
