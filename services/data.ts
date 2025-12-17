
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking } from '../types';

// Default images for the gallery if none are set
const DEFAULT_GALLERY = [
  {
    speed: 0.1,
    direction: -1,
    images: [
      "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493397212122-2b85edf8106b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518998053502-51dd5244ad4a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    speed: 0.25,
    direction: 1,
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    speed: 0.15,
    direction: -1,
    images: [
      "https://images.unsplash.com/photo-1518998053502-51dd5244ad4a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1561214166-3b32400e2895?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1473186578172-c141e6798ee4?auto=format&fit=crop&q=80&w=800",
    ]
  }
];

// Helper to manage localStorage
const getStorage = <T>(key: string, defaultData: T[] | T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
        // Seed initial data
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData as T;
    } catch (e) {
        console.error("Storage error", e);
        return defaultData as T;
    }
};

const setStorage = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- Exhibitions ---
export const getExhibitions = (): Exhibition[] => getStorage<Exhibition[]>('moca_exhibitions', EXHIBITIONS);
export const saveExhibitions = (data: Exhibition[]) => setStorage('moca_exhibitions', data);

// --- Artworks ---
export const getArtworks = (): Artwork[] => getStorage<Artwork[]>('moca_artworks', ARTWORKS);
export const saveArtworks = (data: Artwork[]) => setStorage('moca_artworks', data);

// --- Collectables (Shop) ---
export const getCollectables = (): Collectable[] => getStorage<Collectable[]>('moca_collectables', COLLECTABLES);
export const saveCollectables = (data: Collectable[]) => setStorage('moca_collectables', data);

// --- Shop Orders ---
export const getShopOrders = (): ShopOrder[] => getStorage<ShopOrder[]>('moca_shop_orders', []);
export const saveShopOrder = (order: ShopOrder) => {
    const orders = getShopOrders();
    setStorage('moca_shop_orders', [order, ...orders]);
};
export const updateShopOrders = (orders: ShopOrder[]) => setStorage('moca_shop_orders', orders);

// --- Bookings ---
export const getBookings = (): Booking[] => getStorage<Booking[]>('moca_bookings', []);
export const saveBooking = (booking: Booking) => {
    const bookings = getBookings();
    setStorage('moca_bookings', [booking, ...bookings]);
};

// --- Homepage Gallery ---
export const getHomepageGallery = () => getStorage('moca_homepage_gallery', DEFAULT_GALLERY);
export const saveHomepageGallery = (data: any) => setStorage('moca_homepage_gallery', data);

// --- Reviews ---
export const getReviews = (itemId: string): Review[] => {
    const allReviews = getStorage<Review[]>('moca_reviews', []);
    return allReviews.filter(r => r.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
};

export const addReview = (review: Review) => {
    const allReviews = getStorage<Review[]>('moca_reviews', []);
    setStorage('moca_reviews', [review, ...allReviews]);
};

// --- Newsletter ---
export const getNewsletterEmails = (): string[] => getStorage<string[]>('moca_newsletter', []);
export const saveNewsletterEmail = (email: string) => {
    const emails = getNewsletterEmails();
    if (!emails.includes(email)) {
        setStorage('moca_newsletter', [email, ...emails]);
    }
};
