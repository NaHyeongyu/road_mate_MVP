import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import { createCommunityComposerStyles } from "./composerStyles";
import { createCommunitySurfaceStyles } from "./surfaceStyles";

export const createCommunityCommonStyles = (colors: AppColors) =>
  ({
    ...createCommunitySurfaceStyles(colors),
    ...createCommunityComposerStyles(colors),
  }) satisfies StyleMap;
