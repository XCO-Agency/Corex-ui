import * as React from "react";
import type { NavigationContextType } from "./Navigation.types";

export const NavigationContext = React.createContext<NavigationContextType | null>(null);

export function useNavigationContext(): NavigationContextType | null {
  return React.useContext(NavigationContext);
}
