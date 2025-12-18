"use client";

import { AreaMarkerDTO } from "@/types";
import L from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";

interface Props {
  area: AreaMarkerDTO;
}

const AreaMarker: React.FC<Props> = ({ area }) => {
  const color = "var(--segment-opportunity)";

  const icon = useMemo(() => {
    const size = 12;
    return L.divIcon({
      className: "",
      iconSize: [size, size],
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          opacity:0.9;
        "></div>
      `,
    });
  }, [color]);

  return (
    <Marker position={[area.latitude, area.longitude]} icon={icon}>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div className="text-xs px-3 py-2 space-y-2 leading-tight">
          <div>
            <p className="font-semibold text-gray-900">{area.name}</p>
            <p className="text-[11px] text-gray-500">{area.city}</p>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wide text-gray-500">Similarity</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {area.similarityScore}%
              </span>
            </div>

            {area.population3km && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="uppercase tracking-wide text-gray-500">Population (3km)</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                  {area.population3km}
                </span>
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default memo(AreaMarker);
