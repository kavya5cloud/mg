
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking } from '../types';

// Helper to manage localStorage
const getStorage = <T>(key: string, defaultData: T[]): T[] => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
        // Seed initial data
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    } catch (e) {
        console.error("Storage error", e);
        return defaultData;
    }
};

const setStorage = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- Exhibitions ---
export const getExhibitions = (): Exhibition[] => getStorage('moca_exhibitions', EXHIBITIONS);
export const saveExhibitions = (data: Exhibition[]) => setStorage('moca_exhibitions', data);

// --- Artworks ---
export const getArtworks = (): Artwork[] => getStorage('moca_artworks', ARTWORKS);
export const saveArtworks = (data: Artwork[]) => setStorage('moca_artworks', data);

// --- Collectables (Shop) ---
export const getCollectables = (): Collectable[] => getStorage('moca_collectables', COLLECTABLES);
export const saveCollectables = (data: Collectable[]) => setStorage('moca_collectables', data);

// --- Shop Orders ---
export const getShopOrders = (): ShopOrder[] => getStorage('moca_shop_orders', []);
export const saveShopOrder = (order: ShopOrder) => {
    const orders = getShopOrders();
    setStorage('moca_shop_orders', [order, ...orders]);
};
export const updateShopOrders = (orders: ShopOrder[]) => setStorage('moca_shop_orders', orders);

// --- Bookings ---
export const getBookings = (): Booking[] => getStorage('moca_bookings', []);
export const saveBooking = (booking: Booking) => {
    const bookings = getBookings();
    setStorage('moca_bookings', [booking, ...bookings]);
};

// --- Reviews ---
export const getReviews = (itemId: string): Review[] => {
    const allReviews = getStorage<Review>('moca_reviews', []);
    return allReviews.filter(r => r.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
};

export const addReview = (review: Review) => {
    const allReviews = getStorage<Review>('moca_reviews', []);
    setStorage('moca_reviews', [review, ...allReviews]);
};

// --- Newsletter ---
export const getNewsletterEmails = (): string[] => getStorage('moca_newsletter', []);
export const saveNewsletterEmail = (email: string) => {
    const emails = getNewsletterEmails();
    if (!emails.includes(email)) {
        setStorage('moca_newsletter', [email, ...emails]);
    }
};
