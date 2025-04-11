
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SeoPage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SeoPagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  page: Partial<SeoPage>;
}

export function SeoPagePreview({ isOpen, onClose, page }: SeoPagePreviewProps) {
  const [copied, setCopied] = useState(false);
  
  // Reset copied state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);
  
  const handleCopyHTML = () => {
    const htmlContent = document.getElementById('preview-html')?.innerText;
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent)
        .then(() => {
          setCopied(true);
          toast.success("HTML copied to clipboard");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast.error("Failed to copy HTML");
        });
    }
  };
  
  // Generate meta tags and structured data for preview
  const generateMetaTags = () => {
    let tags = `<title>${page.title || 'Page Title'}</title>\n`;
    tags += `<meta name="description" content="${page.metaDescription || ''}" />\n`;
    
    if (page.keywords && page.keywords.length > 0) {
      tags += `<meta name="keywords" content="${page.keywords.join(', ')}" />\n`;
    }
    
    if (page.canonicalUrl) {
      tags += `<link rel="canonical" href="${page.canonicalUrl}" />\n`;
    }
    
    tags += `<meta name="robots" content="${page.robotsDirective || 'index,follow'}" />\n`;
    
    // Add structured data if available
    if (page.structuredData) {
      tags += `<script type="application/ld+json">\n${JSON.stringify(page.structuredData, null, 2)}\n</script>`;
    }
    
    return tags;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Page Preview</DialogTitle>
          <DialogDescription>
            Preview how your page will appear to search engines
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Google SERP Preview */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Search Result Preview</h3>
            <div className="border rounded-md p-4 bg-white">
              <div className="text-blue-600 text-lg font-medium hover:underline line-clamp-1">
                {page.title || 'Page Title'}
              </div>
              <div className="text-green-700 text-sm">
                {page.canonicalUrl || `https://example.com/${page.slug || ''}`}
              </div>
              <div className="text-sm text-gray-700 line-clamp-2">
                {page.metaDescription || 'No meta description provided.'}
              </div>
            </div>
          </div>
          
          {/* HTML Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">HTML Meta Tags</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyHTML}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy HTML"}
              </Button>
            </div>
            <pre
              id="preview-html"
              className="border rounded-md p-4 bg-slate-50 text-sm overflow-x-auto"
            >
              {generateMetaTags()}
            </pre>
          </div>
          
          {/* Content Preview */}
          {page.content && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Content Preview</h3>
              <div 
                className="border rounded-md p-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SeoPagePreview;
