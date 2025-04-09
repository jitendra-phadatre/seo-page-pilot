
import { useState } from "react";
import { SeoPage } from "@/lib/mock-data";

export function useFormData(initialData?: Partial<SeoPage>) {
  const [formData, setFormData] = useState<Partial<SeoPage>>(initialData || {
    title: "",
    slug: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    robotsDirective: "index,follow",
    templateId: null,
    structuredData: null,
    publishStatus: "draft",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywordsString = e.target.value;
    const keywordsArray = keywordsString.split(',').map(k => k.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, keywords: keywordsArray }));
  };

  const handleStructuredDataChange = (data: object | null) => {
    setFormData((prev) => ({ ...prev, structuredData: data }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleKeywordsChange,
    handleStructuredDataChange
  };
}
