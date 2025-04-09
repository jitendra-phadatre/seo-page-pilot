
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeoPage } from "@/lib/mock-data";

interface BasicSeoFormProps {
  formData: Partial<SeoPage>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleKeywordsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicSeoForm({ 
  formData, 
  handleInputChange, 
  handleKeywordsChange 
}: BasicSeoFormProps) {
  return (
    <>
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
    </>
  );
}
