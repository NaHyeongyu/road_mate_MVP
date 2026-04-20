import { createContext, createElement, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { brandPalette, type AppColors } from "../brandTheme";

const AppColorsContext = createContext<AppColors | null>(null);

type AppColorsProviderProps = {
  colors: AppColors;
  children: ReactNode;
};

export function AppColorsProvider({ colors, children }: AppColorsProviderProps) {
  return createElement(AppColorsContext.Provider, { value: colors }, children);
}

export function useAppColors() {
  const colors = useContext(AppColorsContext);
  const fallbackScheme = useColorScheme();

  return colors ?? (fallbackScheme === "dark" ? brandPalette.dark : brandPalette.light);
}
