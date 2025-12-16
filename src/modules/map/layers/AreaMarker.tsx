"use client";

import L from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";

import { AreaProfile } from "@/types";

interface Props {
  area: AreaProfile;
}

const AreaMarker: React.FC<Props> = ({ area }) => {
  const similarity = Math.round(area.similarity_score ?? 0);

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
          transition: transform .15s ease, opacity .15s ease;
        "></div>
      `,
    });
  }, [color]);

  return (
    <Marker position={[area.latitude, area.longitude]} icon={icon}>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div className="text-xs px-3 py-2 space-y-2 leading-tight">
          <div>
            <p className="font-semibold text-gray-900">{area.area_name}</p>
            <p className="text-[11px] text-gray-500">
              {area.city}, {area.state}
            </p>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wide text-gray-500">Similarity</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{similarity}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wide text-gray-500">Population (3km)</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {area.population_3km?.toLocaleString() ?? "NA"}
              </span>
            </div>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default memo(AreaMarker);
