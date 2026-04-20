import type { AppColors } from "../../brandTheme";
import type { StyleMap } from "./styleTypes";
import { createAuthAppBarStyles } from "./auth/appBarStyles";
import { createAuthFormStyles } from "./auth/formStyles";
import { createAuthHeroStyles } from "./auth/heroStyles";
import { createAuthLayoutStyles } from "./auth/layoutStyles";
import { createAuthProviderStyles } from "./auth/providerStyles";

export const createAuthStyles = (colors: AppColors) =>
  ({
    ...createAuthLayoutStyles(colors),
    ...createAuthProviderStyles(colors),
    ...createAuthHeroStyles(colors),
    ...createAuthFormStyles(colors),
    ...createAuthAppBarStyles(colors),
  }) satisfies StyleMap;
