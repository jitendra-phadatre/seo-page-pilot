
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface GeneralSettings {
  siteUrl: string;
  defaultLanguage: string;
  timeZone: string;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultMetaDescription: string;
  titleSeparator: string;
  defaultKeywords: string;
  googleVerification: string;
  bingVerification: string;
  defaultRobotsDirective: string;
  generateSitemapAutomatically: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pagePublishNotifications: boolean;
  analyticsReportNotifications: boolean;
  securityAlertNotifications: boolean;
}

export interface AnalyticsSettings {
  googleSearchConsoleConnected: boolean;
  googleAnalyticsConnected: boolean;
  lastSyncDate: string | null;
}

const jsonToObject = <T>(json: Json | null): T | null => {
  if (json === null) return null;
  if (typeof json === 'object') return json as T;
  if (typeof json === 'string') {
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      console.error("Failed to parse JSON string:", e);
      return null;
    }
  }
  return null;
};

export async function getGeneralSettings(): Promise<GeneralSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'general_settings')
      .single();

    if (error) throw error;

    const settings = jsonToObject<GeneralSettings>(data.value);
    return settings || {
      siteUrl: "https://example.com",
      defaultLanguage: "en-US",
      timeZone: "UTC",
    };
  } catch (error) {
    console.error("Error fetching general settings:", error);
    return {
      siteUrl: "https://example.com",
      defaultLanguage: "en-US",
      timeZone: "UTC",
    };
  }
}

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'seo_settings')
      .single();

    if (error) throw error;

    const settings = jsonToObject<SeoSettings>(data.value);
    return settings || {
      defaultTitle: "Traveazy Travel Destinations | Plan Your Dream Vacation",
      defaultMetaDescription: "Discover amazing travel destinations with Traveazy. Find the best hotels, flights, and vacation packages for your dream getaway.",
      titleSeparator: " | ",
      defaultKeywords: "travel, vacation, hotels, flights, destinations, tourism, travel guide",
      googleVerification: "",
      bingVerification: "",
      defaultRobotsDirective: "index,follow",
      generateSitemapAutomatically: true,
    };
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return {
      defaultTitle: "Traveazy Travel Destinations | Plan Your Dream Vacation",
      defaultMetaDescription: "Discover amazing travel destinations with Traveazy. Find the best hotels, flights, and vacation packages for your dream getaway.",
      titleSeparator: " | ",
      defaultKeywords: "travel, vacation, hotels, flights, destinations, tourism, travel guide",
      googleVerification: "",
      bingVerification: "",
      defaultRobotsDirective: "index,follow",
      generateSitemapAutomatically: true,
    };
  }
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'notification_settings')
      .single();

    if (error) throw error;

    const settings = jsonToObject<NotificationSettings>(data.value);
    return settings || {
      emailNotifications: true,
      pagePublishNotifications: true,
      analyticsReportNotifications: true,
      securityAlertNotifications: true,
    };
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return {
      emailNotifications: true,
      pagePublishNotifications: true,
      analyticsReportNotifications: true,
      securityAlertNotifications: true,
    };
  }
}

export async function getAnalyticsSettings(): Promise<AnalyticsSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'analytics_settings')
      .single();

    if (error) throw error;

    const settings = jsonToObject<AnalyticsSettings>(data.value);
    return settings || {
      googleSearchConsoleConnected: false,
      googleAnalyticsConnected: false,
      lastSyncDate: null,
    };
  } catch (error) {
    console.error("Error fetching analytics settings:", error);
    return {
      googleSearchConsoleConnected: false,
      googleAnalyticsConnected: false,
      lastSyncDate: null,
    };
  }
}

export async function updateGeneralSettings(settings: GeneralSettings): Promise<GeneralSettings> {
  try {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: settings as unknown as Json })
      .eq('key', 'general_settings');

    if (error) throw error;
    
    toast.success("General settings saved successfully");
    return settings;
  } catch (error) {
    console.error("Error updating general settings:", error);
    toast.error("Failed to save general settings");
    throw error;
  }
}

export async function updateSeoSettings(settings: SeoSettings): Promise<SeoSettings> {
  try {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: settings as unknown as Json })
      .eq('key', 'seo_settings');

    if (error) throw error;
    
    toast.success("SEO settings saved successfully");
    return settings;
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    toast.error("Failed to save SEO settings");
    throw error;
  }
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
  try {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: settings as unknown as Json })
      .eq('key', 'notification_settings');

    if (error) throw error;
    
    toast.success("Notification preferences saved successfully");
    return settings;
  } catch (error) {
    console.error("Error updating notification settings:", error);
    toast.error("Failed to save notification preferences");
    throw error;
  }
}

export async function updateAnalyticsSettings(settings: AnalyticsSettings): Promise<AnalyticsSettings> {
  try {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: settings as unknown as Json })
      .eq('key', 'analytics_settings');

    if (error) throw error;
    
    toast.success("Analytics settings saved successfully");
    return settings;
  } catch (error) {
    console.error("Error updating analytics settings:", error);
    toast.error("Failed to save analytics settings");
    throw error;
  }
}

export async function connectGoogleSearchConsole(): Promise<AnalyticsSettings> {
  try {
    // In a real app, this would redirect to Google OAuth
    // For now, we'll simulate a successful connection
    const currentSettings = await getAnalyticsSettings();
    const updatedSettings = {
      ...currentSettings,
      googleSearchConsoleConnected: true,
      lastSyncDate: new Date().toISOString(),
    };
    
    await updateAnalyticsSettings(updatedSettings);
    toast.success("Google Search Console connected successfully");
    return updatedSettings;
  } catch (error) {
    console.error("Error connecting Google Search Console:", error);
    toast.error("Failed to connect Google Search Console");
    throw error;
  }
}
