"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = React.useState(true);
  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar }}>{children}</SidebarContext.Provider>
  );
};

export const SidebarTrigger: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return <Button variant="ghost" size="icon" onClick={toggleSidebar} className="p-1" />;
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div
      className={cn(
        "relative h-full transition-all duration-300 ease-in-out flex",
        open ? "w-90" : "w-0",
      )}
    >
      <div className="flex-1 h-full overflow-hidden">{children}</div>
      <div
        onClick={toggleSidebar}
        className={cn(
          "flex items-center justify-center cursor-pointer border-l border-r border-primary-border bg-background",
          "w-6 hover:bg-gray-100 transition-colors duration-200",
        )}
      >
        <ChevronLeft
          className={cn("w-5 h-5 transition-transform duration-300", open ? "" : "rotate-180")}
        />
      </div>
    </div>
  );
};

export default Sidebar;
