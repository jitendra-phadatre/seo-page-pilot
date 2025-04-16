
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MultilingualSeoPageData, getPageMultilingualData, updatePageMultilingualData } from "@/lib/api";
import { LocalizedPageContent } from "@/lib/multilingual-types";

export const useMultilingualData = (pageId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [multilingualData, setMultilingualData] = useState<MultilingualSeoPageData | null>(null);
  const [availableLocales, setAvailableLocales] = useState<string[]>([
    "ar-AE", "zh-CN", "zh-TW", "nl-NL", "en-GB", "fi-FI", 
    "fr-CA", "it-IT", "ja-JP", "ko-KR", "pt-BR", "ru-RU", "sv-SE", "th-TH", "tr-TR"
  ]);

  useEffect(() => {
    const loadMultilingualData = async () => {
      try {
        const data = await getPageMultilingualData(pageId);
        setMultilingualData(data);
        
        // Filter out already used locales
        if (data) {
          const usedLocales = data.localizedContent.map(content => content.locale);
          setAvailableLocales(prev => prev.filter(locale => !usedLocales.includes(locale)));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load multilingual data:", error);
        toast.error("Failed to load multilingual data");
        setIsLoading(false);
      }
    };

    loadMultilingualData();
  }, [pageId]);

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

  const saveChanges = async () => {
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

  return {
    isLoading,
    multilingualData,
    setMultilingualData,
    availableLocales,
    setAvailableLocales,
    handleContentChange,
    saveChanges
  };
};
