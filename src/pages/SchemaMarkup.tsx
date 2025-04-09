
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StructuredDataEditor } from "@/components/seo/StructuredDataEditor";
import { Button } from "@/components/ui/button";
import { Check, Code, FileJson } from "lucide-react";
import { toast } from "sonner";

const SchemaMarkup = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [globalSchema, setGlobalSchema] = useState<object | null>({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company Name",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png"
  });

  const [pageSchemas, setPageSchemas] = useState<{[key: string]: object | null}>({
    home: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Your Website Name",
      "url": "https://example.com"
    },
    about: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Us",
      "url": "https://example.com/about"
    },
    contact: null
  });

  const handleGlobalSchemaChange = (data: object | null) => {
    setGlobalSchema(data);
  };

  const handlePageSchemaChange = (page: string, data: object | null) => {
    setPageSchemas(prev => ({
      ...prev,
      [page]: data
    }));
  };

  const handleSave = () => {
    toast.success("Schema markup saved successfully");
  };

  const handleTest = () => {
    toast.info("Opening schema validator in new tab");
    window.open("https://validator.schema.org/", "_blank");
  };

  return (
    <DashboardLayout>
      <div className="content-area">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="page-title">Schema Markup</h1>
            <p className="page-subtitle">
              Manage structured data for better search engine understanding
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest}>
              <Code className="h-4 w-4 mr-2" />
              Test Schema
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="global" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="global">Global Schema</TabsTrigger>
            <TabsTrigger value="pages">Page-Specific Schemas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Schema Markup</CardTitle>
                <CardDescription>
                  Applied to all pages on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StructuredDataEditor 
                  data={globalSchema} 
                  onChange={handleGlobalSchemaChange} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Page-Specific Schema Markup</CardTitle>
                <CardDescription>
                  Override or add schema for specific pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="home">
                  <TabsList>
                    <TabsTrigger value="home">Homepage</TabsTrigger>
                    <TabsTrigger value="about">About Page</TabsTrigger>
                    <TabsTrigger value="contact">Contact Page</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="home" className="py-4">
                    <StructuredDataEditor 
                      data={pageSchemas.home} 
                      onChange={(data) => handlePageSchemaChange("home", data)} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="about" className="py-4">
                    <StructuredDataEditor 
                      data={pageSchemas.about} 
                      onChange={(data) => handlePageSchemaChange("about", data)} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="contact" className="py-4">
                    <StructuredDataEditor 
                      data={pageSchemas.contact} 
                      onChange={(data) => handlePageSchemaChange("contact", data)} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SchemaMarkup;
