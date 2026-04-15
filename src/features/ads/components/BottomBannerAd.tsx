import type { ComponentType } from "react";
import { View } from "react-native";

import { getBannerAdUnitId, isAdMobSupportedPlatform } from "../adMobUnits";
import { getMobileAdsModule } from "../mobileAdsRuntime";

type BottomBannerAdProps = {
  bottomInset?: number;
};

export function BottomBannerAd({ bottomInset = 0 }: BottomBannerAdProps) {
  const module = getMobileAdsModule();
  if (!isAdMobSupportedPlatform || !module) {
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
        unitId={getBannerAdUnitId()}
        size={module.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
