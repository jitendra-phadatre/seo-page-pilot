
import DashboardLayout from "@/components/layout/DashboardLayout";
import SeoPagesList from "@/components/seo/SeoPagesList";

const SeoPages = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <h1 className="page-title">SEO Pages</h1>
        <p className="page-subtitle mb-6">
          Create and manage SEO-optimized pages for your website
        </p>
        <SeoPagesList />
      </div>
    </DashboardLayout>
  );
};

export default SeoPages;
