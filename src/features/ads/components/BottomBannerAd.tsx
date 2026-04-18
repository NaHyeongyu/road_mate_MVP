import type { ComponentType } from "react";
import { View } from "react-native";

import { getBannerAdUnitId, isAdMobSupportedPlatform } from "../adMobUnits";
import { getMobileAdsModule } from "../mobileAdsRuntime";

type BottomBannerAdProps = {
  bottomInset?: number;
};

export function BottomBannerAd({ bottomInset = 0 }: BottomBannerAdProps) {
  const module = getMobileAdsModule();
  const unitId = getBannerAdUnitId();
  if (!isAdMobSupportedPlatform || !module || !unitId) {
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
