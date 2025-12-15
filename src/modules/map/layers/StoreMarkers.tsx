"use client";

import { memo, useCallback } from "react";
import { LayerGroup } from "react-leaflet";

import { usePanel } from "@/context";
import { Store } from "@/types";
import StoreMarker from "./StoreMarker";

interface Props {
  stores: Store[];
}

const StoreMarkersComponent: React.FC<Props> = ({ stores }) => {
  const { storeId: activeStoreId, openStore, close } = usePanel();

  const handleMarkerClick = useCallback(
    (storeId: string) => {
      if (storeId === activeStoreId) {
        close();
      } else {
        openStore(storeId);
      }
    },
    [activeStoreId, openStore, close],
  );

  return (
    <LayerGroup>
      {stores.map((store) => (
        <StoreMarker
          key={store.id}
          store={store}
          isActive={store.id === activeStoreId}
          onClick={handleMarkerClick}
        />
      ))}
    </LayerGroup>
  );
};

export const StoreMarkers = memo(StoreMarkersComponent);
export default StoreMarkers;
