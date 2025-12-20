
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking, PageAssets, Event } from '../types';

// Persistence Config
const DB_NAME = 'MOCA_MUSEUM_FINAL_STORAGE'; 
const DB_VERSION = 1;
const STORE_NAME = 'museum_records';
const INITIALIZED_KEY = 'moca_system_initialized';

// Default Data Structures (Fallback only)
const DEFAULT_GALLERY = [
  { speed: 0.1, direction: -1, images: ["https://picsum.photos/id/20/800/800", "https://picsum.photos/id/24/800/800", "https://picsum.photos/id/28/800/800", "https://picsum.photos/id/30/800/800"] },
  { speed: 0.25, direction: 1, images: ["https://picsum.photos/id/36/800/800", "https://picsum.photos/id/38/800/800", "https://picsum.photos/id/42/800/800", "https://picsum.photos/id/48/800/800"] },
  { speed: 0.15, direction: -1, images: ["https://picsum.photos/id/52/800/800", "https://picsum.photos/id/55/800/800", "https://picsum.photos/id/60/800/800", "https://picsum.photos/id/64/800/800"] }
];

const DEFAULT_EVENTS: Event[] = [
    { id: 'ev1', title: "Curator's Talk: Modernism", type: "Talk", date: "Today, 4:00 PM", location: "Auditorium", imageUrl: "https://picsum.photos/id/20/400/300", description: "Modernism in Gujarat." },
    { id: 'ev2', title: "Sculpting Workshop", type: "Workshop", date: "Sat, 11:00 AM", location: "Studio A", imageUrl: "https://picsum.photos/id/30/400/300", description: "Hands-on sculpting." }
];

const DEFAULT_PAGE_ASSETS: PageAssets = {
  about: {
    hero: "https://picsum.photos/id/122/1600/600",
    atrium: "https://picsum.photos/id/238/800/800",
    title: "Our Story",
    introTitle: "A new cultural landmark.",
    introPara1: "Established in 2024, MOCA stands as a testament to the cultural landscape of Gujarat.",
    introPara2: "We believe art is a mirror to society.",
    missionTitle: "Our Mission",
    missionDesc: "To inspire creativity through modern art.",
    globalTitle: "Global Perspective",
    globalDesc: "Fostering international outlook.",
    communityTitle: "Community First",
    communityDesc: "Art for everyone.",
    archTitle: "Architecture",
    archPara1: "The building reflects modernist principles.",
    archPara2: "40,000 square feet of art space.",
    team: [
      { id: 't1', name: 'Dr. Aarav Patel', role: 'Director', imageUrl: 'https://picsum.photos/id/64/400/400' },
      { id: 't2', name: 'Meera Shah', role: 'Education', imageUrl: 'https://picsum.photos/id/65/400/400' }
    ]
  },
  visit: { 
    hero: "https://picsum.photos/id/445/1600/800",
    hours: "Tue — Sun: 10:30 — 18:00",
    locationText: "Inside Veer Residency, Gandhinagar Mahudi, Gujarat",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=23.506205,72.754318",
    admissionInfo: "Admission is currently free. Pre-registration recommended.",
    parkingInfo: "Free visitor parking is available."
  },
  membership: { hero: "https://picsum.photos/id/1015/600/600" },
  home: { heroBg: "" }
};

// State Cache
let cache: Record<string, any> = {};
let dbInstance: IDBDatabase | null = null;

// Initialize Connection
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
        request.onerror = (e) => reject(new Error("IndexedDB Blocked"));
    });
};

/**
 * Perform initial data seeding only ONCE ever.
 */
const seedData = async () => {
    console.warn("SYSTEM: Performing first-time data seed...");
    await saveToDB('moca_page_assets', DEFAULT_PAGE_ASSETS);
    await saveToDB('moca_exhibitions', EXHIBITIONS);
    await saveToDB('moca_artworks', ARTWORKS);
    await saveToDB('moca_collectables', COLLECTABLES);
    await saveToDB('moca_events', DEFAULT_EVENTS);
    await saveToDB('moca_homepage_gallery', DEFAULT_GALLERY);
    localStorage.setItem(INITIALIZED_KEY, 'true');
};

/**
 * CORE BOOTSTRAP: Must complete before UI render.
 */
