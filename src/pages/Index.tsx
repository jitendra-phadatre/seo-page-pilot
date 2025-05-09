
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <DashboardOverview />
      </div>
    </DashboardLayout>
  );
};

export default Index;
