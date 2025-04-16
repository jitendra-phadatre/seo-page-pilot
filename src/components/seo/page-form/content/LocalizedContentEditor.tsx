
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from "lucide-react";
import { MultilingualSeoPageData } from "@/lib/multilingual-types";
import { LocalizedPageContent } from "@/lib/multilingual-types";

interface LocalizedContentEditorProps {
  multilingualData: MultilingualSeoPageData;
  isLoading: boolean;
  onContentChange: (locale: string, field: keyof LocalizedPageContent, value: string) => void;
}

export function LocalizedContentEditor({
  multilingualData,
  isLoading,
  onContentChange
}: LocalizedContentEditorProps) {
  const [activeLocale, setActiveLocale] = useState<string>(multilingualData.defaultLocale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localized Content</CardTitle>
        <CardDescription>
          Manage SEO content for each language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeLocale} 
          onValueChange={setActiveLocale}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap">
            {multilingualData.localizedContent.map(content => (
              <TabsTrigger key={content.locale} value={content.locale}>
                <Globe className="h-4 w-4 mr-2" />
                {content.locale}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {multilingualData.localizedContent.map(content => (
            <TabsContent key={content.locale} value={content.locale} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={content.title}
                    onChange={(e) => onContentChange(content.locale, "title", e.target.value)}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Meta Description</label>
                  <Textarea
                    value={content.metaDescription}
                    onChange={(e) => onContentChange(content.locale, "metaDescription", e.target.value)}
                    className="mt-1.5"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Content Preview</label>
                  <div className="mt-1.5 border rounded-md p-4 text-sm">
                    <p className="text-muted-foreground">
                      {content.content ? (
                        <span>{content.content.substring(0, 200)}...</span>
                      ) : (
                        <span>No content available. Edit content in the Content tab.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
