
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  Menu, 
  X,
  LogOut,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app with auth, this would call the auth logout function
    // For now, we'll just navigate to the home page
    navigate("/");
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`);
                }
              }}
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
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative" onClick={handleNotificationClick}>
                <Bell size={20} className="text-muted-foreground" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="success" 
                    className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <h4 className="font-medium">Notifications</h4>
              </div>
              <div className="py-2">
                <div className="px-4 py-2 hover:bg-muted cursor-pointer">
                  <p className="text-sm font-medium">New page created</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="px-4 py-2 hover:bg-muted cursor-pointer">
                  <p className="text-sm font-medium">SEO performance improved</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="px-4 py-2 hover:bg-muted cursor-pointer">
                  <p className="text-sm font-medium">Google position update</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} className="text-muted-foreground" />
          </Button>

          {/* Profile dropdown */}
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
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`);
                  setShowMobileSearch(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
