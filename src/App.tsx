
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import SeoPages from "./pages/SeoPages";
import SeoPageEditor from "./pages/SeoPageEditor";
import Analytics from "./pages/Analytics";
import InternalLinks from "./pages/InternalLinks";
import SitemapRobots from "./pages/SitemapRobots";
import SchemaMarkup from "./pages/SchemaMarkup";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TrainBooking from "./pages/TrainBooking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Define supported languages
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'ar'];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes don't need language prefix */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Default language routes (no prefix) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/seo-pages" element={<SeoPages />} />
              <Route path="/seo-pages/:id" element={<SeoPageEditor />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/internal-links" element={<InternalLinks />} />
              <Route path="/sitemap" element={<SitemapRobots />} />
              <Route path="/schema" element={<SchemaMarkup />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/train-booking" element={<TrainBooking />} />
            </Route>
            
            {/* Language prefixed routes */}
            {SUPPORTED_LANGUAGES.map(lang => (
              <Route key={lang} path={`/${lang}`} element={<ProtectedRoute />}>
                <Route path="" element={<Index />} />
                <Route path="seo-pages" element={<SeoPages />} />
                <Route path="seo-pages/:id" element={<SeoPageEditor />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="internal-links" element={<InternalLinks />} />
                <Route path="sitemap" element={<SitemapRobots />} />
                <Route path="schema" element={<SchemaMarkup />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="search" element={<Search />} />
                <Route path="train-booking" element={<TrainBooking />} />
              </Route>
            ))}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
