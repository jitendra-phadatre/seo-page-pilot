
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSwitcherProps {
  currentPageSlug?: string;
  availableLanguages?: Language[];
  className?: string;
}

// Language context for sharing selected language across components
export const LanguageContext = createContext<{
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    return savedLanguage || 'en';
  });
  
  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('preferred-language', currentLanguage);
  }, [currentLanguage]);
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitcher({
  currentPageSlug,
  availableLanguages = DEFAULT_LANGUAGES,
  className = '',
}: LanguageSwitcherProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Extract language from URL path if present (/es/page-slug)
    const pathMatch = location.pathname.match(/^\/([a-z]{2})(\/.*|$)/);
    if (pathMatch && availableLanguages.some(lang => lang.code === pathMatch[1])) {
      // Update language context if URL contains a language prefix
      setCurrentLanguage(pathMatch[1]);
    } else if (currentLanguage !== 'en') {
      // If URL doesn't have language prefix but we have a non-default language selected,
      // redirect to the version with language prefix
      const newPath = currentLanguage === 'en' 
        ? location.pathname 
        : `/${currentLanguage}${location.pathname === '/' ? '' : location.pathname}`;
      
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, availableLanguages, setCurrentLanguage, navigate, currentLanguage]);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === currentLanguage) return;

    // Get the current path without language prefix
    let currentPath = location.pathname;
    const pathMatch = currentPath.match(/^\/([a-z]{2})(\/.*|$)/);
    
    if (pathMatch) {
      // If current URL has language prefix, remove it
      currentPath = pathMatch[2] || '/';
    }

    // Navigate to the same page with new language prefix
    // Default language (en) doesn't need a prefix
    if (langCode === 'en') {
      navigate(currentPath);
    } else {
      navigate(`/${langCode}${currentPath === '/' ? '' : currentPath}`);
    }
    
    setCurrentLanguage(langCode);
  };

  // Find the current language object
  const currentLangObj = availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center gap-1 ${className}`}>
          <Globe className="h-4 w-4" />
          {currentLangObj.flag && <span className="mr-1">{currentLangObj.flag}</span>}
          <span className="hidden sm:inline">{currentLangObj.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {language.flag && <span>{language.flag}</span>}
              <span>{language.name}</span>
            </span>
            {language.code === currentLanguage && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
