import type { AppColors } from "../../brandTheme";
import type { StyleMap } from "./styleTypes";
import { createCommunityCommonStyles } from "./community/commonStyles";
import { createCommunityPostStyles } from "./community/postStyles";

export const createCommunityStyles = (colors: AppColors) =>
  ({
    ...createCommunityCommonStyles(colors),
    ...createCommunityPostStyles(colors),
  }) satisfies StyleMap;
