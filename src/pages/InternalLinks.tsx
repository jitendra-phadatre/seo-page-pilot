
import DashboardLayout from "@/components/layout/DashboardLayout";
import InternalLinkManager from "@/components/internal-links/InternalLinkManager";

const InternalLinks = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <h1 className="page-title">Internal Links</h1>
        <p className="page-subtitle mb-6">
          Manage your site's internal linking structure for better SEO
        </p>
        <InternalLinkManager />
      </div>
    </DashboardLayout>
  );
};

export default InternalLinks;
