
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCode, Globe, LucideCloud, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const deploymentSchema = z.object({
  awsRegion: z.string().min(1, "AWS Region is required"),
  lambdaMemory: z.coerce.number().int().min(128).max(10240),
  lambdaTimeout: z.coerce.number().int().min(1).max(900),
});

type DeploymentSettings = z.infer<typeof deploymentSchema>;

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pagePublishNotifications: z.boolean(),
  analyticsReportNotifications: z.boolean(),
  securityAlertNotifications: z.boolean(),
});

type NotificationSettings = z.infer<typeof notificationSchema>;

const globalSchema = z.object({
  siteUrl: z.string().url("Please enter a valid URL"),
  defaultLanguage: z.string().min(2, "Language code is required"),
  timeZone: z.string().min(1, "Timezone is required"),
});

type GlobalSettings = z.infer<typeof globalSchema>;

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

type SeoSettings = z.infer<typeof seoSchema>;

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const deploymentForm = useForm<DeploymentSettings>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      awsRegion: "us-east-1",
      lambdaMemory: 512,
      lambdaTimeout: 30,
    },
  });
  
  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pagePublishNotifications: true,
      analyticsReportNotifications: true,
      securityAlertNotifications: true,
    },
  });
  
  const globalForm = useForm<GlobalSettings>({
    resolver: zodResolver(globalSchema),
    defaultValues: {
      siteUrl: "https://example.com",
      defaultLanguage: "en-US",
      timeZone: "UTC",
    },
  });

  const seoForm = useForm<SeoSettings>({
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
  
  const handleDeploymentSubmit = (data: DeploymentSettings) => {
    setIsSaving(true);
    // In a real application, this would save to a database
    setTimeout(() => {
      console.log("Deployment settings:", data);
      toast.success("Deployment settings saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  const handleNotificationSubmit = (data: NotificationSettings) => {
    setIsSaving(true);
    // In a real application, this would save to a database
    setTimeout(() => {
      console.log("Notification settings:", data);
      toast.success("Notification settings saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  const handleGlobalSubmit = (data: GlobalSettings) => {
    setIsSaving(true);
    // In a real application, this would save to a database
    setTimeout(() => {
      console.log("Global settings:", data);
      toast.success("Global settings saved successfully");
      setIsSaving(false);
    }, 1000);
  };

  const handleSeoSubmit = (data: SeoSettings) => {
    setIsSaving(true);
    // In a real application, this would save to a database
    setTimeout(() => {
      console.log("SEO settings:", data);
      toast.success("SEO settings saved successfully");
      setIsSaving(false);
    }, 1000);
  };

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
              <FileCode className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="deployment">
              <LucideCloud className="mr-2 h-4 w-4" />
              AWS Deployment
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
          
          <TabsContent value="deployment">
            <Card>
              <CardHeader>
                <CardTitle>AWS Lambda Deployment</CardTitle>
                <CardDescription>
                  Configure settings for deploying to AWS Lambda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...deploymentForm}>
                  <form onSubmit={deploymentForm.handleSubmit(handleDeploymentSubmit)} className="space-y-6">
                    <FormField
                      control={deploymentForm.control}
                      name="awsRegion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AWS Region</FormLabel>
                          <FormControl>
                            <Input placeholder="us-east-1" {...field} />
                          </FormControl>
                          <FormDescription>
                            The AWS region to deploy your application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={deploymentForm.control}
                      name="lambdaMemory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lambda Memory (MB)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={128} max={10240} step={128} />
                          </FormControl>
                          <FormDescription>
                            Memory allocation for the Lambda function (128-10240 MB)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={deploymentForm.control}
                      name="lambdaTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lambda Timeout (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={1} max={900} />
                          </FormControl>
                          <FormDescription>
                            Function timeout in seconds (1-900)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center gap-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save deployment settings"}
                      </Button>
                      <Button type="button" variant="outline">
                        Test Configuration
                      </Button>
                      <Button type="button" variant="destructive">
                        Deploy to AWS
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
