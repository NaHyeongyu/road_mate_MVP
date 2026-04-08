import { Text } from "react-native";

import type { AppStyles } from "../../../ui/types";

type LabelProps = {
  text: string;
  optional?: boolean;
  styles: AppStyles;
};

export function Label({ text, optional, styles }: LabelProps) {
  return <Text style={styles.label}>{optional ? `${text} optional` : text}</Text>;
}
