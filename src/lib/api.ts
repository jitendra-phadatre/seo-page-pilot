
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
