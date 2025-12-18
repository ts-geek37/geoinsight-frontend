"use client";

import { memo, useCallback } from "react";
import { LayerGroup } from "react-leaflet";

import { usePanel } from "@/context";
import { StoreMapItemDTO } from "@/types";
import StoreMarker from "./StoreMarker";

interface Props {
  stores: StoreMapItemDTO[];
}

const StoreMarkersComponent: React.FC<Props> = ({ stores }) => {
  const { storeId: activeId, openStore, close } = usePanel();

  const onClick = useCallback(
    (id: string) => {
      id === activeId ? close() : openStore(id);
    },
    [activeId, openStore, close],
  );

  return (
    <LayerGroup>
      {stores.map((store) => (
        <StoreMarker
          key={store.id}
          store={store}
          isActive={store.id === activeId}
          onClick={onClick}
        />
      ))}
    </LayerGroup>
  );
};

const StoreMarkers = memo(StoreMarkersComponent);
export default StoreMarkers;
