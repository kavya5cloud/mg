
export interface Exhibition {
  id: string;
  title: string;
  dateRange: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
}

export interface Collectable {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  inStock?: boolean;
}

export interface CartItem extends Collectable {
  quantity: number;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  email: string;
  items: CartItem[];
  totalAmount: number;
  timestamp: number;
  status: 'Pending' | 'Fulfilled';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Review {
  id: string;
  itemId: string;
  itemType: 'exhibition' | 'artwork';
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: number;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  date: string;
  tickets: { adult: number; student: number; child: number };
  totalAmount: number;
  timestamp: number;
  status: string;
}
