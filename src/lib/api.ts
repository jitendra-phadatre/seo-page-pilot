
import { supabase } from "@/integrations/supabase/client";
import { SeoPage, Template, TemplateField, mockSeoPages, mockTemplates, mockAnalyticsData } from "./mock-data";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Helper function to convert JSON to proper types
const jsonToObject = (json: Json | null): object | null => {
  if (json === null) return null;
  if (typeof json === 'object') return json as object;
  if (typeof json === 'string') {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to parse JSON string:", e);
      return null;
    }
  }
  return null;
};

// Helper function to safely cast JSON to TemplateField[] array
const jsonToTemplateFields = (json: Json | null): TemplateField[] => {
  if (json === null) return [];
  
  // If it's already an array, try to cast each item
  if (Array.isArray(json)) {
    return json.map(item => {
      // Ensure item is an object and not null
      if (item === null || typeof item !== 'object' || Array.isArray(item)) {
        return {
          name: '',
          type: 'text' as const,
          label: '',
          required: false
        };
      }
      
      // Access properties safely
      const fieldObj = item as { [key: string]: Json };
      
      return {
        name: typeof fieldObj.name === 'string' ? fieldObj.name : '',
        type: (typeof fieldObj.type === 'string' && 
              ['text', 'textarea', 'number', 'select', 'boolean'].includes(fieldObj.type)) 
              ? fieldObj.type as 'text' | 'textarea' | 'number' | 'select' | 'boolean'
              : 'text',
        label: typeof fieldObj.label === 'string' ? fieldObj.label : '',
        required: typeof fieldObj.required === 'boolean' ? fieldObj.required : false,
        options: Array.isArray(fieldObj.options) 
                ? fieldObj.options.map(opt => typeof opt === 'string' ? opt : String(opt))
                : undefined
      };
    });
  }
  
  // If it's an object but not an array, return empty array
  return [];
};

// Helper function to convert object to Json type for Supabase
const objectToJson = (obj: object | null): Json => {
  if (obj === null) return null;
  return obj as Json;
};

// Parse the publishStatus to ensure it's a valid value
const parsePublishStatus = (status: string): 'published' | 'draft' | 'archived' => {
  if (status === 'published' || status === 'draft' || status === 'archived') {
    return status as 'published' | 'draft' | 'archived';
  }
  return 'draft'; // Default fallback
};

// SEO Pages API
export const fetchSeoPages = async (): Promise<SeoPage[]> => {
  const { data, error } = await supabase
    .from('seo_pages')
    .select(`
      *,
      analytics_data(position, impressions)
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching SEO pages:", error);
    throw error;
  }

  // Format the data to match our SeoPage type
  return data.map(page => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    metaDescription: page.meta_description,
    content: page.content || '',
    keywords: page.keywords || [],
    canonicalUrl: page.canonical_url,
    robotsDirective: page.robots_directive || 'index,follow',
    publishStatus: parsePublishStatus(page.publish_status),
    templateId: page.template_id,
    structuredData: jsonToObject(page.structured_data),
    createdAt: page.created_at,
    updatedAt: page.updated_at,
    lastPosition: page.analytics_data?.[0]?.position || null,
    lastImpressions: page.analytics_data?.[0]?.impressions || null
  }));
};

export const fetchSeoPageById = async (id: string): Promise<SeoPage | undefined> => {
  const { data, error } = await supabase
    .from('seo_pages')
    .select(`
      *,
      analytics_data(position, impressions)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return undefined;
    }
    console.error("Error fetching SEO page:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    metaDescription: data.meta_description,
    content: data.content || '',
    keywords: data.keywords || [],
    canonicalUrl: data.canonical_url,
    robotsDirective: data.robots_directive || 'index,follow',
    publishStatus: parsePublishStatus(data.publish_status),
    templateId: data.template_id,
    structuredData: jsonToObject(data.structured_data),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastPosition: data.analytics_data?.[0]?.position || null,
    lastImpressions: data.analytics_data?.[0]?.impressions || null
  };
};

