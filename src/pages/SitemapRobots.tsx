
import DashboardLayout from "@/components/layout/DashboardLayout";
import SitemapManager from "@/components/sitemap/SitemapManager";
import RobotsEditor from "@/components/sitemap/RobotsEditor";

const SitemapRobots = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <h1 className="page-title">Sitemap & Robots</h1>
        <p className="page-subtitle mb-6">
          Configure your sitemap generation and robots.txt file
        </p>
        <div className="grid grid-cols-1 gap-8">
          <SitemapManager />
          <RobotsEditor />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SitemapRobots;
