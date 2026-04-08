import type { AppColors } from "../../brandTheme";
import type { StyleMap } from "./styleTypes";
import { createLayoutBottomBarStyles } from "./layout/bottomBarStyles";
import { createLayoutRoleToggleStyles } from "./layout/roleToggleStyles";
import { createLayoutScreenStyles } from "./layout/screenStyles";

export const createLayoutStyles = (colors: AppColors) =>
  ({
    ...createLayoutScreenStyles(colors),
    ...createLayoutBottomBarStyles(colors),
    ...createLayoutRoleToggleStyles(colors),
  }) satisfies StyleMap;
