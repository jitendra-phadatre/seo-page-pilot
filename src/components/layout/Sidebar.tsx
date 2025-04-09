
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart4,
  FileText,
  Globe,
  Home,
  Link as LinkIcon,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { pathname } = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/",
    },
    {
      title: "SEO Pages",
      icon: <FileText size={20} />,
      href: "/seo-pages",
    },
    {
      title: "Analytics",
      icon: <BarChart4 size={20} />,
      href: "/analytics",
    },
    {
      title: "Internal Links",
      icon: <LinkIcon size={20} />,
      href: "/internal-links",
    },
    {
      title: "Sitemap & Robots",
      icon: <Globe size={20} />,
      href: "/sitemap",
    },
    {
      title: "Schema Markup",
      icon: <ShieldAlert size={20} />,
      href: "/schema",
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      href: "/users",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/settings",
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen bg-sidebar", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Navigation
          </h2>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
