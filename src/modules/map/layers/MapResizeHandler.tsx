"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { PanelView, usePanel, useSidebar } from "@/context";

const MapResizeHandler = () => {
  const map = useMap();
  const { open } = useSidebar();
  const { view } = usePanel();
  const isOpen = view !== PanelView.CLOSED;

  useEffect(() => {
    const container = map.getContainer();

    if (!container) return;

    const observer = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();

      if (width === 0 || height === 0) return;

      map.invalidateSize({ animate: false });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [map, open, isOpen]);

  return null;
};

export default MapResizeHandler;
