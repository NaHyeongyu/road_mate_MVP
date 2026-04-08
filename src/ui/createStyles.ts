import { StyleSheet } from "react-native";

import type { AppColors } from "../brandTheme";
import { createAuthStyles } from "./styleFragments/authStyles";
import { createCommunityStyles } from "./styleFragments/communityStyles";
import { createLayoutStyles } from "./styleFragments/layoutStyles";

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    ...createLayoutStyles(colors),
    ...createAuthStyles(colors),
    ...createCommunityStyles(colors),
  });
