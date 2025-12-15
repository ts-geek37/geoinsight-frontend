"use client";

import SegmentsLegend from "@/components/SegmentsLegend";
import { PanelView, usePanel } from "@/context";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../map").then((mod) => mod.Map), {
  ssr: false,
});

const DashboardPresentation = () => {
  const { view } = usePanel();

  return (
    <div className="flex-1 relative overflow-y-auto">
      <MapComponent />
      <SegmentsLegend showOpportunity={view === PanelView.SIMILAR} />
    </div>
  );
};

export default DashboardPresentation;
