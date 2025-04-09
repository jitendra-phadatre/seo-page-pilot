
import { cn } from "@/lib/utils";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 mt-16 hidden sm:flex sm:flex-col",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          <Sidebar />
        </aside>
        <main 
          className={cn(
            "flex-1 pt-16 transition-all duration-200 ease-in-out",
            sidebarOpen ? "sm:ml-64" : "sm:ml-16"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
