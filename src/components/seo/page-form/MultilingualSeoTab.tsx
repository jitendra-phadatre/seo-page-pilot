
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMultilingualData } from "@/hooks/useMultilingualData";
import { HreflangSettings } from "./hreflang/HreflangSettings";
import { LocalizedContentEditor } from "./content/LocalizedContentEditor";

interface MultilingualSeoTabProps {
  pageId: string;
  pageSlug: string;
  siteUrl?: string;
}

export const MultilingualSeoTab = ({ 
  pageId, 
  pageSlug, 
  siteUrl = "https://example.com" 
}: MultilingualSeoTabProps) => {
  const {
    isLoading,
    multilingualData,
    setMultilingualData,
    availableLocales,
    setAvailableLocales,
    handleContentChange,
    saveChanges
  } = useMultilingualData(pageId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
        <div className="h-40 w-full bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (!multilingualData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load multilingual SEO data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <HreflangSettings
          multilingualData={multilingualData}
          availableLocales={availableLocales}
          siteUrl={siteUrl}
          pageSlug={pageSlug}
          onUpdateData={setMultilingualData}
          onUpdateAvailableLocales={setAvailableLocales}
        />
      </div>
      
      <LocalizedContentEditor
        multilingualData={multilingualData}
        isLoading={isLoading}
        onContentChange={handleContentChange}
      />
      
      <div className="flex justify-end">
        <Button onClick={saveChanges} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default MultilingualSeoTab;
