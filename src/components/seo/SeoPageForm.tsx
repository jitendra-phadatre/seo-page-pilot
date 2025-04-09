
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  createSeoPage, 
  updateSeoPage, 
  fetchSeoPageById, 
  fetchTemplates,
  deleteSeoPage 
} from "@/lib/api";
import { SeoPage, Template } from "@/lib/mock-data";
import { toast } from "sonner";

// Import refactored components
import { BasicSeoForm } from "./page-form/BasicSeoForm";
import { TemplateStatusForm } from "./page-form/TemplateStatusForm";
import { ContentEditor } from "./ContentEditor";
import { StructuredDataTab } from "./page-form/StructuredDataTab";
import { AdvancedSeoForm } from "./page-form/AdvancedSeoForm";
import { SeoPageFormHeader } from "./page-form/SeoPageFormHeader";
import { MultilingualSeoTab } from "./page-form/MultilingualSeoTab";
import { useFormData } from "./page-form/useFormData";

export function SeoPageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  
  const { 
    formData, 
    setFormData, 
    handleInputChange, 
    handleSelectChange, 
    handleKeywordsChange, 
    handleStructuredDataChange 
  } = useFormData();

  useEffect(() => {
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

    const loadTemplates = async () => {
      try {
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    };
    loadTemplates();
  }, [id, navigate, isNew, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Create a copy of the form data to process
      const processedData = { ...formData };
      
      // Handle the "none" template value
      if (processedData.templateId === "none") {
        processedData.templateId = null;
      }
      
      if (isNew) {
        await createSeoPage(processedData as Omit<SeoPage, "id" | "createdAt" | "updatedAt">);
        navigate("/seo-pages");
      } else {
        await updateSeoPage(processedData as SeoPage);
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
      <SeoPageFormHeader 
        isNew={isNew}
        isSaving={isSaving}
        slug={formData.slug || ""}
        handleDelete={handleDelete}
      />

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="multilingual">Multilingual</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicSeoForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleKeywordsChange={handleKeywordsChange}
          />
          
          <TemplateStatusForm 
            formData={formData}
            templates={templates}
            handleSelectChange={handleSelectChange}
          />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>
        
        <TabsContent value="multilingual">
          {!isNew ? (
            <MultilingualSeoTab 
              pageId={id || ""}
              pageSlug={formData.slug || ""}
              siteUrl="https://example.com"
            />
          ) : (
            <div className="text-center py-12">
              <p>Please save the page first to enable multilingual settings.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="structured">
          <StructuredDataTab 
            structuredData={formData.structuredData as object | null}
            handleStructuredDataChange={handleStructuredDataChange}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSeoForm 
            formData={formData}
            handleSelectChange={handleSelectChange}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
}

export default SeoPageForm;
