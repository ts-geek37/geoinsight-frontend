"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

export enum PanelView {
  CLOSED = "CLOSED",
  STORE = "STORE",
  SIMILAR = "SIMILAR",
}

interface PanelState {
  view: PanelView;
  storeId: string | null;
}

type PanelAction =
  | { type: "OPEN_STORE"; payload: string }
  | { type: "OPEN_SIMILAR"; payload: string }
  | { type: "RETURN_TO_STORE" }
  | { type: "CLOSE" };

const initialState: PanelState = {
  view: PanelView.CLOSED,
  storeId: null,
};

function panelReducer(state: PanelState, action: PanelAction): PanelState {
  switch (action.type) {
    case "OPEN_STORE":
      return { view: PanelView.STORE, storeId: action.payload };

    case "OPEN_SIMILAR":
      return { view: PanelView.SIMILAR, storeId: action.payload };

    case "RETURN_TO_STORE":
      if (!state.storeId) return state;
      return { view: PanelView.STORE, storeId: state.storeId };

    case "CLOSE":
      return initialState;

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

  const value: PanelContextType = {
    ...state,
    openStore: (id) => dispatch({ type: "OPEN_STORE", payload: id }),
    openSimilar: (id) => dispatch({ type: "OPEN_SIMILAR", payload: id }),
    returnToStore: () => dispatch({ type: "RETURN_TO_STORE" }),
    close: () => dispatch({ type: "CLOSE" }),
  };

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
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

export const PanelContainer: React.FC<PanelContainerProps> = ({
  children,
  isOpen,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <aside
      className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
        isAnimating ? "w-[28vw] 2xl:w-[28vw] opacity-100" : "w-0 opacity-0"
      }`}
      style={{
        transitionProperty: "width, opacity",
      }}
    >
      <div className="w-[28vw] 2xl:w-[28vw] h-full">{children}</div>
    </aside>
  );
};