export const createSeoPage = async (page: Omit<SeoPage, "id" | "createdAt" | "updatedAt">): Promise<SeoPage> => {
  // Convert our UI model to match database schema
  const { data, error } = await supabase
    .from('seo_pages')
    .insert({
      title: page.title,
      slug: page.slug,
      meta_description: page.metaDescription,
      content: page.content,
      keywords: page.keywords,
      canonical_url: page.canonicalUrl,
      robots_directive: page.robotsDirective,
      publish_status: page.publishStatus,
      template_id: page.templateId === 'none' ? null : page.templateId,
      structured_data: objectToJson(page.structuredData as object)
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating SEO page:", error);
    throw error;
  }
  
  toast.success("SEO page created successfully");
  
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    metaDescription: data.meta_description,
    content: data.content || '',
    keywords: data.keywords || [],
    canonicalUrl: data.canonical_url,
    robotsDirective: data.robots_directive || 'index,follow',
    publishStatus: parsePublishStatus(data.publish_status),
    templateId: data.template_id,
    structuredData: jsonToObject(data.structured_data),
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateSeoPage = async (page: SeoPage): Promise<SeoPage> => {
  const { data, error } = await supabase
    .from('seo_pages')
    .update({
      title: page.title,
      slug: page.slug,
      meta_description: page.metaDescription,
      content: page.content,
      keywords: page.keywords,
      canonical_url: page.canonicalUrl,
      robots_directive: page.robotsDirective,
      publish_status: page.publishStatus,
      template_id: page.templateId === 'none' ? null : page.templateId,
      structured_data: objectToJson(page.structuredData as object)
    })
    .eq('id', page.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating SEO page:", error);
    throw error;
  }
  
  toast.success("SEO page updated successfully");
  
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    metaDescription: data.meta_description,
    content: data.content || '',
    keywords: data.keywords || [],
    canonicalUrl: data.canonical_url,
    robotsDirective: data.robots_directive || 'index,follow',
    publishStatus: parsePublishStatus(data.publish_status),
    templateId: data.template_id,
    structuredData: jsonToObject(data.structured_data),
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteSeoPage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('seo_pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting SEO page:", error);
    throw error;
  }
  
  toast.success("SEO page deleted successfully");
};

// Templates API
export const fetchTemplates = async (): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching templates:", error);
    // Fall back to mock data if there's an error
    return [...mockTemplates];
  }

  return data.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description || '',
    fields: jsonToTemplateFields(template.fields)
  }));
};

// Analytics API - Keep mock data for now
export const fetchAnalyticsData = async (): Promise<typeof mockAnalyticsData> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return [...mockAnalyticsData];
};

// Sitemap API
export const regenerateSitemap = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
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
  const { data, error } = await supabase
    .from('internal_links')
    .select('*');

  if (error) {
    console.error("Error fetching internal links:", error);
    return [];
  }

  return data.map(link => ({
    id: link.id,
    sourcePageId: link.source_page_id,
    targetPageId: link.target_page_id,
    anchorText: link.anchor_text,
    createdAt: link.created_at
  }));
};

export const createInternalLink = async (
  sourcePageId: string,
  targetPageId: string,
  anchorText: string
): Promise<InternalLink> => {
  const { data, error } = await supabase
    .from('internal_links')
    .insert({
      source_page_id: sourcePageId,
      target_page_id: targetPageId,
      anchor_text: anchorText
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating internal link:", error);
    throw error;
  }
  
  toast.success("Internal link created successfully");
  
  return {
    id: data.id,
    sourcePageId: data.source_page_id,
    targetPageId: data.target_page_id,
    anchorText: data.anchor_text,
    createdAt: data.created_at
  };
};

export const deleteInternalLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('internal_links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting internal link:", error);
    throw error;
  }
  
  toast.success("Internal link deleted successfully");
};

