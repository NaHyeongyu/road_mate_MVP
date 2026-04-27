import { createContext, useContext, type ReactNode } from "react";
import { useWindowDimensions } from "react-native";

export const PHONE_VIEWPORT_MAX_WIDTH = 430;

type AppViewportContextValue = {
  width: number;
  windowWidth: number;
  isPhoneFrameActive: boolean;
};

const AppViewportContext = createContext<AppViewportContextValue | null>(null);

type AppViewportProviderProps = {
  children: ReactNode;
  value: AppViewportContextValue;
};

export function AppViewportProvider({ children, value }: AppViewportProviderProps) {
  return <AppViewportContext.Provider value={value}>{children}</AppViewportContext.Provider>;
}

export function useAppViewport() {
  const context = useContext(AppViewportContext);
  const { width } = useWindowDimensions();

  return (
    context ?? {
      width,
      windowWidth: width,
      isPhoneFrameActive: false,
    }
  );
}
