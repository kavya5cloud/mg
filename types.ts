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

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
