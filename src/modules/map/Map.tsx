"use client";

import "leaflet/dist/leaflet.css";
import { memo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { useGlobal } from "@/context/GlobalContext";
import { MAP_STYLE_URLS } from "@/utils/mapStyle";
import { AreaMarkers, HeatmapLayer, MapResizeHandler, StoreMarkers } from "./layers";

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

const Map = () => {
  const { storeMap, ui } = useGlobal();
  const style = MAP_STYLE_URLS[ui.mapStyle];
  const [tilesReady, setTilesReady] = useState(false);

  const stores = storeMap.filteredStores;
  const hasData = storeMap.raw !== null;

  const showLoading = (!tilesReady || storeMap.isLoading) && !hasData;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <MapResizeHandler />

        <TileLayer
          key={ui.mapStyle}
          url={style.url}
          attribution={style.attribution}
          noWrap
          eventHandlers={{ load: () => setTilesReady(true) }}
        />

        {ui.heatmapEnabled && (
          <HeatmapLayer
            points={stores.map((s) => [
              s.latitude,
              s.longitude,
              s.heatmapWeight,
            ])}
          />
        )}

        {ui.markersEnabled && <StoreMarkers stores={stores} />}
        {ui.markersEnabled && <AreaMarkers />}
      </MapContainer>

      {showLoading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      )}
    </div>
  );
};

export default memo(Map);
