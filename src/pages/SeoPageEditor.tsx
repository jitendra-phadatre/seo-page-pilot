
import DashboardLayout from "@/components/layout/DashboardLayout";
import SeoPageForm from "@/components/seo/SeoPageForm";

const SeoPageEditor = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <SeoPageForm />
      </div>
    </DashboardLayout>
  );
};

export default SeoPageEditor;
