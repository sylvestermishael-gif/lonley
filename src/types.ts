export type Category = 'Starters' | 'Mains' | 'Grill' | 'Sides' | 'Desserts' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CheckoutData {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  type: 'delivery' | 'pickup';
}
