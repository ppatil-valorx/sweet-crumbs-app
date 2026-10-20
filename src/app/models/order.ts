export type Flavour =
  | 'Chocolate'
  | 'Vanilla'
  | 'Red Velvet'
  | 'Butterscotch';

export type Town = 'Northfield' | 'Southbay';

export type OrderStatus =
  | 'New'
  | 'Baking'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  orderNumber: string;
  accountName: string;
  flavour: Flavour;
  sizeKg: number;
  deliveryDate: string;
  deliveryTown: Town;
  status: OrderStatus;
  price?: number;
  bigOrder: boolean;
  webReference?: string;
}