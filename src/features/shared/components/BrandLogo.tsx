import { useMemo, type ComponentType } from "react";
import { Asset } from "expo-asset";
import { SvgUri } from "react-native-svg";

type BrandLogoProps = {
  source: unknown;
  width: number;
  height: number;
};

export function BrandLogo({ source, width, height }: BrandLogoProps) {
  const assetUri = useMemo(() => {
    if (typeof source === "number") {
      return Asset.fromModule(source).uri;
    }

    return null;
  }, [source]);

  if (typeof source === "function") {
    const SvgComponent = source as ComponentType<{ width?: number | string; height?: number | string }>;
    return <SvgComponent width={width} height={height} />;
  }

  if (source && typeof source === "object" && "default" in source) {
    const defaultExport = (source as { default?: unknown }).default;

    if (typeof defaultExport === "function") {
      const SvgComponent = defaultExport as ComponentType<{
        width?: number | string;
        height?: number | string;
      }>;
      return <SvgComponent width={width} height={height} />;
    }
  }

  if (assetUri) {
    return <SvgUri uri={assetUri} width={width} height={height} />;
  }

  return null;
}
