
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking, PageAssets, Event } from '../types';

// Persistence Config
const DB_NAME = 'MOCA_GANDHINAGAR_DB';
const DB_VERSION = 1;
const STORE_NAME = 'museum_data';

// Default Data Structures
const DEFAULT_GALLERY = [
  { speed: 0.1, direction: -1, images: ["https://picsum.photos/id/20/800/800", "https://picsum.photos/id/24/800/800", "https://picsum.photos/id/28/800/800", "https://picsum.photos/id/30/800/800"] },
  { speed: 0.25, direction: 1, images: ["https://picsum.photos/id/36/800/800", "https://picsum.photos/id/38/800/800", "https://picsum.photos/id/42/800/800", "https://picsum.photos/id/48/800/800"] },
  { speed: 0.15, direction: -1, images: ["https://picsum.photos/id/52/800/800", "https://picsum.photos/id/55/800/800", "https://picsum.photos/id/60/800/800", "https://picsum.photos/id/64/800/800"] }
];

const DEFAULT_EVENTS: Event[] = [
    {
        id: 'ev1',
        title: "Curator's Talk: Modernism in Gujarat",
        type: "Talk",
        date: "Today, 4:00 PM",
        location: "Auditorium",
        imageUrl: "https://picsum.photos/id/20/400/300",
        description: "Join us for an intimate session discussing the roots of Indian modernism."
    },
    {
        id: 'ev2',
        title: "Clay & Form: Sculpting Workshop",
        type: "Workshop",
        date: "Sat, Oct 12, 11:00 AM",
        location: "Studio A",
        imageUrl: "https://picsum.photos/id/30/400/300",
        description: "A hands-on workshop led by visiting artists from NID."
    },
    {
        id: 'ev3',
        title: "Film Screening: Kurosawa's Dreams",
        type: "Film",
        date: "Sun, Oct 13, 6:00 PM",
        location: "Cinema Hall",
        imageUrl: "https://picsum.photos/id/40/400/300",
        description: "A special 4K restoration screening of the Japanese masterpiece."
    }
];

const DEFAULT_PAGE_ASSETS: PageAssets = {
  about: {
    hero: "https://picsum.photos/id/122/1600/600",
    atrium: "https://picsum.photos/id/238/800/800",
    title: "Our Story",
    introTitle: "A new cultural landmark in the heart of the Green City.",
    introPara1: "Established in 2024, the Museum of Contemporary Art Gandhinagar (MOCA) stands as a testament to the evolving cultural landscape of Gujarat.",
    introPara2: "We believe that modern art is a mirror to society. Our institution is dedicated to presenting the most thought-provoking art of our time.",
    missionTitle: "Our Mission",
    missionDesc: "To inspire creativity and critical thinking through the presentation and collection of modern art.",
    globalTitle: "Global Perspective",
    globalDesc: "While deeply rooted in India, MOCA Gandhinagar fosters an international outlook through worldwide collaborations.",
    communityTitle: "Community First",
    communityDesc: "We are committed to accessibility, striving to make contemporary art accessible to everyone.",
    archTitle: "Architecture & Space",
    archPara1: "The MOCA building reflects modernist planning principles with clean lines and raw concrete.",
    archPara2: "Spanning 40,000 square feet, the space includes flexible halls, a media wing, and a sculpture garden.",
    team: [
      { id: 't1', name: 'Dr. Aarav Patel', role: 'Director & Chief Curator', imageUrl: 'https://picsum.photos/id/64/400/400' },
      { id: 't2', name: 'Meera Shah', role: 'Head of Education', imageUrl: 'https://picsum.photos/id/65/400/400' },
      { id: 't3', name: 'Sanjay Desai', role: 'Development Manager', imageUrl: 'https://picsum.photos/id/66/400/400' }
    ]
  },
  visit: { 
    hero: "https://picsum.photos/id/445/1600/800",
    hours: "Tuesday — Sunday: 10:30 — 18:00",
    locationText: "Inside Veer Residency, Gandhinagar Mahudi, Gujarat",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=23.506205,72.754318",
    admissionInfo: "General admission to MOCA Gandhinagar is currently free for all visitors. However, pre-registration online is recommended to ensure entry during peak hours.",
    parkingInfo: "Free visitor parking is available at the Veer Residency complex. Additional street parking is available along Mahudi Road.",
    accessibilityInfo: "The museum is fully wheelchair accessible. Elevators are located in the main atrium, and complimentary wheelchairs are available at the information desk."
  },
  membership: { hero: "https://picsum.photos/id/1015/600/600" },
  home: { heroBg: "" }
};

// Internal Cache for Synchronous Access
let cache: Record<string, any> = {};
let dbInstance: IDBDatabase | null = null;

