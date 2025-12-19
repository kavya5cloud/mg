
import { EXHIBITIONS, ARTWORKS, COLLECTABLES } from '../constants';
import { Exhibition, Artwork, Collectable, ShopOrder, Review, Booking, PageAssets } from '../types';

// More reliable and diverse image IDs from Picsum
const DEFAULT_GALLERY = [
  {
    speed: 0.1,
    direction: -1,
    images: [
      "https://picsum.photos/id/20/800/800",
      "https://picsum.photos/id/24/800/800",
      "https://picsum.photos/id/28/800/800",
      "https://picsum.photos/id/30/800/800",
    ]
  },
  {
    speed: 0.25,
    direction: 1,
    images: [
      "https://picsum.photos/id/36/800/800",
      "https://picsum.photos/id/38/800/800",
      "https://picsum.photos/id/42/800/800",
      "https://picsum.photos/id/48/800/800",
    ]
  },
  {
    speed: 0.15,
    direction: -1,
    images: [
      "https://picsum.photos/id/52/800/800",
      "https://picsum.photos/id/55/800/800",
      "https://picsum.photos/id/60/800/800",
      "https://picsum.photos/id/64/800/800",
    ]
  }
];

const DEFAULT_PAGE_ASSETS: PageAssets = {
  about: {
    hero: "https://picsum.photos/id/122/1600/600",
    atrium: "https://picsum.photos/id/238/800/800",
    title: "Our Story",
    introTitle: "A new cultural landmark in the heart of the Green City.",
    introPara1: "Established in 2024, the Museum of Contemporary Art Gandhinagar (MOCA) stands as a testament to the evolving cultural landscape of Gujarat. Located at Veer Residency, Gandhinagar Mahudi, MOCA is not just a repository of objects, but a living, breathing space for dialogue, experimentation, and discovery.",
    introPara2: "We believe that modern art is a mirror to society. Our institution is dedicated to presenting the most thought-provoking art of our time, bridging the gap between local heritage and global contemporary movements.",
    missionTitle: "Our Mission",
    missionDesc: "To inspire creativity and critical thinking through the presentation, collection, and preservation of modern and contemporary art.",
    globalTitle: "Global Perspective",
    globalDesc: "While deeply rooted in the Indian context, MOCA Gandhinagar fosters an international outlook through worldwide collaborations.",
    communityTitle: "Community First",
    communityDesc: "We are committed to accessibility and education, striving to make contemporary art accessible to everyone.",
    archTitle: "Architecture & Space",
    archPara1: "The MOCA building itself is a work of art. Designed to reflect the modernist planning principles of Le Corbusier—who influenced the region's architecture—the museum features clean lines and raw concrete.",
    archPara2: "Spanning 40,000 square feet across three levels, the space includes flexible exhibition halls, a dedicated new media wing, a sculpture garden, and a research library.",
    team: [
      { id: 't1', name: 'Dr. Aarav Patel', role: 'Director & Chief Curator', imageUrl: 'https://picsum.photos/id/64/400/400' },
      { id: 't2', name: 'Meera Shah', role: 'Head of Education', imageUrl: 'https://picsum.photos/id/65/400/400' },
      { id: 't3', name: 'Sanjay Desai', role: 'Development Manager', imageUrl: 'https://picsum.photos/id/66/400/400' }
    ]
  },
  visit: {
    hero: "https://picsum.photos/id/20/400/300"
  },
  membership: {
    hero: "https://picsum.photos/id/1015/600/600"
  },
  home: {
    heroBg: ""
  }
};

// Reliable default images for the gallery
const VALIDATE_ASSETS = (data: any): data is PageAssets => {
    return data && data.about && data.about.hero && Array.isArray(data.about.team);
};

// Helper to manage localStorage
const getStorage = <T>(key: string, defaultData: T[] | T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            // If it's an array and empty, but default isn't, maybe we want default?
            // Special check for essential lists
            if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultData) && defaultData.length > 0) {
                return defaultData as T;
            }
            return parsed;
        }
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

export const getPageAssets = (): PageAssets => {
    const data = getStorage<PageAssets>('moca_page_assets', DEFAULT_PAGE_ASSETS);
    return VALIDATE_ASSETS(data) ? data : DEFAULT_PAGE_ASSETS;
};

export const savePageAssets = (data: PageAssets) => setStorage('moca_page_assets', data);

export const getExhibitions = (): Exhibition[] => getStorage<Exhibition[]>('moca_exhibitions', EXHIBITIONS);
export const saveExhibitions = (data: Exhibition[]) => setStorage('moca_exhibitions', data);

export const getArtworks = (): Artwork[] => getStorage<Artwork[]>('moca_artworks', ARTWORKS);
export const saveArtworks = (data: Artwork[]) => setStorage('moca_artworks', data);

export const getCollectables = (): Collectable[] => getStorage<Collectable[]>('moca_collectables', COLLECTABLES);
export const saveCollectables = (data: Collectable[]) => setStorage('moca_collectables', data);

export const getShopOrders = (): ShopOrder[] => getStorage<ShopOrder[]>('moca_shop_orders', []);
export const saveShopOrder = (order: ShopOrder) => {
    const orders = getShopOrders();
    setStorage('moca_shop_orders', [order, ...orders]);
};
export const updateShopOrders = (orders: ShopOrder[]) => setStorage('moca_shop_orders', orders);

export const getBookings = (): Booking[] => getStorage<Booking[]>('moca_bookings', []);
export const saveBooking = (booking: Booking) => {
    const bookings = getBookings();
    setStorage('moca_bookings', [booking, ...bookings]);
};

export const getHomepageGallery = () => {
    const data = getStorage('moca_homepage_gallery', DEFAULT_GALLERY);
    if (!Array.isArray(data) || data.length === 0 || !data[0].images) {
        localStorage.setItem('moca_homepage_gallery', JSON.stringify(DEFAULT_GALLERY));
        return DEFAULT_GALLERY;
    }
    return data;
};
export const saveHomepageGallery = (data: any) => setStorage('moca_homepage_gallery', data);
export const resetHomepageGallery = () => {
    localStorage.setItem('moca_homepage_gallery', JSON.stringify(DEFAULT_GALLERY));
    return DEFAULT_GALLERY;
};

export const getReviews = (itemId: string): Review[] => {
    const allReviews = getStorage<Review[]>('moca_reviews', []);
    return allReviews.filter(r => r.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
};

export const addReview = (review: Review) => {
    const allReviews = getStorage<Review[]>('moca_reviews', []);
    setStorage('moca_reviews', [review, ...allReviews]);
};

export const getNewsletterEmails = (): string[] => getStorage<string[]>('moca_newsletter', []);
export const saveNewsletterEmail = (email: string) => {
    const emails = getNewsletterEmails();
    if (!emails.includes(email)) {
        setStorage('moca_newsletter', [email, ...emails]);
    }
};

export const getStaffMode = (): boolean => getStorage<boolean>('moca_staff_mode', false);
export const setStaffMode = (enabled: boolean) => setStorage('moca_staff_mode', enabled);
