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
};

export function AppCommunityExperienceScreen({
  appState,
  colors,
  styles,
}: AppCommunityExperienceScreenProps) {
  const communityHomeScreenProps = buildCommunityHomeScreenProps({ appState, colors, styles });

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <CommunityHomeScreen {...communityHomeScreenProps} />
    </SafeAreaView>
  );
}
