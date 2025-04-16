
import { MultilingualSeoPageData } from "@/lib/api";

export interface LocalizedPageContent {
  locale: string;
  title: string;
  metaDescription: string;
  content: string;
}

export type { MultilingualSeoPageData };
