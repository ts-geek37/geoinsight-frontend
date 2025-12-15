"use client";

import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/store";
import { AreaMarkerProvider } from "./AreaMarkerContext";
import { GlobalProvider } from "./GlobalContext";
import { PanelProvider } from "./PanelContext";
import { SidebarProvider } from "./SidebarContext";

interface Props {
  children: React.ReactNode;
}

const ProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <GlobalProvider>
        <PanelProvider>
          <AreaMarkerProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </AreaMarkerProvider>
        </PanelProvider>
      </GlobalProvider>
    </ReduxProvider>
  );
};

export default ProviderWrapper;
