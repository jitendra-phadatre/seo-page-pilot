
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
