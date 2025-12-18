"use client";

import "leaflet/dist/leaflet.css";
import { memo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { PanelView, useAreaMarkers, usePanel } from "@/context";
import { useGlobal } from "@/context/GlobalContext";
import { MAP_STYLE_URLS } from "@/utils/mapStyle";
import { AreaMarkers, HeatmapLayer, MapResizeHandler, StoreMarkers } from "./layers";

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

const MapLoadingOverlay = memo(() => (
  <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-background/60 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <span className="text-sm text-muted-foreground">Loading map data…</span>
    </div>
  </div>
));
MapLoadingOverlay.displayName = "MapLoadingOverlay";

const Map = () => {
  const { storeMap, storesData } = useGlobal();
  const { areaMarkers } = useAreaMarkers();
  const { view } = usePanel();
  const style = MAP_STYLE_URLS[storeMap.mapStyle];

  const [tilesReady, setTilesReady] = useState(false);

  const shouldShowLoading =
    (!tilesReady || storesData.isLoading) && storesData?.stores?.length === 0;
  const shouldShowStoreMarkers = storeMap.markersEnabled && storesData.stores?.length > 0;
  const shouldShowAreaMarkers =
    areaMarkers.length > 0 && storeMap.markersEnabled && view === PanelView.SIMILAR;

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
          key={storeMap.mapStyle}
          url={style.url}
          attribution={style.attribution}
          noWrap
          eventHandlers={{
            load: () => setTilesReady(true),
          }}
        />

        {storeMap.heatmapEnabled && <HeatmapLayer points={storeMap.heatmapPoints} />}
        {shouldShowStoreMarkers && <StoreMarkers stores={storeMap.filteredStores} />}
        {shouldShowAreaMarkers && <AreaMarkers />}
      </MapContainer>

      {shouldShowLoading && <MapLoadingOverlay />}
    </div>
  );
};

export default memo(Map);