// Robots.txt API
export const fetchRobotsContent = async (): Promise<string> => {
  // This would typically fetch from a server endpoint
  return `User-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: *\nAllow: /`;
};

export const updateRobotsContent = async (content: string): Promise<void> => {
  // This would typically update the server's robots.txt file
  toast.success("Robots.txt content updated successfully");
};

// Search functionality
export async function searchPages(query: string): Promise<SeoPage[]> {
  const { data, error } = await supabase
    .from('seo_pages')
    .select('*')
    .or(`title.ilike.%${query}%,slug.ilike.%${query}%,meta_description.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error searching pages:", error);
    throw error;
  }

  return data.map(page => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    metaDescription: page.meta_description,
    content: page.content || '',
    keywords: page.keywords || [],
    canonicalUrl: page.canonical_url,
    robotsDirective: page.robots_directive || 'index,follow',
    publishStatus: parsePublishStatus(page.publish_status),
    templateId: page.template_id,
    structuredData: jsonToObject(page.structured_data),
    createdAt: page.created_at,
    updatedAt: page.updated_at
  }));
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
  // Fetch hreflang tags
  const { data: hreflangData, error: hreflangError } = await supabase
    .from('hreflang_tags')
    .select('*')
    .eq('page_id', pageId);

  if (hreflangError) {
    console.error("Error fetching hreflang tags:", hreflangError);
    return null;
  }

  // Fetch multilingual content
  const { data: contentData, error: contentError } = await supabase
    .from('multilingual_content')
    .select('*')
    .eq('page_id', pageId);

  if (contentError) {
    console.error("Error fetching multilingual content:", contentError);
    return null;
  }

  const hreflangs = hreflangData.map(tag => ({
    locale: tag.locale,
    url: tag.url
  }));

  const localizedContent = contentData.map(content => ({
    locale: content.locale,
    title: content.title,
    metaDescription: content.meta_description || '',
    content: content.content || ''
  }));

  // Extract all locales
  const allLocales = Array.from(new Set([
    ...hreflangs.map(tag => tag.locale),
    ...localizedContent.map(content => content.locale)
  ]));

  // Assume first locale is default - in a real app this would be stored somewhere
  const defaultLocale = allLocales[0] || 'en-US';
  
  return {
    id: `ml-${pageId}`,
    pageId,
    defaultLocale,
    alternateLocales: allLocales.filter(locale => locale !== defaultLocale),
    hreflangs,
    localizedContent
  };
}

// Update multilingual data for a page
export async function updatePageMultilingualData(data: MultilingualSeoPageData): Promise<MultilingualSeoPageData> {
  try {
    // Delete existing hreflang tags
    const { error: deleteHreflangError } = await supabase
      .from('hreflang_tags')
      .delete()
      .eq('page_id', data.pageId);
    
    if (deleteHreflangError) throw deleteHreflangError;
    
    // Insert new hreflang tags
    if (data.hreflangs.length > 0) {
      const hreflangRows = data.hreflangs.map(tag => ({
        page_id: data.pageId,
        locale: tag.locale,
        url: tag.url
      }));
      
      const { error: insertHreflangError } = await supabase
        .from('hreflang_tags')
        .insert(hreflangRows);
      
      if (insertHreflangError) throw insertHreflangError;
    }
    
    // Update existing content or insert new content
    for (const content of data.localizedContent) {
      const contentRow = {
        page_id: data.pageId,
        locale: content.locale,
        title: content.title,
        meta_description: content.metaDescription,
        content: content.content
      };
      
      const { error: upsertContentError } = await supabase
        .from('multilingual_content')
        .upsert(contentRow, {
          onConflict: 'page_id,locale'
        });
      
      if (upsertContentError) throw upsertContentError;
    }
    
    toast.success("Multilingual data updated successfully");
    return data;
    
  } catch (error) {
    console.error("Error updating multilingual data:", error);
    throw error;
  }
}
