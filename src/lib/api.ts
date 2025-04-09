import { SeoPage, Template, mockSeoPages, mockTemplates, mockAnalyticsData } from "./mock-data";
import { toast } from "sonner";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// SEO Pages API
export const fetchSeoPages = async (): Promise<SeoPage[]> => {
  await delay(800);
  return [...mockSeoPages];
};

export const fetchSeoPageById = async (id: string): Promise<SeoPage | undefined> => {
  await delay(600);
  return mockSeoPages.find(page => page.id === id);
};

export const createSeoPage = async (page: Omit<SeoPage, "id" | "createdAt" | "updatedAt">): Promise<SeoPage> => {
  await delay(1000);
  
  const newPage: SeoPage = {
    ...page,
    id: `${mockSeoPages.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  toast.success("SEO page created successfully");
  return newPage;
};

export const updateSeoPage = async (page: SeoPage): Promise<SeoPage> => {
  await delay(1000);
  
  const updatedPage: SeoPage = {
    ...page,
    updatedAt: new Date().toISOString(),
  };
  
  toast.success("SEO page updated successfully");
  return updatedPage;
};

export const deleteSeoPage = async (id: string): Promise<void> => {
  await delay(800);
  toast.success("SEO page deleted successfully");
};

// Templates API
export const fetchTemplates = async (): Promise<Template[]> => {
  await delay(700);
  return [...mockTemplates];
};

// Analytics API
export const fetchAnalyticsData = async (): Promise<typeof mockAnalyticsData> => {
  await delay(1200);
  return [...mockAnalyticsData];
};

// Sitemap API
export const regenerateSitemap = async (): Promise<void> => {
  await delay(1500);
  toast.success("Sitemap regenerated successfully");
};

// Internal Links API
export interface InternalLink {
  id: string;
  sourcePageId: string;
  targetPageId: string;
  anchorText: string;
  createdAt: string;
}

export const fetchInternalLinks = async (): Promise<InternalLink[]> => {
  await delay(800);
  return []; // Mock empty array for now
};

export const createInternalLink = async (
  sourcePageId: string,
  targetPageId: string,
  anchorText: string
): Promise<InternalLink> => {
  await delay(1000);
  
  const newLink: InternalLink = {
    id: Math.random().toString(36).substring(2, 9),
    sourcePageId,
    targetPageId,
    anchorText,
    createdAt: new Date().toISOString()
  };
  
  toast.success("Internal link created successfully");
  return newLink;
};

export const deleteInternalLink = async (id: string): Promise<void> => {
  await delay(800);
  toast.success("Internal link deleted successfully");
};

// Robots.txt API
export const fetchRobotsContent = async (): Promise<string> => {
  await delay(600);
  // This would typically fetch from a server endpoint
  return `User-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: *\nAllow: /`;
};

export const updateRobotsContent = async (content: string): Promise<void> => {
  await delay(1000);
  // This would typically update the server's robots.txt file
  toast.success("Robots.txt content updated successfully");
};

// Search functionality
export async function searchPages(query: string): Promise<SeoPage[]> {
  // In a real app, this would call an API endpoint
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  
  // Filter mock data based on query
  const lowercaseQuery = query.toLowerCase();
  return mockSeoPages.filter((page) => 
    page.title.toLowerCase().includes(lowercaseQuery) ||
    page.slug.toLowerCase().includes(lowercaseQuery) ||
    page.metaDescription?.toLowerCase().includes(lowercaseQuery) ||
    page.keywords?.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))
  );
}

// Multilingual SEO Support
export interface HreflangTag {
  locale: string;
  url: string;
}

export interface LocalizedPageContent {
  locale: string;
  title: string;
  metaDescription: string;
  content: string;
}

export interface MultilingualSeoPageData {
  id: string;
  pageId: string;
  defaultLocale: string;
  alternateLocales: string[];
  hreflangs: HreflangTag[];
  localizedContent: LocalizedPageContent[];
}

// Get multilingual data for a page
export async function getPageMultilingualData(pageId: string): Promise<MultilingualSeoPageData | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Return mock data for demo purposes
  const mockPage = mockSeoPages.find(page => page.id === pageId);
  
  if (!mockPage) return null;
  
  return {
    id: `ml-${pageId}`,
    pageId,
    defaultLocale: 'en-US',
    alternateLocales: ['es-ES', 'fr-FR', 'de-DE'],
    hreflangs: [
      { locale: 'en-US', url: `https://example.com/${mockPage.slug}` },
      { locale: 'es-ES', url: `https://example.com/es/${mockPage.slug}` },
      { locale: 'fr-FR', url: `https://example.com/fr/${mockPage.slug}` },
      { locale: 'de-DE', url: `https://example.com/de/${mockPage.slug}` },
    ],
    localizedContent: [
      {
        locale: 'en-US',
        title: mockPage.title,
        metaDescription: mockPage.metaDescription || '',
        content: mockPage.content || '',
      },
      {
        locale: 'es-ES',
        title: `${mockPage.title} (Español)`,
        metaDescription: mockPage.metaDescription ? `${mockPage.metaDescription} (Español)` : '',
        content: mockPage.content ? `${mockPage.content} (Español)` : '',
      },
      {
        locale: 'fr-FR',
        title: `${mockPage.title} (Français)`,
        metaDescription: mockPage.metaDescription ? `${mockPage.metaDescription} (Français)` : '',
        content: mockPage.content ? `${mockPage.content} (Français)` : '',
      },
      {
        locale: 'de-DE',
        title: `${mockPage.title} (Deutsch)`,
        metaDescription: mockPage.metaDescription ? `${mockPage.metaDescription} (Deutsch)` : '',
        content: mockPage.content ? `${mockPage.content} (Deutsch)` : '',
      },
    ]
  };
}

// Update multilingual data for a page
export async function updatePageMultilingualData(data: MultilingualSeoPageData): Promise<MultilingualSeoPageData> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // In a real app, this would persist the data
  console.log("Updating multilingual data:", data);
  
  return data;
}
