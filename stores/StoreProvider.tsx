// stores/StoreProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { ordersStore } from "./ordersStore";

const StoreContext = createContext({
  ordersStore,
});

export const useOrderStore = () => useContext(StoreContext).ordersStore;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreContext.Provider value={{ ordersStore }}>
      {children}
    </StoreContext.Provider>
  );
}