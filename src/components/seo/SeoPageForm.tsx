
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Eye, Save, Trash } from "lucide-react";
import { SeoPage, Template } from "@/lib/mock-data";
import { 
  createSeoPage, 
  updateSeoPage, 
  fetchSeoPageById, 
  fetchTemplates,
  deleteSeoPage 
} from "@/lib/api";
import { StructuredDataEditor } from "./StructuredDataEditor";
import { ContentEditor } from "./ContentEditor";
import { toast } from "sonner";

export function SeoPageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [formData, setFormData] = useState<Partial<SeoPage>>({
    title: "",
    slug: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    robotsDirective: "index,follow",
    templateId: null,
    structuredData: null,
    publishStatus: "draft",
  });

  // Simulating data loading effect
  useState(() => {
    if (!isNew) {
      const loadPage = async () => {
        try {
          const pageData = await fetchSeoPageById(id as string);
          if (pageData) {
            setFormData(pageData);
          } else {
            toast.error("Page not found");
            navigate("/seo-pages");
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to load page data:", error);
          toast.error("Failed to load page data");
          setIsLoading(false);
        }
      };
      loadPage();
    }

    // Load templates
    const loadTemplates = async () => {
      try {
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    };
    loadTemplates();
  }, [id, navigate, isNew]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywordsString = e.target.value;
    const keywordsArray = keywordsString.split(',').map(k => k.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, keywords: keywordsArray }));
  };

  const handleStructuredDataChange = (data: object | null) => {
    setFormData((prev) => ({ ...prev, structuredData: data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (isNew) {
        await createSeoPage(formData as Omit<SeoPage, "id" | "createdAt" | "updatedAt">);
        navigate("/seo-pages");
      } else {
        await updateSeoPage(formData as SeoPage);
      }
    } catch (error) {
      console.error("Failed to save SEO page:", error);
      toast.error("Failed to save SEO page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      try {
        await deleteSeoPage(id as string);
        navigate("/seo-pages");
      } catch (error) {
        console.error("Failed to delete page:", error);
        toast.error("Failed to delete page");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 bg-muted animate-pulse-slow rounded"></div>
        <div className="h-40 w-full bg-muted animate-pulse-slow rounded"></div>
        <div className="h-40 w-full bg-muted animate-pulse-slow rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="page-title">{isNew ? "Create New SEO Page" : "Edit SEO Page"}</h1>
          <p className="page-subtitle">
            {isNew 
              ? "Create a new SEO optimized page for your website" 
              : `Editing /${formData.slug}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={handleDelete} 
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <Trash size={16} />
            </Button>
          )}
          <Button type="button" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
              <CardDescription>
                Set the basic SEO information for this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter page title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended length: 50-60 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      /
                    </span>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="page-url-slug"
                      value={formData.slug || ""}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use hyphens to separate words, no spaces
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="Enter meta description"
                  value={formData.metaDescription || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 120-160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formData.keywords?.join(", ") || ""}
                  onChange={handleKeywordsChange}
                />
                <p className="text-xs text-muted-foreground">
                  Add 3-5 relevant keywords, separated by commas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
                <Input
                  id="canonicalUrl"
                  name="canonicalUrl"
                  placeholder="https://example.com/canonical-page"
                  value={formData.canonicalUrl || ""}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use the current URL as canonical
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Template & Status</CardTitle>
              <CardDescription>
                Select a template and set publication status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">Page Template</Label>
                <Select 
                  value={formData.templateId || ""} 
                  onValueChange={(value) => handleSelectChange("templateId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Template (Custom Page)</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Templates provide pre-defined layouts and dynamic fields
                </p>
              </div>

              <div className="space-y-2">
                <Label>Publication Status</Label>
                <RadioGroup 
                  defaultValue={formData.publishStatus || "draft"}
                  onValueChange={(value) => handleSelectChange("publishStatus", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draft" id="draft" />
                    <Label htmlFor="draft" className="font-normal">Draft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="published" id="published" />
                    <Label htmlFor="published" className="font-normal">Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="archived" id="archived" />
                    <Label htmlFor="archived" className="font-normal">Archived</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>
        
        <TabsContent value="structured">
          <Card>
            <CardHeader>
              <CardTitle>Structured Data</CardTitle>
              <CardDescription>
                Add structured data (JSON-LD) for enhanced search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Structured data helps search engines understand your content and can enable rich results.
                </AlertDescription>
              </Alert>
              
              <StructuredDataEditor 
                data={formData.structuredData as object | null} 
                onChange={handleStructuredDataChange}
              />
              
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline">
                Preview Schema
              </Button>
              <Button type="button" variant="outline">
                Test with Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced SEO Settings</CardTitle>
              <CardDescription>
                Configure advanced SEO options for this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robotsDirective">Robots Directive</Label>
                <Select 
                  value={formData.robotsDirective || "index,follow"} 
                  onValueChange={(value) => handleSelectChange("robotsDirective", value)}
                >
                  <SelectTrigger id="robotsDirective">
                    <SelectValue placeholder="Select robots directive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index,follow">index,follow (Default)</SelectItem>
                    <SelectItem value="noindex,follow">noindex,follow</SelectItem>
                    <SelectItem value="index,nofollow">index,nofollow</SelectItem>
                    <SelectItem value="noindex,nofollow">noindex,nofollow</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls how search engines crawl and index this page
                </p>
              </div>
              
              {/* We would add more advanced options here */}
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>More options coming soon</AlertTitle>
                <AlertDescription>
                  Additional advanced options will be available in future updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}

export default SeoPageForm;
