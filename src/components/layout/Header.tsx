
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  Menu, 
  X
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          className="sm:hidden mr-2 rounded-md p-2 text-muted-foreground hover:bg-muted"
          aria-label="Open main menu"
        >
          <Menu size={20} />
        </button>
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="hidden sm:flex items-center space-x-2">
            <div className="bg-primary rounded-md p-1">
              <span className="text-primary-foreground font-semibold text-sm">SEO</span>
            </div>
            <span className="font-bold text-lg">PagePilot</span>
          </div>
          <div className="sm:hidden flex items-center">
            <div className="bg-primary rounded-md p-1">
              <span className="text-primary-foreground font-semibold text-sm">SEO</span>
            </div>
          </div>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 items-center ml-4 lg:ml-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages..."
              className="w-full bg-muted pl-9 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Mobile search toggle */}
        <div className="flex-1 flex md:hidden justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Search"
          >
            {showMobileSearch ? <X size={20} /> : <Search size={20} />}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell size={20} className="text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings size={20} className="text-muted-foreground" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <User size={20} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search expanded */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pages..."
              className="w-full bg-muted pl-9 focus-visible:ring-primary"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
