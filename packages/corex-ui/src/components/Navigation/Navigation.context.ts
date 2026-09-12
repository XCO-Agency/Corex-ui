import * as React from "react";
import type { NavigationContextType } from "./Navigation.types";

export const NavigationContext = React.createContext<NavigationContextType<any> | null>(null);

export function useNavigationContext<TId extends string | number = string>(): NavigationContextType<TId> | null {
  return React.useContext(NavigationContext) as NavigationContextType<TId> | null;
}

