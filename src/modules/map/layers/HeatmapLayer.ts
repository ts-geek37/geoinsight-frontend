"use client";

import L from "@/lib/leaflet-heat";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

type HeatPoint = [number, number, number?];

interface Props {
  points: HeatPoint[];
  radius?: number;
  maxZoom?: number;
  blur?: number;
  maxIntensity?: number;
}

const HeatmapLayer: React.FC<Props> = ({
  points,
  radius = 35,
  maxZoom = 14,
  blur = 15,
  maxIntensity,
}) => {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!layerRef.current) {
      // @ts-expect-error leaflet.heat patch
      layerRef.current = L.heatLayer(points, {
        radius,
        maxZoom,
        blur,
        max: maxIntensity ?? undefined,
      }).addTo(map);
    } else {
      layerRef.current.setLatLngs(points);
      if (maxIntensity !== undefined) layerRef.current.setOptions({ max: maxIntensity });
    }
  }, [map, points, radius, maxZoom, blur, maxIntensity]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map]);

  return null;
};

export default HeatmapLayer;
