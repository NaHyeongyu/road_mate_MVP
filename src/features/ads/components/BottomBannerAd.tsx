import type { ComponentType } from "react";
import { View } from "react-native";

import { getBannerAdUnitId, isAdMobEnabled, isAdMobSupportedPlatform } from "../adMobUnits";
import { getMobileAdsModule } from "../mobileAdsRuntime";

type BottomBannerAdProps = {
  bottomInset?: number;
};

export function BottomBannerAd({ bottomInset = 0 }: BottomBannerAdProps) {
  if (!isAdMobEnabled || !isAdMobSupportedPlatform) {
    return null;
  }

  const unitId = getBannerAdUnitId();
  if (!unitId) {
    return null;
  }

  const module = getMobileAdsModule();
  if (!module) {
    return null;
  }

  const BannerAd = module.BannerAd as unknown as ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: {
      requestNonPersonalizedAdsOnly?: boolean;
    };
  }>;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 6,
        paddingBottom: Math.max(bottomInset, 6),
      }}
    >
      <BannerAd
        unitId={unitId}
        size={module.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
