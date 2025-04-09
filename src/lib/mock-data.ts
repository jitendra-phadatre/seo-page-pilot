
export interface SeoPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string | null;
  robotsDirective: string;
  templateId: string | null;
  structuredData: object | null;
  publishStatus: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  lastImpressions?: number;
  lastClicks?: number;
  lastPosition?: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  dynamicFields: string[];
}

export interface AnalyticsData {
  period: string;
  impressions: number;
  clicks: number;
  position: number;
}

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
  },
];

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "City Hotel Template",
    description: "Template for city hotel pages with customizable sections for top hotels, map, and amenities",
    dynamicFields: ["cityName", "countryName", "hotelCount", "topAreaName"],
  },
  {
    id: "2",
    name: "Local Guide Template",
    description: "Template for local guide pages with sections for attractions, tips, and recommendations",
    dynamicFields: ["locationName", "categoryName", "itemCount", "bestSeason"],
  },
];

export const mockAnalyticsData: AnalyticsData[] = [
  { period: "Jan", impressions: 45000, clicks: 3200, position: 3.8 },
  { period: "Feb", impressions: 52000, clicks: 3800, position: 3.5 },
  { period: "Mar", impressions: 58000, clicks: 4100, position: 3.2 },
  { period: "Apr", impressions: 67000, clicks: 4700, position: 2.9 },
  { period: "May", impressions: 72000, clicks: 5200, position: 2.7 },
  { period: "Jun", impressions: 78000, clicks: 5600, position: 2.5 },
];
