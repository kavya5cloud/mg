
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking, PageAssets, Event } from '../types';

// Storage Keys
const LS_PREFIX = 'MOCA_V3_';
const DB_NAME = 'MOCA_IMAGE_VAULT';
const STORE_NAME = 'images';

// Internal memory cache
let cache: Record<string, any> = {};

const DEFAULT_EVENTS: Event[] = [
    { id: 'ev1', title: "Curator's Talk: Modernism", type: "Talk", date: "Today, 4:00 PM", location: "Auditorium", imageUrl: "https://picsum.photos/id/20/400/300", description: "Modernism in Gujarat." },
    { id: 'ev2', title: "Sculpting Workshop", type: "Workshop", date: "Sat, 11:00 AM", location: "Studio A", imageUrl: "https://picsum.photos/id/30/400/300", description: "Hands-on sculpting." }
];

const DEFAULT_PAGE_ASSETS: PageAssets = {
  about: {
    hero: "https://picsum.photos/id/122/1600/600",
    atrium: "https://picsum.photos/id/238/800/800",
    title: "Our Story",
    introTitle: "A new cultural landmark in Gandhinagar.",
    introPara1: "Established in 2024, MOCA stands as a testament to the evolving cultural landscape of Gujarat.",
    introPara2: "We believe that modern art is a mirror to society.",
    missionTitle: "Our Mission",
    missionDesc: "To inspire creativity through the presentation of modern art.",
    globalTitle: "Global Perspective",
    globalDesc: "Fostering international collaborations.",
    communityTitle: "Community First",
    communityDesc: "Making art accessible to everyone.",
    archTitle: "Architecture & Space",
    archPara1: "The building reflects modernist planning principles.",
    archPara2: "Spanning 40,000 square feet of gallery space.",
    team: [
      { id: 't1', name: 'Dr. Aarav Patel', role: 'Director', imageUrl: 'https://picsum.photos/id/64/400/400' },
      { id: 't2', name: 'Meera Shah', role: 'Curator', imageUrl: 'https://picsum.photos/id/65/400/400' }
    ]
  },
  visit: { 
    hero: "https://picsum.photos/id/445/1600/800",
    hours: "Tuesday — Sunday: 10:30 — 18:00",
    locationText: "Inside Veer Residency, Gandhinagar Mahudi, Gujarat",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=23.506205,72.754318",
    admissionInfo: "Admission is free. Pre-registration recommended.",
    parkingInfo: "Free visitor parking available."
  },
  membership: { hero: "https://picsum.photos/id/1015/600/600" },
  home: { heroBg: "" }
};

const DEFAULT_GALLERY = [
  { speed: 0.1, direction: -1, images: ["https://picsum.photos/id/20/800/800", "https://picsum.photos/id/24/800/800", "https://picsum.photos/id/28/800/800"] },
  { speed: 0.25, direction: 1, images: ["https://picsum.photos/id/36/800/800", "https://picsum.photos/id/38/800/800", "https://picsum.photos/id/42/800/800"] }
];

// Initialize DB for images
const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e: any) => e.target.result.createObjectStore(STORE_NAME);
        request.onsuccess = (e: any) => resolve(e.target.result);
        request.onerror = () => reject();
    });
};

/**
 * CORE BOOTSTRAP: Instant synchronous load + DB sync
 */
export const bootstrapMuseumData = async () => {
    // 1. Synchronous Load from LocalStorage (Instant survival on refresh)
    const keys = [
        'moca_page_assets', 'moca_exhibitions', 'moca_artworks', 
        'moca_collectables', 'moca_events', 'moca_homepage_gallery',
        'moca_bookings', 'moca_shop_orders', 'moca_newsletter', 'moca_staff_mode',
        'moca_reviews'
    ];

    keys.forEach(key => {
        const data = localStorage.getItem(LS_PREFIX + key);
        if (data) {
            try {
                cache[key] = JSON.parse(data);
            } catch (e) {
                console.error("Corrupt LS data for", key);
            }
        }
    });

    // 2. Default Fallbacks if LS is empty
    if (!cache['moca_page_assets']) cache['moca_page_assets'] = DEFAULT_PAGE_ASSETS;
    if (!cache['moca_exhibitions']) cache['moca_exhibitions'] = EXHIBITIONS;
    if (!cache['moca_artworks']) cache['moca_artworks'] = ARTWORKS;
    if (!cache['moca_collectables']) cache['moca_collectables'] = COLLECTABLES;
    if (!cache['moca_events']) cache['moca_events'] = DEFAULT_EVENTS;
    if (!cache['moca_homepage_gallery']) cache['moca_homepage_gallery'] = DEFAULT_GALLERY;
    if (!cache['moca_reviews']) cache['moca_reviews'] = [];

    console.debug("Bootstrap: Memory cache ready.");
    return Promise.resolve();
};

const saveToStorage = (key: string, data: any) => {
    cache[key] = data;
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(data));
};

export const getPageAssets = (): PageAssets => cache['moca_page_assets'];
export const savePageAssets = (data: PageAssets) => saveToStorage('moca_page_assets', data);

export const getExhibitions = (): Exhibition[] => cache['moca_exhibitions'];
export const saveExhibitions = (data: Exhibition[]) => saveToStorage('moca_exhibitions', data);

export const getArtworks = (): Artwork[] => cache['moca_artworks'];
export const saveArtworks = (data: Artwork[]) => saveToStorage('moca_artworks', data);

export const getEvents = (): Event[] => cache['moca_events'];
export const saveEvents = (data: Event[]) => saveToStorage('moca_events', data);

export const getCollectables = (): Collectable[] => cache['moca_collectables'];
export const saveCollectables = (data: Collectable[]) => saveToStorage('moca_collectables', data);

export const getHomepageGallery = () => cache['moca_homepage_gallery'];
export const saveHomepageGallery = (data: any) => saveToStorage('moca_homepage_gallery', data);

export const getBookings = (): Booking[] => cache['moca_bookings'] || [];
export const saveBooking = (booking: Booking) => {
    const all = getBookings();
    saveToStorage('moca_bookings', [booking, ...all]);
};

export const getShopOrders = (): ShopOrder[] => cache['moca_shop_orders'] || [];
export const saveShopOrder = (order: ShopOrder) => {
    const all = getShopOrders();
    saveToStorage('moca_shop_orders', [order, ...all]);
};

export const getNewsletterEmails = (): string[] => cache['moca_newsletter'] || [];
export const saveNewsletterEmail = (email: string) => {
    const all = getNewsletterEmails();
    if (!all.includes(email)) saveToStorage('moca_newsletter', [email, ...all]);
};

// Fix: Implement getReviews which was missing and causing a module error.
export const getReviews = (itemId: string): Review[] => {
    const allReviews: Review[] = cache['moca_reviews'] || [];
    return allReviews.filter(r => r.itemId === itemId);
};

// Fix: Implement addReview which was missing and causing a module error.
export const addReview = (review: Review) => {
    const allReviews = cache['moca_reviews'] || [];
    saveToStorage('moca_reviews', [review, ...allReviews]);
};

export const getStaffMode = (): boolean => cache['moca_staff_mode'] || false;
export const setStaffMode = (enabled: boolean) => saveToStorage('moca_staff_mode', enabled);

export const clearAllAppData = () => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(LS_PREFIX)) localStorage.removeItem(key);
    });
    window.location.reload();
};

export const getStorageUsage = () => {
    const str = JSON.stringify(cache);
    return (new Blob([str]).size / 1024 / 1024).toFixed(2);
};
