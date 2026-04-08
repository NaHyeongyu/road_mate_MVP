import type { ColorSchemeName } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
import { CommunityHomeScreen } from "../../features/community/screens/CommunityHomeScreen";
import type { AppStyles } from "../../ui/types";
import type { RoadmateAppState } from "../useRoadmateAppState";
import { buildCommunityHomeScreenProps } from "./screenBindings";

type AppCommunityExperienceScreenProps = {
  appState: RoadmateAppState;
  colors: AppColors;
  styles: AppStyles;
  scheme: ColorSchemeName;
};

export function AppCommunityExperienceScreen({
  appState,
  colors,
  styles,
  scheme: _scheme,
}: AppCommunityExperienceScreenProps) {
  const communityHomeScreenProps = buildCommunityHomeScreenProps({ appState, colors, styles });

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <CommunityHomeScreen {...communityHomeScreenProps} />
    </SafeAreaView>
  );
}
