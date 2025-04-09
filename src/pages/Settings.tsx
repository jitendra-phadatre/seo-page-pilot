
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const generalSchema = z.object({
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  siteUrl: z.string().url("Please enter a valid URL"),
  companyName: z.string().optional(),
  adminEmail: z.string().email("Please enter a valid email address"),
  siteDescription: z.string().optional(),
});

const seoSchema = z.object({
  defaultTitle: z.string().min(2, "Default title must be at least 2 characters"),
  defaultDescription: z.string().optional(),
  googleVerification: z.string().optional(),
  bingVerification: z.string().optional(),
  indexSite: z.boolean().default(true),
});

const integrationsSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  hotjarId: z.string().optional(),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const generalForm = useForm<z.infer<typeof generalSchema>>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      siteName: "My SEO Website",
      siteUrl: "https://example.com",
      companyName: "My Company",
      adminEmail: "admin@example.com",
      siteDescription: "A website optimized for search engines",
    },
  });

  const seoForm = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      defaultTitle: "{page} | {site}",
      defaultDescription: "Default page description for all pages without custom descriptions",
      googleVerification: "",
      bingVerification: "",
      indexSite: true,
    },
  });

  const integrationsForm = useForm<z.infer<typeof integrationsSchema>>({
    resolver: zodResolver(integrationsSchema),
    defaultValues: {
      googleAnalyticsId: "",
      googleTagManagerId: "",
      facebookPixelId: "",
      hotjarId: "",
    },
  });

  const handleGeneralSubmit = (data: z.infer<typeof generalSchema>) => {
    console.log("General settings saved:", data);
    toast.success("General settings saved successfully");
  };

  const handleSeoSubmit = (data: z.infer<typeof seoSchema>) => {
    console.log("SEO settings saved:", data);
    toast.success("SEO settings saved successfully");
  };

  const handleIntegrationsSubmit = (data: z.infer<typeof integrationsSchema>) => {
    console.log("Integrations settings saved:", data);
    toast.success("Integration settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="content-area">
        <div className="mb-6">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure your SEO application settings
          </p>
        </div>

        <Tabs defaultValue="general" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic site settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form 
                    id="general-settings-form" 
                    onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} 
                    className="space-y-4"
                  >
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="siteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The full URL of your website (with https://)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your company or organization name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            Primary contact email for admin notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormDescription>
                            A brief description of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="general-settings-form"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Configure search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...seoForm}>
                  <form 
                    id="seo-settings-form" 
                    onSubmit={seoForm.handleSubmit(handleSeoSubmit)} 
                    className="space-y-4"
                  >
                    <FormField
                      control={seoForm.control}
                      name="defaultTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Title Format</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Use {'{page}'} for page name and {'{site}'} for site name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={seoForm.control}
                      name="defaultDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormDescription>
                            Used when a page doesn't have a custom description
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={seoForm.control}
                      name="googleVerification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Verification</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="meta verification code" />
                          </FormControl>
                          <FormDescription>
                            Google Search Console verification code
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
                          <FormLabel>Bing Verification</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="meta verification code" />
                          </FormControl>
                          <FormDescription>
                            Bing Webmaster Tools verification code
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={seoForm.control}
                      name="indexSite"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Allow Site Indexing
                            </FormLabel>
                            <FormDescription>
                              Allow search engines to index your site
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
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="seo-settings-form">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Configure third-party service integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...integrationsForm}>
                  <form 
                    id="integrations-settings-form" 
                    onSubmit={integrationsForm.handleSubmit(handleIntegrationsSubmit)} 
                    className="space-y-4"
                  >
                    <FormField
                      control={integrationsForm.control}
                      name="googleAnalyticsId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="G-XXXXXXXXXX" />
                          </FormControl>
                          <FormDescription>
                            Google Analytics 4 measurement ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={integrationsForm.control}
                      name="googleTagManagerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Tag Manager ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="GTM-XXXXXXX" />
                          </FormControl>
                          <FormDescription>
                            Google Tag Manager container ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={integrationsForm.control}
                      name="facebookPixelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Pixel ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXXXXXXXX" />
                          </FormControl>
                          <FormDescription>
                            Meta Pixel ID for conversion tracking
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={integrationsForm.control}
                      name="hotjarId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hotjar Site ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXXXXX" />
                          </FormControl>
                          <FormDescription>
                            Hotjar site ID for analytics and feedback
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="integrations-settings-form">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
