
// Define type interfaces first
export interface SeoPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  robotsDirective: string;
  templateId: string | null;
  structuredData: object | null;
  publishStatus: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  lastImpressions?: number;
  lastClicks?: number;
  lastPosition?: number;
  content?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
}

export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean';
  label: string;
  required: boolean;
  options?: string[]; // For select fields
}

export interface AnalyticsData {
  id: string;
  period: string;
  impressions: number;
  clicks: number;
  position: number;
}

// Mock data
export const mockSeoPages: SeoPage[] = [
  {
    id: "1",
    slug: "hotels-in-paris",
    title: "Top 10 Hotels in Paris - Best Accommodations [2025]",
    metaDescription: "Find the best hotels in Paris for your 2025 vacation. Luxury, boutique and budget accommodations near top attractions with exclusive deals.",
    keywords: ["paris hotels", "hotels in paris", "best paris accommodations", "luxury paris hotels"],
    canonicalUrl: "https://example.com/hotels-in-paris",
    robotsDirective: "index,follow",
    templateId: "1",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Hotel Splendide Royal Paris",
          "url": "https://example.com/hotels-in-paris#royal"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Hotel Le Meurice",
          "url": "https://example.com/hotels-in-paris#meurice"
        }
      ]
    },
    publishStatus: "published",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2025-01-20T08:15:00Z",
    lastImpressions: 12560,
    lastClicks: 348,
    lastPosition: 2.3,
    content: "<h2>Discover the Best Hotels in Paris</h2><p>Paris, the City of Light, offers a wide range of accommodation options from luxury palaces to charming boutique hotels. Our carefully curated list highlights the top 10 hotels that combine excellent location, service, and value.</p>"
  },
  {
    id: "2",
    slug: "hotels-in-london",
    title: "15 Amazing Hotels in London - Central & Affordable",
    metaDescription: "Discover top rated hotels in London. Central locations near attractions with great amenities and best prices guaranteed.",
    keywords: ["london hotels", "hotels in london", "central london accommodations"],
    canonicalUrl: "https://example.com/hotels-in-london",
    robotsDirective: "index,follow",
    templateId: "1",
    structuredData: null,
    publishStatus: "published",
    createdAt: "2023-07-22T14:20:00Z",
    updatedAt: "2025-02-05T11:45:00Z",
    lastImpressions: 9870,
    lastClicks: 275,
    lastPosition: 3.1,
    content: "<h2>London's Finest Accommodations</h2><p>From historic hotels in Westminster to modern options in Shoreditch, London offers accommodations for every taste and budget. This guide covers the best centrally-located options with easy access to major attractions.</p>"
  },
  {
    id: "3",
    slug: "best-restaurants-new-york",
    title: "25 Best Restaurants in New York City - Local Favorites",
    metaDescription: "Explore the best restaurants in NYC with our local guide. From fine dining to hidden gems, find perfect places to eat in New York City.",
    keywords: ["nyc restaurants", "best restaurants new york", "where to eat nyc"],
    canonicalUrl: "https://example.com/best-restaurants-new-york",
    robotsDirective: "index,follow",
    templateId: "2",
    structuredData: null,
    publishStatus: "draft",
    createdAt: "2023-12-10T09:15:00Z",
    updatedAt: "2025-03-18T16:30:00Z",
    lastImpressions: 5420,
    lastClicks: 147,
    lastPosition: 5.7,
    content: "<h2>New York's Culinary Scene</h2><p>New York City's diverse food scene offers everything from Michelin-starred restaurants to beloved street food vendors. Our local experts have selected the absolute best dining experiences across all five boroughs.</p>"
  },
  {
    id: "4",
    slug: "beaches-miami",
    title: "12 Stunning Beaches in Miami - Local's Guide [Updated]",
    metaDescription: "Discover Miami's most beautiful beaches from South Beach to Key Biscayne. Tips on parking, facilities and best times to visit.",
    keywords: ["miami beaches", "best beaches miami", "south beach miami"],
    canonicalUrl: "https://example.com/beaches-miami",
    robotsDirective: "index,follow",
    templateId: "2",
    structuredData: null,
    publishStatus: "published",
    createdAt: "2023-08-05T15:45:00Z",
    updatedAt: "2025-01-30T13:20:00Z",
    lastImpressions: 8740,
    lastClicks: 312,
    lastPosition: 1.8,
    content: "<h2>Miami's Beautiful Beaches</h2><p>Miami is world-famous for its stunning beaches with crystal clear waters and white sand. This local's guide provides insider tips on the best spots, parking information, and amenities at each beach.</p>"
  },
  {
    id: "5",
    slug: "hiking-trails-colorado",
    title: "Top 20 Hiking Trails in Colorado - Beginner to Expert",
    metaDescription: "Explore Colorado's most scenic hiking trails for all skill levels. Mountain views, wildlife spotting and detailed trail information.",
    keywords: ["colorado hiking", "hiking trails colorado", "rocky mountain hikes"],
    canonicalUrl: "https://example.com/hiking-trails-colorado",
    robotsDirective: "index,follow",
    templateId: "2",
    structuredData: null,
    publishStatus: "archived",
    createdAt: "2022-05-18T11:25:00Z",
    updatedAt: "2024-06-12T10:10:00Z",
    lastImpressions: 3250,
    lastClicks: 95,
    lastPosition: 8.2,
    content: "<h2>Colorado's Majestic Hiking Trails</h2><p>Colorado offers some of the most breathtaking hiking opportunities in North America, from easy nature walks to challenging mountain ascents. This guide covers trails suitable for all experience levels.</p>"
  },
];

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Hotel Listing Template",
    description: "Template for hotel listing pages with structured data",
    fields: [
      {
        name: "hotelName",
        type: "text",
        label: "Hotel Name",
        required: true
      },
      {
        name: "hotelRating",
        type: "number",
        label: "Star Rating",
        required: true
      },
      {
        name: "priceRange",
        type: "select",
        label: "Price Range",
        required: true,
        options: ["$", "$$", "$$$", "$$$$", "$$$$$"]
      }
    ]
  },
  {
    id: "2",
    name: "Restaurant Listing Template",
    description: "Template for restaurant listing pages with structured data",
    fields: [
      {
        name: "restaurantName",
        type: "text",
        label: "Restaurant Name",
        required: true
      },
      {
        name: "cuisine",
        type: "select",
        label: "Cuisine Type",
        required: true,
        options: ["Italian", "French", "Japanese", "American", "Mexican", "Indian", "Other"]
      },
      {
        name: "reservationRequired",
        type: "boolean",
        label: "Reservation Required",
        required: false
      }
    ]
  }
];

export const mockAnalyticsData: AnalyticsData[] = [
  {
    id: "1",
    period: "Jan 2025",
    impressions: 8500,
    clicks: 320,
    position: 4.2
  },
  {
    id: "2",
    period: "Feb 2025",
    impressions: 9200,
    clicks: 356,
    position: 3.8
  },
  {
    id: "3",
    period: "Mar 2025",
    impressions: 10500,
    clicks: 420,
    position: 3.5
  },
  {
    id: "4",
    period: "Apr 2025",
    impressions: 11800,
    clicks: 512,
    position: 3.2
  },
  {
    id: "5",
    period: "May 2025",
    impressions: 13200,
    clicks: 620,
    position: 2.9
  },
  {
    id: "6",
    period: "Jun 2025",
    impressions: 15000,
    clicks: 725,
    position: 2.5
  }
];
