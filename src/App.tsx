
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SeoPages from "./pages/SeoPages";
import SeoPageEditor from "./pages/SeoPageEditor";
import Analytics from "./pages/Analytics";
import InternalLinks from "./pages/InternalLinks";
import SitemapRobots from "./pages/SitemapRobots";
import SchemaMarkup from "./pages/SchemaMarkup";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/seo-pages" element={<SeoPages />} />
          <Route path="/seo-pages/:id" element={<SeoPageEditor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/internal-links" element={<InternalLinks />} />
          <Route path="/sitemap" element={<SitemapRobots />} />
          <Route path="/schema" element={<SchemaMarkup />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
