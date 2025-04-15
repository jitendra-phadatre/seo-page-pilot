import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { SearchButton } from "@/components/search/SearchButton";
import { NotificationMenu } from "@/components/layout/NotificationMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import LanguageSwitcher from "@/components/seo/LanguageSwitcher";

const Header = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold hidden md:block">SEO Management</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Add Language Switcher */}
          <LanguageSwitcher />
          <SearchButton />
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
