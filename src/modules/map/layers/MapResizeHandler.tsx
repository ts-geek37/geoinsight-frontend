// SmoothMapResize.tsx
"use client";
import { PanelView, usePanel, useSidebar } from "@/context";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapResizeHandler = () => {
  const map = useMap();
  const { open } = useSidebar();
  const { view } = usePanel();
  const isOpen = view !== PanelView.CLOSED;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 300;

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
  }, [open, map, isOpen]);

  return null;
};

export default MapResizeHandler;
