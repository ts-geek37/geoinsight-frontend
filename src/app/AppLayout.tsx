"use client";

import React from "react";

import Header from "@/components/Header";
import { PanelContainer, PanelContentWrapper, PanelView, Sidebar, usePanel } from "@/context";
import { OpportunityPanel, StoreDetailsPanel } from "@/modules/dashboard";
import { SidebarDetails } from "@/modules/sidebar";

interface Props {
  children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  const { view, storeId, openStore, openSimilar, returnToStore, close } = usePanel();

  const isPanelOpen = view !== PanelView.CLOSED && !!storeId;
   return (
    <>
      <Header />

      <div className="flex h-[calc(100dvh-64px)] overflow-hidden">
        <Sidebar>
          <SidebarDetails onSelectStore={(st) => openStore(st)} />
        </Sidebar>

        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>

      <PanelContainer isOpen={isPanelOpen}>
        <PanelContentWrapper panelKey={view}>
          {view === PanelView.STORE && storeId && (
            <StoreDetailsPanel
              key={`store-${storeId}`}
              storeId={storeId}
              onClose={close}
              onFindSimilar={openSimilar}
            />
          )}

          {view === PanelView.SIMILAR && storeId && (
            <OpportunityPanel key={`similar-${storeId}`} storeId={storeId} onBack={returnToStore} />
          )}
        </PanelContentWrapper>
      </PanelContainer>
    </>
  );
};

export default AppLayout;
