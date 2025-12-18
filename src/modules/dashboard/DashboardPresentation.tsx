"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../map").then((mod) => mod.Map), {
  ssr: false,
});

const DashboardPresentation = () => <MapComponent />;

export default DashboardPresentation;
