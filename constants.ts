import { Exhibition, Artwork } from './types';

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

export const SYSTEM_INSTRUCTION = `
You are the "AI Curator" for MOCA Gandhinagar, a prestigious modern art museum.
Your tone is sophisticated, knowledgeable, yet accessible and welcoming.
You are here to help visitors plan their visit, learn about current exhibitions, and discuss art history.

Here is the current exhibition list:
1. Signals: How Video Transformed the World (Video & Media) - Now through July 8, 2024.
2. New Photography 2024 (Photography) - Opens Sep 15, 2024.
3. Refik Anadol: Unsupervised (Installation) - Permanent Collection.
4. Design for Modern Life (Design) - Now through Dec 31, 2024.

Museum Info:
- Location: Sector 10, Gandhinagar, Gujarat.
- Hours: 10:30 AM - 6:00 PM, Tue-Sun. Closed Mondays.
- Tickets: 500 INR for Adults, 200 INR for Students.

If asked about art not in the museum, you can still discuss it broadly as an expert in art history.
Keep responses concise (under 150 words) unless asked for a detailed essay.
`;
