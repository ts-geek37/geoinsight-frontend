"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import * as React from "react";

const SidebarContext = React.createContext<{
  open: boolean;
  toggleSidebar: () => void;
} | null>(null);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(true);
  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "h-full overflow-hidden bg-background border-r border-gray-300 transition-all duration-300",
          open ? "w-[20vw]" : "w-0"
        )}
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </div>

      <div
        className="w-6 h-full border-r border-gray-300 flex items-center justify-center"
        onClick={toggleSidebar}
      >
        <button className="h-16 w-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronLeft
            className={cn(
              "w-4 h-4 text-gray-600 transition-transform duration-300",
              !open && "rotate-180"
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
