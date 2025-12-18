"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const SidebarContext = React.createContext<{
  open: boolean;
  toggleSidebar: () => void;
} | null>(null);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar }}>{children}</SidebarContext.Provider>
  );
};

const HEADER_HEIGHT = 64;

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = useSidebar();

  return (
    <div
      className="pointer-events-none fixed left-0 z-[900]"
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <div
        className={cn(
          "pointer-events-auto h-full w-[100vw] md:w-[22vw] border-r  transition-transform duration-200 ease-in",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
export default Sidebar;
