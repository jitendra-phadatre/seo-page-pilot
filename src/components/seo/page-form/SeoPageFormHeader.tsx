
import { Button } from "@/components/ui/button";
import { Eye, Globe, Save, Trash } from "lucide-react";

interface SeoPageFormHeaderProps {
  isNew: boolean;
  isSaving: boolean;
  slug: string;
  handleDelete: () => void;
  handlePreview: () => void;
  showLanguageOptions?: boolean;
  onToggleLanguageOptions?: () => void;
}

export function SeoPageFormHeader({ 
  isNew, 
  isSaving, 
  slug, 
  handleDelete,
  handlePreview,
  showLanguageOptions = false,
  onToggleLanguageOptions
}: SeoPageFormHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="page-title">{isNew ? "Create New SEO Page" : "Edit SEO Page"}</h1>
        <p className="page-subtitle">
          {isNew 
            ? "Create a new SEO optimized page for your website" 
            : `Editing /${slug}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {!isNew && onToggleLanguageOptions && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onToggleLanguageOptions}
            className={showLanguageOptions ? "bg-muted" : ""}
          >
            <Globe className="mr-2 h-4 w-4" />
            Translations
          </Button>
        )}
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
        <Button 
          type="button" 
          variant="outline"
          onClick={handlePreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button type="submit" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Page"}
        </Button>
      </div>
    </div>
  );
}
