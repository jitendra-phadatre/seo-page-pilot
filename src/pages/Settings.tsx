
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Search, Bell, LineChart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  getGeneralSettings, 
  getSeoSettings, 
  getNotificationSettings,
  getAnalyticsSettings,
  updateGeneralSettings,
  updateSeoSettings,
  updateNotificationSettings,
  updateAnalyticsSettings,
  connectGoogleSearchConsole,
  GeneralSettings as GeneralSettingsType,
  SeoSettings as SeoSettingsType,
  NotificationSettings as NotificationSettingsType,
  AnalyticsSettings as AnalyticsSettingsType
} from "@/lib/settings-api";

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pagePublishNotifications: z.boolean(),
  analyticsReportNotifications: z.boolean(),
  securityAlertNotifications: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

const globalSchema = z.object({
  siteUrl: z.string().url("Please enter a valid URL"),
  defaultLanguage: z.string().min(2, "Language code is required"),
  timeZone: z.string().min(1, "Timezone is required"),
});

type GlobalFormValues = z.infer<typeof globalSchema>;

const seoSchema = z.object({
  defaultTitle: z.string().min(5, "Title must be at least 5 characters"),
  defaultMetaDescription: z.string().min(50, "Meta description should be at least 50 characters"),
  titleSeparator: z.string().min(1, "Title separator is required"),
  defaultKeywords: z.string(),
  googleVerification: z.string(),
  bingVerification: z.string(),
  defaultRobotsDirective: z.string(),
  generateSitemapAutomatically: z.boolean(),
});

type SeoFormValues = z.infer<typeof seoSchema>;

const analyticsSchema = z.object({
  googleSearchConsoleConnected: z.boolean(),
  googleAnalyticsConnected: z.boolean(),
});

