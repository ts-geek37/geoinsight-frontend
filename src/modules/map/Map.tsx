"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import { useAreaMarkers } from "@/context";
import { useGlobal } from "@/context/GlobalContext";
import { MAP_STYLE_URLS } from "@/utils/mapStyle";
import { AreaMarkers, HeatmapLayer, MapResizeHandler, StoreMarkers } from "./layers";

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [35.5, 97.5],
];

const Map = () => {
  const { storeMap } = useGlobal();
  const { areaMarkers } = useAreaMarkers();

  const style = MAP_STYLE_URLS[storeMap.mapStyle];

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={5}
      minZoom={4}
      maxZoom={18}
      maxBounds={INDIA_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      className="w-full h-full"
    >
      <MapResizeHandler />

      <TileLayer key={storeMap.mapStyle} url={style.url} attribution={style.attribution} noWrap />

      {storeMap.heatmapEnabled && <HeatmapLayer points={storeMap.heatmapPoints} />}

      {storeMap.markersEnabled && <StoreMarkers stores={storeMap.filteredStores} />}

      {areaMarkers.length > 0 && storeMap.markersEnabled && <AreaMarkers />}
    </MapContainer>
  );
};

export default Map;
