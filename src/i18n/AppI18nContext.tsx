import { createContext, useContext, useMemo, type ReactNode } from "react";

import { getAppCopy, type AppCopy } from "./copy";
import { APP_LANGUAGE_OPTIONS, type AppLanguage } from "./types";

type AppI18nContextValue = {
  language: AppLanguage;
  copy: AppCopy;
  setLanguage: (language: AppLanguage) => void;
  options: typeof APP_LANGUAGE_OPTIONS;
};

const AppI18nContext = createContext<AppI18nContextValue>({
  language: "en",
  copy: getAppCopy("en"),
  setLanguage: () => {},
  options: APP_LANGUAGE_OPTIONS,
});

type AppI18nProviderProps = {
  language: AppLanguage;
  onChangeLanguage: (language: AppLanguage) => void;
  children: ReactNode;
};

export function AppI18nProvider({
  language,
  onChangeLanguage,
  children,
}: AppI18nProviderProps) {
  const copy = useMemo(() => getAppCopy(language), [language]);
  const value = useMemo(
    () => ({
      language,
      copy,
      setLanguage: onChangeLanguage,
      options: APP_LANGUAGE_OPTIONS,
    }),
    [copy, language, onChangeLanguage]
  );

  return <AppI18nContext.Provider value={value}>{children}</AppI18nContext.Provider>;
}

export function useAppI18n() {
  return useContext(AppI18nContext);
}

export function useAppCopy() {
  return useContext(AppI18nContext).copy;
}

