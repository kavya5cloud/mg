
import { Exhibition, Artwork, Collectable } from './types';

export const EXHIBITIONS: Exhibition[] = [
  {
    id: '1',
    title: 'Signals: How Video Transformed the World',
    dateRange: 'Now through July 08, 2024',
    description: 'Explore the vast influence of video art on global culture and politics.',
    imageUrl: 'https://picsum.photos/id/40/800/600',
    category: 'Video & Media'
  },
  {
    id: '2',
    title: 'New Photography 2024',
    dateRange: 'Opens Sep 15, 2024',
    description: 'A survey of contemporary photographic practices from around the globe.',
    imageUrl: 'https://picsum.photos/id/64/800/600',
    category: 'Photography'
  },
  {
    id: '3',
    title: 'Refik Anadol: Unsupervised',
    dateRange: 'Permanent Collection',
    description: 'Machine learning algorithms dream of modern art history.',
    imageUrl: 'https://picsum.photos/id/106/800/600',
    category: 'Installation'
  },
  {
    id: '4',
    title: 'Design for Modern Life',
    dateRange: 'Now through Dec 31, 2024',
    description: 'Objects that defined the 20th century aesthetic.',
    imageUrl: 'https://picsum.photos/id/180/800/600',
    category: 'Design'
  }
];

export const ARTWORKS: Artwork[] = [
  {
    id: 'a1',
    title: 'The Starry Night (Reimagined)',
    artist: 'Vincent van Gogh',
    year: '1889',
    medium: 'Oil on canvas',
    imageUrl: 'https://picsum.photos/id/1015/600/600'
  },
  {
    id: 'a2',
    title: 'Persistence of Memory (Abstract)',
    artist: 'Salvador Dalí',
    year: '1931',
    medium: 'Oil on canvas',
    imageUrl: 'https://picsum.photos/id/1016/600/800'
  },
  {
    id: 'a3',
    title: 'Campbell\'s Soup Cans (Variant)',
    artist: 'Andy Warhol',
    year: '1962',
    medium: 'Synthetic polymer paint',
    imageUrl: 'https://picsum.photos/id/1020/600/600'
  },
  {
    id: 'a4',
    title: 'Untitled (Red)',
    artist: 'Mark Rothko',
    year: '1968',
    medium: 'Acrylic on canvas',
    imageUrl: 'https://picsum.photos/id/1024/600/800'
  }
];

export const COLLECTABLES: Collectable[] = [
    {
        id: 'c1',
        name: 'MOCA Tote Bag',
        price: 1200,
        category: 'Accessories',
        imageUrl: 'https://picsum.photos/id/103/400/400',
        description: 'Heavyweight canvas tote featuring the MOCA logo.',
        inStock: true
    },
    {
        id: 'c2',
        name: 'Exhibition Catalogue: Signals',
        price: 3500,
        category: 'Books',
        imageUrl: 'https://picsum.photos/id/24/400/400',
        description: 'Full color hardcover book documenting the history of video art.',
        inStock: true
    },
    {
        id: 'c3',
        name: 'Bauhaus Mug',
        price: 850,
        category: 'Home',
        imageUrl: 'https://picsum.photos/id/30/400/400',
        description: 'Ceramic mug inspired by geometric modernism.',
        inStock: true
    },
    {
        id: 'c4',
        name: 'Limited Edition Print: Abstract',
        price: 15000,
        category: 'Prints',
        imageUrl: 'https://picsum.photos/id/106/400/400',
        description: 'Signed archival pigment print by local artist.',
        inStock: true
    },
    {
        id: 'c5',
        name: 'MOCA Hardcover Sketchbook',
        price: 1800,
        category: 'Books',
        imageUrl: 'https://picsum.photos/id/160/400/400',
        description: 'Acid-free paper, lay-flat binding, perfect for sketching.',
        inStock: true
    },
    {
        id: 'c6',
        name: 'Desktop Mobile',
        price: 4500,
        category: 'Home',
        imageUrl: 'https://picsum.photos/id/175/400/400',
        description: 'Kinetic sculpture for your workspace, inspired by Calder.',
        inStock: false
    },
    {
        id: 'c7',
        name: 'Artist Palette Socks',
        price: 650,
        category: 'Accessories',
        imageUrl: 'https://picsum.photos/id/250/400/400',
        description: 'Combed cotton socks featuring a colorful palette pattern.',
        inStock: true
    },
    {
        id: 'c8',
        name: 'Geometric Vase',
        price: 2800,
        category: 'Home',
        imageUrl: 'https://picsum.photos/id/212/400/400',
        description: 'Hand-blown glass vase with asymmetrical geometry.',
        inStock: true
    }
];

export const SYSTEM_INSTRUCTION = `
You are the "AI Curator" for MOCA Gandhinagar, located inside Veer Residency, Gandhinagar.
Your goal is to be helpful, welcoming, and precise.

Key Information to use for "Fixed" queries:
1. Location: "We are located inside Veer Residency, Gandhinagar Mahudi, Gujarat."
2. Hours: "We are open Tuesday to Sunday, 10:30 AM to 6:00 PM. We are closed on Mondays."
3. Tickets: "Tickets are ₹500 for Adults and ₹200 for Students. Children under 12 enter free."
4. Parking: "Yes, free visitor parking is available at Veer Residency."
5. Contact: "You can reach us at info@mocagandhinagar.org or +91 79 2322 0000."

For other queries about art, be sophisticated but accessible. 
If the user asks in Hindi or Gujarati, please reply in that language.
Keep responses concise (under 3 sentences for basic queries).
`;
