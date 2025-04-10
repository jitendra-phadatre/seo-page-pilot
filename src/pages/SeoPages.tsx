
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SeoPagesList from "@/components/seo/SeoPagesList";

const queryClient = new QueryClient();

const SeoPages = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <div className="content-area">
          <h1 className="page-title">SEO Pages</h1>
          <p className="page-subtitle mb-6">
            Create and manage SEO-optimized pages for your website
          </p>
          <SeoPagesList />
        </div>
      </DashboardLayout>
    </QueryClientProvider>
  );
};

export default SeoPages;
