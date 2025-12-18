"use client";

import { useAreaMarkers } from "@/context";
import { memo } from "react";
import { LayerGroup } from "react-leaflet";
import AreaMarker from "./AreaMarker";

const AreaMarkersComponent: React.FC = () => {
  const { areaMarkers } = useAreaMarkers();
console.log('ar',areaMarkers);
  return (
    <LayerGroup>
      {areaMarkers.map((area, i) => (
        <AreaMarker key={area.id ?? i} area={area} />
      ))}
    </LayerGroup>
  );
};

export const AreaMarkers = memo(AreaMarkersComponent);
export default AreaMarkers;
