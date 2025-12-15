"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import { useAreaMarkers } from "@/context";
import { useGlobal } from "@/context/GlobalContext";
import {
  AreaMarkers,
  HeatmapLayer,
  MapResizeHandler,
  StoreMarkers,
} from "./layers";

const Map = () => {
  const { storeMap } = useGlobal();
  const { areaMarkers } = useAreaMarkers(); 
  return (
    <MapContainer
      center={[22.5, 82.5]}
      zoom={5}
      minZoom={4}
      maxZoom={18}
      scrollWheelZoom={true}
      maxBoundsViscosity={1.0}
      className="w-full h-full"
    >
      <MapResizeHandler />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {storeMap.heatmapEnabled && (
        <HeatmapLayer points={storeMap.heatmapPoints} radius={50} />
      )}

      {storeMap.markersEnabled && (
        <StoreMarkers stores={storeMap.filteredStores} />
      )}

      {areaMarkers.length > 0 && storeMap.markersEnabled && <AreaMarkers />}
    </MapContainer>
  );
};

export default Map;
