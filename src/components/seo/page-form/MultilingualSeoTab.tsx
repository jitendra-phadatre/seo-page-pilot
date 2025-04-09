
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Globe, PlusCircle, Trash2 } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { SeoPage } from "@/lib/mock-data";
import { LocalizedPageContent, MultilingualSeoPageData, getPageMultilingualData, updatePageMultilingualData } from "@/lib/api";

interface MultilingualSeoTabProps {
  pageId: string;
  pageSlug: string;
  siteUrl?: string;
}

export const MultilingualSeoTab = ({ pageId, pageSlug, siteUrl = "https://example.com" }: MultilingualSeoTabProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState<string>("en-US");
  const [multilingualData, setMultilingualData] = useState<MultilingualSeoPageData | null>(null);
  const [newLocale, setNewLocale] = useState<string>("");
  const [availableLocales, setAvailableLocales] = useState<string[]>([
    "ar-AE", "zh-CN", "zh-TW", "nl-NL", "en-GB", "fi-FI", 
    "fr-CA", "it-IT", "ja-JP", "ko-KR", "pt-BR", "ru-RU", "sv-SE", "th-TH", "tr-TR"
  ]);

  useEffect(() => {
    const loadMultilingualData = async () => {
      try {
        const data = await getPageMultilingualData(pageId);
        setMultilingualData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load multilingual data:", error);
        toast.error("Failed to load multilingual data");
        setIsLoading(false);
      }
    };

    loadMultilingualData();
  }, [pageId]);

  useEffect(() => {
    if (multilingualData) {
      // Filter out already used locales
      const usedLocales = multilingualData.localizedContent.map(content => content.locale);
      setAvailableLocales(prev => prev.filter(locale => !usedLocales.includes(locale)));
    }
  }, [multilingualData]);

  const handleContentChange = (locale: string, field: keyof LocalizedPageContent, value: string) => {
    if (!multilingualData) return;

    const updatedContent = multilingualData.localizedContent.map(content => {
      if (content.locale === locale) {
        return { ...content, [field]: value };
      }
      return content;
    });

    setMultilingualData({
      ...multilingualData,
      localizedContent: updatedContent
    });
  };

  const handleSaveChanges = async () => {
    if (!multilingualData) return;

    setIsLoading(true);
    try {
      await updatePageMultilingualData(multilingualData);
      toast.success("Multilingual SEO settings saved");
    } catch (error) {
      console.error("Failed to save multilingual data:", error);
      toast.error("Failed to save multilingual data");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewLocale = () => {
    if (!newLocale || !multilingualData) return;

    // Check if locale already exists
    if (multilingualData.localizedContent.some(content => content.locale === newLocale)) {
      toast.error("This locale already exists");
      return;
    }

    // Find default content to clone
    const defaultContent = multilingualData.localizedContent.find(
      content => content.locale === multilingualData.defaultLocale
    );

    if (!defaultContent) return;

    // Add new locale
    const newLocalizedContent = {
      locale: newLocale,
      title: `${defaultContent.title} (${newLocale})`,
      metaDescription: defaultContent.metaDescription,
      content: defaultContent.content,
    };

    // Update hreflangs
    const newHreflang = {
      locale: newLocale,
      url: `${siteUrl}/${newLocale.split('-')[0]}/${pageSlug}`
    };

    setMultilingualData({
      ...multilingualData,
      alternateLocales: [...multilingualData.alternateLocales, newLocale],
      hreflangs: [...multilingualData.hreflangs, newHreflang],
      localizedContent: [...multilingualData.localizedContent, newLocalizedContent]
    });

    // Remove from available locales
    setAvailableLocales(prev => prev.filter(locale => locale !== newLocale));
    setNewLocale("");
    toast.success(`Added ${newLocale} locale`);
  };

  const removeLocale = (locale: string) => {
    if (!multilingualData || locale === multilingualData.defaultLocale) return;

    // Update multilingual data
    setMultilingualData({
      ...multilingualData,
      alternateLocales: multilingualData.alternateLocales.filter(l => l !== locale),
      hreflangs: multilingualData.hreflangs.filter(h => h.locale !== locale),
      localizedContent: multilingualData.localizedContent.filter(c => c.locale !== locale)
    });

    // Add back to available locales
    setAvailableLocales(prev => [...prev, locale].sort());
    
    // Reset active locale if the removed one was active
    if (activeLocale === locale) {
      setActiveLocale(multilingualData.defaultLocale);
    }

    toast.success(`Removed ${locale} locale`);
  };

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
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Hreflang Tags</CardTitle>
            <CardDescription>
              Configure alternate language versions of this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default Language</label>
                <div className="flex items-center mt-1.5 gap-2">
                  <Badge variant="outline" className="text-xs">
                    {multilingualData.defaultLocale}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Primary language</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Language Versions</label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Locale</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {multilingualData.hreflangs.map((hreflang) => (
                      <TableRow key={hreflang.locale}>
                        <TableCell>
                          <Badge 
                            variant={hreflang.locale === multilingualData.defaultLocale ? "default" : "outline"}
                            className="text-xs"
                          >
                            {hreflang.locale}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {hreflang.url}
                        </TableCell>
                        <TableCell>
                          {hreflang.locale !== multilingualData.defaultLocale && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLocale(hreflang.locale)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex mt-4 gap-2">
                  <Select value={newLocale} onValueChange={setNewLocale}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add language..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addNewLocale} disabled={!newLocale}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
                      onChange={(e) => handleContentChange(content.locale, "title", e.target.value)}
                      className="mt-1.5"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Meta Description</label>
                    <Textarea
                      value={content.metaDescription}
                      onChange={(e) => handleContentChange(content.locale, "metaDescription", e.target.value)}
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
      
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default MultilingualSeoTab;
