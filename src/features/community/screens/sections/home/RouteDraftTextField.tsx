import {
  TextInput,
  type KeyboardTypeOptions,
  type NativeSyntheticEvent,
  type TextInputProps,
  type TextInputSubmitEditingEventData,
} from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { AppStyles } from "../../../../../ui/types";
import { Label } from "../../../../shared/components/Label";

type RouteDraftTextFieldProps = {
  colors: AppColors;
  styles: AppStyles;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  optional?: boolean;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: TextInputProps["autoCorrect"];
  secureTextEntry?: TextInputProps["secureTextEntry"];
  returnKeyType?: TextInputProps["returnKeyType"];
  blurOnSubmit?: TextInputProps["blurOnSubmit"];
  inputRef?: React.RefObject<TextInput | null>;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
  onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
};

export function RouteDraftTextField({
  colors,
  styles,
  label,
  value,
  onChangeText,
  placeholder,
  optional = false,
  multiline = false,
  maxLength,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  returnKeyType,
  blurOnSubmit,
  inputRef,
  onFocus,
  onBlur,
  onSubmitEditing,
}: RouteDraftTextFieldProps) {
  return (
    <>
      <Label text={label} optional={optional} styles={styles} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        style={[styles.input, multiline ? styles.multiline : null]}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
      />
    </>
  );
}
