
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TransportationTemplate } from "@/components/seo/templates/TransportationTemplate";

const TrainBooking = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <TransportationTemplate 
          fromLocation="Makkah" 
          toLocation="Al Sulaymaniyah (Jeddah)" 
          transportType="Train" 
          distance="80 km" 
          duration="25-30 minutes" 
          price="40" 
          currency="SAR"
          image="/placeholder.svg" 
        />
      </div>
    </DashboardLayout>
  );
};

export default TrainBooking;
