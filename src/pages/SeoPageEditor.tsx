
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SeoPageForm from "@/components/seo/SeoPageForm";

const queryClient = new QueryClient();

const SeoPageEditor = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <div className="content-area">
          <SeoPageForm />
        </div>
      </DashboardLayout>
    </QueryClientProvider>
  );
};

export default SeoPageEditor;
