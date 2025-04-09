
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StructuredDataEditorProps {
  data: object | null;
  onChange: (data: object | null) => void;
}

export function StructuredDataEditor({ data, onChange }: StructuredDataEditorProps) {
  const [editorType, setEditorType] = useState<"template" | "code">("template");
  const [selectedSchema, setSelectedSchema] = useState<string>("Article");
  const [jsonValue, setJsonValue] = useState<string>(
    data ? JSON.stringify(data, null, 2) : ""
  );

  const handleEditorTypeChange = (type: "template" | "code") => {
    setEditorType(type);
  };

  const handleSchemaChange = (value: string) => {
    setSelectedSchema(value);
    
    // Set default schema templates based on selection
    let templateData: object;
    
    switch (value) {
      case "Article":
        templateData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Article headline",
          "image": [
            "https://example.com/photos/1x1/photo.jpg",
            "https://example.com/photos/4x3/photo.jpg",
            "https://example.com/photos/16x9/photo.jpg"
          ],
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": "Author Name"
          }
        };
        break;
      
      case "FAQPage":
        templateData = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Question 1",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Answer to question 1"
              }
            },
            {
              "@type": "Question",
              "name": "Question 2",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Answer to question 2"
              }
            }
          ]
        };
        break;
      
      case "Product":
        templateData = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Product Name",
          "image": "https://example.com/product.jpg",
          "description": "Product description",
          "offers": {
            "@type": "Offer",
            "price": "99.99",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "89"
          }
        };
        break;
      
      case "LocalBusiness":
        templateData = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Business Name",
          "image": "https://example.com/business.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Main St",
            "addressLocality": "City",
            "addressRegion": "State",
            "postalCode": "12345",
            "addressCountry": "US"
          },
          "telephone": "+1-234-567-8900",
          "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00"
        };
        break;
      
      default:
        templateData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Title",
          "description": "Page description"
        };
    }
    
    setJsonValue(JSON.stringify(templateData, null, 2));
    onChange(templateData);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonValue(value);
    
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        onChange(parsed);
      } else {
        onChange(null);
      }
    } catch (error) {
      // Don't update if JSON is invalid
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={editorType === "template" ? "default" : "outline"}
          onClick={() => handleEditorTypeChange("template")}
        >
          Template
        </Button>
        <Button
          type="button"
          variant={editorType === "code" ? "default" : "outline"}
          onClick={() => handleEditorTypeChange("code")}
        >
          JSON Code
        </Button>
      </div>
      
      {editorType === "template" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schema-type">Schema Type</Label>
            <Select value={selectedSchema} onValueChange={handleSchemaChange}>
              <SelectTrigger id="schema-type">
                <SelectValue placeholder="Select schema type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="FAQPage">FAQ Page</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="LocalBusiness">Local Business</SelectItem>
                <SelectItem value="WebPage">Web Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Future enhancement: Add form fields for each schema type */}
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Form-based editing for schema properties coming soon. For now, 
              you can edit the JSON directly in the code view.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="json-editor">JSON-LD</Label>
        <textarea
          id="json-editor"
          className="w-full h-[400px] font-mono text-sm p-3 rounded-md border border-input bg-background"
          value={jsonValue}
          onChange={handleJsonChange}
          placeholder="Paste or edit your JSON-LD structured data here"
        />
      </div>
    </div>
  );
}

export default StructuredDataEditor;
