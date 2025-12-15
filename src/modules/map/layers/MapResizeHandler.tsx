// SmoothMapResize.tsx
"use client";
import { PanelView, usePanel, useSidebar } from "@/context";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapResizeHandler = () => {
  const map = useMap();
  const { open } = useSidebar();
  const { view } = usePanel();
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      map.invalidateSize();

      if (progress < duration) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [open, map, view === PanelView.CLOSED]);

  return null;
};

export default MapResizeHandler;
