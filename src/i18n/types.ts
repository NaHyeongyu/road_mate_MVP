export const APP_LANGUAGE_OPTIONS = [
  {
    code: "en",
    nativeLabel: "English",
    englishLabel: "English",
  },
  {
    code: "fr",
    nativeLabel: "Français",
    englishLabel: "French",
  },
  {
    code: "ko",
    nativeLabel: "한국어",
    englishLabel: "Korean",
  },
  {
    code: "ja",
    nativeLabel: "日本語",
    englishLabel: "Japanese",
  },
  {
    code: "zh",
    nativeLabel: "中文",
    englishLabel: "Chinese",
  },
] as const;

export type AppLanguage = (typeof APP_LANGUAGE_OPTIONS)[number]["code"];