type AnalyticsFormValues = z.infer<typeof analyticsSchema>;

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettingsType | null>(null);
  
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pagePublishNotifications: true,
      analyticsReportNotifications: true,
      securityAlertNotifications: true,
    },
  });
  
  const globalForm = useForm<GlobalFormValues>({
    resolver: zodResolver(globalSchema),
    defaultValues: {
      siteUrl: "https://example.com",
      defaultLanguage: "en-US",
      timeZone: "UTC",
    },
  });

  const seoForm = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      defaultTitle: "Traveazy Travel Destinations | Plan Your Dream Vacation",
      defaultMetaDescription: "Discover amazing travel destinations with Traveazy. Find the best hotels, flights, and vacation packages for your dream getaway.",
      titleSeparator: " | ",
      defaultKeywords: "travel, vacation, hotels, flights, destinations, tourism, travel guide",
      googleVerification: "",
      bingVerification: "",
      defaultRobotsDirective: "index,follow",
      generateSitemapAutomatically: true,
    },
  });
  
  const analyticsForm = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      googleSearchConsoleConnected: false,
      googleAnalyticsConnected: false,
    },
  });
  
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        // Load general settings
        const generalSettings = await getGeneralSettings();
        globalForm.reset(generalSettings);
        
        // Load SEO settings
        const seoSettings = await getSeoSettings();
        seoForm.reset(seoSettings);
        
        // Load notification settings
        const notificationSettings = await getNotificationSettings();
        notificationForm.reset(notificationSettings);
        
        // Load analytics settings
        const analytics = await getAnalyticsSettings();
        setAnalyticsSettings(analytics);
        analyticsForm.reset({
          googleSearchConsoleConnected: analytics.googleSearchConsoleConnected,
          googleAnalyticsConnected: analytics.googleAnalyticsConnected,
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, [globalForm, seoForm, notificationForm, analyticsForm]);
  
  const handleNotificationSubmit = async (data: NotificationFormValues) => {
    setIsSaving(true);
    try {
      const settings: NotificationSettingsType = {
        emailNotifications: data.emailNotifications,
        pagePublishNotifications: data.pagePublishNotifications,
        analyticsReportNotifications: data.analyticsReportNotifications,
        securityAlertNotifications: data.securityAlertNotifications,
      };
      await updateNotificationSettings(settings);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleGlobalSubmit = async (data: GlobalFormValues) => {
    setIsSaving(true);
    try {
      const settings: GeneralSettingsType = {
        siteUrl: data.siteUrl,
        defaultLanguage: data.defaultLanguage,
        timeZone: data.timeZone,
      };
      await updateGeneralSettings(settings);
    } catch (error) {
      console.error("Error saving global settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeoSubmit = async (data: SeoFormValues) => {
    setIsSaving(true);
    try {
      const settings: SeoSettingsType = {
        defaultTitle: data.defaultTitle,
        defaultMetaDescription: data.defaultMetaDescription,
        titleSeparator: data.titleSeparator,
        defaultKeywords: data.defaultKeywords,
        googleVerification: data.googleVerification,
        bingVerification: data.bingVerification,
        defaultRobotsDirective: data.defaultRobotsDirective,
        generateSitemapAutomatically: data.generateSitemapAutomatically,
      };
      await updateSeoSettings(settings);
    } catch (error) {
      console.error("Error saving SEO settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleConnectGoogleConsole = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = await connectGoogleSearchConsole();
      setAnalyticsSettings(updatedSettings);
      analyticsForm.setValue('googleSearchConsoleConnected', true);
    } catch (error) {
      console.error("Error connecting to Google Search Console:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="content-area">
          <div className="mb-6">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Loading settings...</p>
          </div>
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="content-area">
        <div className="mb-6">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage application settings</p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="general">
              <Globe className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="mr-2 h-4 w-4" />
              SEO Configuration
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Global Settings</CardTitle>
                <CardDescription>
                  Configure global settings for your SEO management tool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...globalForm}>
                  <form onSubmit={globalForm.handleSubmit(handleGlobalSubmit)} className="space-y-6">
                    <FormField
                      control={globalForm.control}
                      name="siteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The base URL of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={globalForm.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <FormControl>
                            <Input placeholder="en-US" {...field} />
                          </FormControl>
                          <FormDescription>
                            The default language for your content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={globalForm.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Zone</FormLabel>
                          <FormControl>
                            <Input placeholder="UTC" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your preferred time zone for reporting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Configuration</CardTitle>
                <CardDescription>
                  Configure default SEO settings for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...seoForm}>
                  <form onSubmit={seoForm.handleSubmit(handleSeoSubmit)} className="space-y-6">
                    <FormField
                      control={seoForm.control}
                      name="defaultTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Page Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The default title used when no specific title is provided
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="defaultMetaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Meta Description</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormDescription>
                            The default meta description used when no specific description is provided
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="titleSeparator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title Separator</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder=" | " />
                          </FormControl>
                          <FormDescription>
                            Character(s) used to separate parts of the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="defaultKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Keywords</FormLabel>
                          <FormControl>
                            <Textarea rows={2} {...field} />
                          </FormControl>
                          <FormDescription>
                            Default keywords separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={seoForm.control}
                        name="googleVerification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Verification Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Google site verification code" />
                            </FormControl>
                            <FormDescription>
                              For Google Search Console verification
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={seoForm.control}
                        name="bingVerification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bing Verification Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Bing site verification code" />
                            </FormControl>
                            <FormDescription>
                              For Bing Webmaster Tools verification
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={seoForm.control}
                      name="defaultRobotsDirective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Robots Directive</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="index,follow" />
                          </FormControl>
                          <FormDescription>
                            Default robots directive for new pages
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={seoForm.control}
                      name="generateSitemapAutomatically"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Automatic Sitemap Generation</FormLabel>
                            <FormDescription>
                              Automatically generate sitemap.xml when pages are published
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save SEO configuration"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="pagePublishNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Page Publish Events</FormLabel>
                            <FormDescription>
                              Get notified when pages are published
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="analyticsReportNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Analytics Reports</FormLabel>
                            <FormDescription>
                              Get weekly analytics report summaries
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="securityAlertNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Security Alerts</FormLabel>
                            <FormDescription>
                              Get notified about security-related events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save preferences"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Integrations</CardTitle>
                <CardDescription>
                  Connect and manage your analytics platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">Google Search Console</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect to Google Search Console to view search performance data
                      </p>
                    </div>
                    <div>
                      {analyticsSettings?.googleSearchConsoleConnected ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Connected
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last sync: {formatDate(analyticsSettings?.lastSyncDate)}
                          </span>
                        </div>
                      ) : (
                        <Button onClick={handleConnectGoogleConsole} disabled={isSaving}>
                          {isSaving ? "Connecting..." : "Connect"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">Google Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect to Google Analytics to view website traffic data
                      </p>
                    </div>
                    <div>
                      {analyticsSettings?.googleAnalyticsConnected ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Connected
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last sync: {formatDate(analyticsSettings?.lastSyncDate)}
                          </span>
                        </div>
                      ) : (
                        <Button>Connect</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
