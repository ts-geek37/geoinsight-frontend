"use client";

import React from "react";

import Header from "@/components/Header";
import { PanelContainer, PanelView, Sidebar, usePanel } from "@/context";
import { OpportunityPanel, StoreDetailsPanel } from "@/modules/dashboard";
import { SidebarDetails } from "@/modules/sidebar";

interface Props {
  children: React.ReactNode;
}

const AppLayoutContent: React.FC<Props> = ({ children }) => {
  const { view, storeId, openStore, openSimilar, returnToStore, close } =
    usePanel();

  const isOpen = view !== PanelView.CLOSED;

  return (
    <>
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar>
          <SidebarDetails onSelectStore={(st) => openStore(st.id)} />
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-auto">{children}</main>

        <PanelContainer
          isOpen={isOpen && !!storeId && view === PanelView.STORE}
        >
          <StoreDetailsPanel
            storeId={storeId || ""}
            onClose={close}
            onFindSimilar={openSimilar}
          />
        </PanelContainer>

        <PanelContainer
          isOpen={isOpen && !!storeId && view === PanelView.SIMILAR}
        >
          <OpportunityPanel storeId={storeId || ""} onBack={returnToStore} />
        </PanelContainer>
      </div>
    </>
  );
};

export const AppLayout = ({ children }: Props) => {
  return <AppLayoutContent>{children}</AppLayoutContent>;
};

export default AppLayout;