// Initialize Database
const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) return resolve(dbInstance);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e: any) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e: any) => {
            dbInstance = e.target.result;
            resolve(dbInstance!);
        };
        request.onerror = (e) => reject(e);
    });
};

// Migrate from LocalStorage to IndexedDB
const migrateData = async () => {
    const keys = ['moca_exhibitions', 'moca_artworks', 'moca_events', 'moca_collectables', 'moca_shop_orders', 'moca_bookings', 'moca_newsletter', 'moca_reviews', 'moca_homepage_gallery', 'moca_page_assets', 'moca_staff_mode'];
    const db = await initDB();
    
    for (const key of keys) {
        const localData = localStorage.getItem(key);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(parsed, key);
                localStorage.removeItem(key); // Cleanup
                cache[key] = parsed;
            } catch (e) {
                console.error(`Migration failed for ${key}`, e);
            }
        }
    }
};

// High-speed data pre-fetcher
export const bootstrapMuseumData = async () => {
    await initDB();
    await migrateData();
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise<void>((resolve) => {
        const request = store.getAllKeys();
        request.onsuccess = () => {
            const keys = request.result as string[];
            let completed = 0;
            if (keys.length === 0) resolve();
            keys.forEach(key => {
                const getReq = store.get(key);
                getReq.onsuccess = () => {
                    cache[key] = getReq.result;
                    completed++;
                    if (completed === keys.length) resolve();
                };
            });
        };
    });
};

const getFromCache = <T>(key: string, defaultValue: T): T => {
    if (cache[key] !== undefined) return cache[key];
    return defaultValue;
};

const saveToDB = async (key: string, data: any) => {
    cache[key] = data;
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, key);
};

export const getStorageUsage = () => {
    const size = new Blob([JSON.stringify(cache)]).size;
    return (size / 1024 / 1024).toFixed(2);
};

export const clearAllAppData = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    cache = {};
    localStorage.clear();
    window.location.reload();
};

export const getPageAssets = (): PageAssets => getFromCache('moca_page_assets', DEFAULT_PAGE_ASSETS);
export const savePageAssets = (data: PageAssets) => { saveToDB('moca_page_assets', data); return true; };

export const getExhibitions = (): Exhibition[] => getFromCache('moca_exhibitions', EXHIBITIONS);
export const saveExhibitions = (data: Exhibition[]) => { saveToDB('moca_exhibitions', data); return true; };

export const getArtworks = (): Artwork[] => getFromCache('moca_artworks', ARTWORKS);
export const saveArtworks = (data: Artwork[]) => { saveToDB('moca_artworks', data); return true; };

export const getEvents = (): Event[] => getFromCache('moca_events', DEFAULT_EVENTS);
export const saveEvents = (data: Event[]) => { saveToDB('moca_events', data); return true; };

export const getCollectables = (): Collectable[] => getFromCache('moca_collectables', COLLECTABLES);
export const saveCollectables = (data: Collectable[]) => { saveToDB('moca_collectables', data); return true; };

export const getShopOrders = (): ShopOrder[] => getFromCache('moca_shop_orders', []);
export const saveShopOrder = (order: ShopOrder) => {
    const orders = getShopOrders();
    saveToDB('moca_shop_orders', [order, ...orders]);
};

export const updateShopOrders = (orders: ShopOrder[]) => { saveToDB('moca_shop_orders', orders); return true; };

export const getBookings = (): Booking[] => getFromCache('moca_bookings', []);
export const saveBooking = (booking: Booking) => {
    const bookings = getBookings();
    saveToDB('moca_bookings', [booking, ...bookings]);
};

export const getHomepageGallery = () => getFromCache('moca_homepage_gallery', DEFAULT_GALLERY);
export const saveHomepageGallery = (data: any) => { saveToDB('moca_homepage_gallery', data); return true; };
export const resetHomepageGallery = () => { saveToDB('moca_homepage_gallery', DEFAULT_GALLERY); return DEFAULT_GALLERY; };

export const getReviews = (itemId: string): Review[] => {
    const all = getFromCache<Review[]>('moca_reviews', []);
    return all.filter(r => r.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
};
export const addReview = (review: Review) => {
    const all = getFromCache<Review[]>('moca_reviews', []);
    saveToDB('moca_reviews', [review, ...all]);
};

export const getNewsletterEmails = (): string[] => getFromCache('moca_newsletter', []);
export const saveNewsletterEmail = (email: string) => {
    const emails = getNewsletterEmails();
    if (!emails.includes(email)) saveToDB('moca_newsletter', [email, ...emails]);
};

export const getStaffMode = (): boolean => getFromCache('moca_staff_mode', false);
export const setStaffMode = (enabled: boolean) => saveToDB('moca_staff_mode', enabled);
