import type { AppColors } from "../../../brandTheme";
import type { StyleMap } from "../styleTypes";
import { createCommunityPostActionStyles } from "./postActionStyles";
import { createCommunityPostDetailStyles } from "./postDetailStyles";
import { createCommunityPostRouteStyles } from "./postRouteStyles";

export const createCommunityPostStyles = (colors: AppColors) =>
  ({
    ...createCommunityPostRouteStyles(colors),
    ...createCommunityPostDetailStyles(colors),
    ...createCommunityPostActionStyles(colors),
  }) satisfies StyleMap;
