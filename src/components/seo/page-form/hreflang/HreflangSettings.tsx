
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MultilingualSeoPageData } from "@/lib/multilingual-types";

interface HreflangSettingsProps {
  multilingualData: MultilingualSeoPageData;
  availableLocales: string[];
  siteUrl: string;
  pageSlug: string;
  onUpdateData: (data: MultilingualSeoPageData) => void;
  onUpdateAvailableLocales: (locales: string[]) => void;
}

export function HreflangSettings({
  multilingualData,
  availableLocales,
  siteUrl,
  pageSlug,
  onUpdateData,
  onUpdateAvailableLocales
}: HreflangSettingsProps) {
  const [newLocale, setNewLocale] = useState<string>("");

  const addNewLocale = () => {
    if (!newLocale) return;

    if (multilingualData.localizedContent.some(content => content.locale === newLocale)) {
      toast.error("This locale already exists");
      return;
    }

    const defaultContent = multilingualData.localizedContent.find(
      content => content.locale === multilingualData.defaultLocale
    );

    if (!defaultContent) return;

    const newLocalizedContent = {
      locale: newLocale,
      title: `${defaultContent.title} (${newLocale})`,
      metaDescription: defaultContent.metaDescription,
      content: defaultContent.content,
    };

    const newHreflang = {
      locale: newLocale,
      url: `${siteUrl}/${newLocale.split('-')[0]}/${pageSlug}`
    };

    const updatedData = {
      ...multilingualData,
      alternateLocales: [...multilingualData.alternateLocales, newLocale],
      hreflangs: [...multilingualData.hreflangs, newHreflang],
      localizedContent: [...multilingualData.localizedContent, newLocalizedContent]
    };

    onUpdateData(updatedData);
    onUpdateAvailableLocales(availableLocales.filter(locale => locale !== newLocale));
    setNewLocale("");
    toast.success(`Added ${newLocale} locale`);
  };

  const removeLocale = (locale: string) => {
    if (locale === multilingualData.defaultLocale) return;

    const updatedData = {
      ...multilingualData,
      alternateLocales: multilingualData.alternateLocales.filter(l => l !== locale),
      hreflangs: multilingualData.hreflangs.filter(h => h.locale !== locale),
      localizedContent: multilingualData.localizedContent.filter(c => c.locale !== locale)
    };

    onUpdateData(updatedData);
    onUpdateAvailableLocales([...availableLocales, locale].sort());
    toast.success(`Removed ${locale} locale`);
  };

  return (
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
  );
}