export const bootstrapMuseumData = async () => {
    try {
        const db = await initDB();
        
        // 1. Check if we have ever initialized this system
        const isInitialized = localStorage.getItem(INITIALIZED_KEY) === 'true';

        // 2. Load all data from store into memory
        return new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.openCursor();
            let count = 0;

            request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if (cursor) {
                    cache[cursor.key] = cursor.value;
                    count++;
                    cursor.continue();
                } else {
                    // Finished reading
                    if (!isInitialized || count === 0) {
                        seedData().then(() => resolve()).catch(reject);
                    } else {
                        console.debug(`SYSTEM: Loaded ${count} records from persistent storage.`);
                        resolve();
                    }
                }
            };
            request.onerror = () => reject(new Error("Read Error"));
        });
    } catch (err) {
        console.error("CRITICAL: Storage failure. Reverting to constants.", err);
        cache['moca_page_assets'] = DEFAULT_PAGE_ASSETS;
        cache['moca_exhibitions'] = EXHIBITIONS;
        cache['moca_artworks'] = ARTWORKS;
    }
};

const getFromCache = <T>(key: string, defaultValue: T): T => {
    return cache[key] !== undefined ? cache[key] : defaultValue;
};

const saveToDB = (key: string, data: any): Promise<void> => {
    // Immediate memory update so UI feels instant
    cache[key] = data;
    
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put(data, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject();
        } catch (e) {
            reject(e);
        }
    });
};

export const getStorageUsage = () => {
    const size = new Blob([JSON.stringify(cache)]).size;
    return (size / 1024 / 1024).toFixed(2);
};

export const clearAllAppData = async () => {
    localStorage.removeItem(INITIALIZED_KEY);
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    cache = {};
    window.location.reload();
};

export const getPageAssets = (): PageAssets => getFromCache('moca_page_assets', DEFAULT_PAGE_ASSETS);
export const savePageAssets = (data: PageAssets) => saveToDB('moca_page_assets', data);

export const getExhibitions = (): Exhibition[] => getFromCache('moca_exhibitions', EXHIBITIONS);
export const saveExhibitions = (data: Exhibition[]) => saveToDB('moca_exhibitions', data);

export const getArtworks = (): Artwork[] => getFromCache('moca_artworks', ARTWORKS);
export const saveArtworks = (data: Artwork[]) => saveToDB('moca_artworks', data);

export const getEvents = (): Event[] => getFromCache('moca_events', DEFAULT_EVENTS);
export const saveEvents = (data: Event[]) => saveToDB('moca_events', data);

export const getCollectables = (): Collectable[] => getFromCache('moca_collectables', COLLECTABLES);
export const saveCollectables = (data: Collectable[]) => saveToDB('moca_collectables', data);

export const getShopOrders = (): ShopOrder[] => getFromCache('moca_shop_orders', []);
export const saveShopOrder = async (order: ShopOrder) => {
    const orders = getShopOrders();
    await saveToDB('moca_shop_orders', [order, ...orders]);
};

export const updateShopOrders = (orders: ShopOrder[]) => saveToDB('moca_shop_orders', orders);

export const getBookings = (): Booking[] => getFromCache('moca_bookings', []);
export const saveBooking = async (booking: Booking) => {
    const bookings = getBookings();
    await saveToDB('moca_bookings', [booking, ...bookings]);
};

export const getHomepageGallery = () => getFromCache('moca_homepage_gallery', DEFAULT_GALLERY);
export const saveHomepageGallery = (data: any) => saveToDB('moca_homepage_gallery', data);

export const getReviews = (itemId: string): Review[] => {
    const all = getFromCache<Review[]>('moca_reviews', []);
    return all.filter(r => r.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
};
export const addReview = async (review: Review) => {
    const all = getFromCache<Review[]>('moca_reviews', []);
    await saveToDB('moca_reviews', [review, ...all]);
};

export const getNewsletterEmails = (): string[] => getFromCache('moca_newsletter', []);
export const saveNewsletterEmail = async (email: string) => {
    const emails = getNewsletterEmails();
    if (!emails.includes(email)) await saveToDB('moca_newsletter', [email, ...emails]);
};

export const getStaffMode = (): boolean => getFromCache('moca_staff_mode', false);
export const setStaffMode = (enabled: boolean) => saveToDB('moca_staff_mode', enabled);
