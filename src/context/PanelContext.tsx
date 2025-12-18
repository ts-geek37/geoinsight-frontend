"use client";

import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export enum PanelView {
  CLOSED = "CLOSED",
  STORE = "STORE",
  SIMILAR = "SIMILAR",
}

interface PanelState {
  view: PanelView;
  storeId: string | null;
  previousView: PanelView | null;
}

type PanelAction =
  | { type: "OPEN_STORE"; payload: string }
  | { type: "OPEN_SIMILAR"; payload: string }
  | { type: "RETURN_TO_STORE" }
  | { type: "CLOSE" };

const initialState: PanelState = {
  view: PanelView.CLOSED,
  storeId: null,
  previousView: null,
};

function panelReducer(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    case "OPEN_STORE":
      return {
        view: PanelView.STORE,
        storeId: action.payload,
        previousView: state.view,
      };
    case "OPEN_SIMILAR":
      return {
        view: PanelView.SIMILAR,
        storeId: action.payload,
        previousView: state.view,
      };
    case "RETURN_TO_STORE":
      if (!state.storeId) return state;
      return {
        view: PanelView.STORE,
        storeId: state.storeId,
        previousView: state.view,
      };
    case "CLOSE":
      return {
        ...initialState,
        previousView: state.view,
      };
    default:
      return state;
  }
}

interface PanelContextType extends PanelState {
  openStore: (id: string) => void;
  openSimilar: (id: string) => void;
  returnToStore: () => void;
  close: () => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(panelReducer, initialState);

  return (
    <PanelContext.Provider
      value={{
        ...state,
        openStore: (id) => dispatch({ type: "OPEN_STORE", payload: id }),
        openSimilar: (id) => dispatch({ type: "OPEN_SIMILAR", payload: id }),
        returnToStore: () => dispatch({ type: "RETURN_TO_STORE" }),
        close: () => dispatch({ type: "CLOSE" }),
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel must be used within PanelProvider");
  return ctx;
};

interface PanelContainerProps {
  children: ReactNode;
  isOpen: boolean;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({ children, isOpen }) => {
  const { close } = usePanel();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isDesktop && isOpen) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[950]">
        <div className="pointer-events-auto absolute right-4 top-20 bottom-4 w-[420px] max-w-[90vw] rounded-2xl border bg-background/95 backdrop-blur shadow-2xl flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-x-4 bottom-0 left-1/2 z-[1001] h-[92dvh] sm:h-[88vh] w-[calc(100%-2rem)] -translate-x-1/2 rounded-t-2xl border bg-background p-0 flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300"
      >
        <DialogTitle className="sr-only">Panel</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface PanelContentWrapperProps {
  children: ReactNode;
  panelKey: string;
}

export const PanelContentWrapper: React.FC<PanelContentWrapperProps> = ({ children, panelKey }) => {
  const [displayedKey, setDisplayedKey] = useState(panelKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (panelKey !== displayedKey) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setDisplayedKey(panelKey);
        setDisplayedChildren(children);
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setDisplayedChildren(children);
    }
  }, [panelKey, displayedKey, children]);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-h-0 transition-all duration-150 ease-in-out",
        isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100",
      )}
    >
      {displayedChildren}
    </div>
  );
};
