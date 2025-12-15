import { Store } from "@/types";
import { getFormattedLatestRevenue } from "@/utils/formatRevenue";
import getMarkerColor from "@/utils/rfm";
import L from "leaflet";
import { memo, useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";

interface Props {
  store: Store;
  isActive: boolean;
  onClick: (id: string) => void;
}

const StoreMarker: React.FC<Props> = ({ store, isActive, onClick }) => {
  const color = getMarkerColor(store.rfm_segment);
  const formattedRevenue = getFormattedLatestRevenue(store.yearly_revenue)?.latestRevenue;

  const icon = useMemo(() => {
    const size = isActive ? 18 : 14;
    const border = isActive ? 2 : 0;

    return L.divIcon({
      className: "",
      iconSize: [size + border * 2, size + border * 2],
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          border:${border}px solid white;
          transition: transform .15s ease, opacity .15s ease;
        "></div>
      `,
    });
  }, [color, isActive]);

  return (
    <Marker
      position={[store.latitude, store.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(store.id),

        mouseout: (e) => {
          const el = e.target._icon.firstChild;
          if (!el || !el?.style) return;

          el.style.opacity = isActive ? "1" : "0.85";
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div className="text-xs px-3 py-2 space-y-2 leading-tight">
          <div>
            <p className="font-medium text-gray-900">{store.name}</p>
            <p className="text-[11px] text-gray-500">
              {store.city}, {store.state}
            </p>
          </div>
          <div className="border-t border-gray-200"></div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wide text-gray-500">RFM</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {store.rfm_score}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wide text-gray-500">Revenue</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {formattedRevenue}
              </span>
            </div>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default memo(StoreMarker);
