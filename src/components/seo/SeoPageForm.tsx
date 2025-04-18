
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { 
  createSeoPage, 
  updateSeoPage, 
  fetchSeoPageById, 
  fetchTemplates,
  deleteSeoPage 
} from "@/lib/api";
import { SeoPage } from "@/lib/mock-data";
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

// Preview dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function SeoPageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const { 
    formData, 
    setFormData, 
    handleInputChange, 
    handleSelectChange, 
    handleKeywordsChange, 
    handleStructuredDataChange 
  } = useFormData();

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  // Fetch page data if editing an existing page
  const { data: pageData, isLoading } = useQuery({
    queryKey: ["seoPage", id],
    queryFn: () => fetchSeoPageById(id as string),
    enabled: !isNew && !!id,
    meta: {
      onSettled: (data: SeoPage | undefined, error: Error | null) => {
        if (data) {
          setFormData(data);
        } else if (error) {
          console.error("Failed to load page data:", error);
          toast.error("Failed to load page data");
          navigate("/seo-pages");
        }
      }
    }
  });

  // Set form data when page data is loaded
  useEffect(() => {
    if (pageData) {
      setFormData(pageData);
    }
  }, [pageData, setFormData]);

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: createSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoPages"] });
      navigate("/seo-pages");
    },
    onError: (error) => {
      console.error("Failed to create page:", error);
      toast.error("Failed to create page");
    }
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: updateSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoPages"] });
      queryClient.invalidateQueries({ queryKey: ["seoPage", id] });
      toast.success("Page updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update page:", error);
      toast.error("Failed to update page");
    }
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: deleteSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoPages"] });
      navigate("/seo-pages");
    },
    onError: (error) => {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    }
  });

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
        await createPageMutation.mutateAsync(processedData as Omit<SeoPage, "id" | "createdAt" | "updatedAt">);
      } else {
        await updatePageMutation.mutateAsync(processedData as SeoPage);
      }
    } catch (error) {
      // Errors are handled in mutation callbacks
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      try {
        await deletePageMutation.mutateAsync(id as string);
      } catch (error) {
        // Error is handled in mutation callback
      }
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
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
    <>
      <form onSubmit={handleSubmit}>
        <SeoPageFormHeader 
          isNew={isNew}
          isSaving={isSaving || createPageMutation.isPending || updatePageMutation.isPending}
          slug={formData.slug || ""}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Preview: {formData.title}</DialogTitle>
            <DialogDescription>
              Preview how your SEO page will appear
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Title Tag</h3>
              <p className="text-lg font-medium text-blue-600">{formData.title}</p>
              
              <h3 className="font-semibold text-sm text-muted-foreground mt-4 mb-1">URL</h3>
              <p className="text-green-600 text-sm">{`https://example.com/${formData.slug || ""}`}</p>
              
              <h3 className="font-semibold text-sm text-muted-foreground mt-4 mb-1">Meta Description</h3>
              <p className="text-sm">{formData.metaDescription || "No meta description provided."}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Page Content Preview</h3>
              <div className="border rounded-md p-4 bg-white">
                <div dangerouslySetInnerHTML={{ __html: formData.content || "<p>No content provided.</p>" }} />
              </div>
            </div>
            
            {formData.structuredData && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Structured Data</h3>
                <pre className="p-4 bg-gray-100 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(formData.structuredData, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">Additional SEO Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Keywords</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.keywords && formData.keywords.length > 0 
                      ? formData.keywords.join(", ") 
                      : "No keywords provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Robots Directive</p>
                  <p className="text-sm text-muted-foreground">{formData.robotsDirective || "index,follow"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Canonical URL</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.canonicalUrl || `https://example.com/${formData.slug || ""}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">{formData.publishStatus || "draft"}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SeoPageForm;
