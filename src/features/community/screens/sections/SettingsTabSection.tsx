import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppI18n } from "../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../ui/types";

type SettingsTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  isAuthenticated: boolean;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
  onRequestAuth: () => void;
};

export function SettingsTabSection({
  colors,
  styles,
  isAuthenticated,
  onSignOut,
  onWithdrawAccount,
  onRequestAuth,
}: SettingsTabSectionProps) {
  const { copy, language, options, setLanguage } = useAppI18n();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const sectionLabelStyle = {
    color: colors.subtext,
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 0.7,
    textTransform: "uppercase" as const,
    marginLeft: 4,
    marginBottom: 8,
  };
  const groupedListStyle = {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden" as const,
  };
  const rowBaseStyle = {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  };
  const leadingIconWrapStyle = {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.panelAlt,
  };
  const rowTitleStyle = {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700" as const,
  };
  const rowDetailStyle = {
    color: colors.subtext,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  };
  const rowDividerStyle = {
    marginLeft: 62,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  return (
    <>
      <View
        style={{
          marginBottom: 22,
        }}
      >
        <Text style={sectionLabelStyle}>{copy.common.accountManagement}</Text>
        <Text
          style={[
            styles.cardBody,
            {
              marginBottom: 10,
              marginLeft: 4,
            },
          ]}
        >
          {isAuthenticated
            ? copy.community.accountManagementSignedIn
            : copy.community.accountManagementGuest}
        </Text>
        <View style={groupedListStyle}>
          {!isAuthenticated ? (
            <Pressable
              onPress={onRequestAuth}
              style={({ pressed }) => [
                rowBaseStyle,
                pressed
                  ? {
                      opacity: 0.88,
                    }
                  : null,
              ]}
            >
              <View style={leadingIconWrapStyle}>
                <MaterialCommunityIcons name="account-plus-outline" size={18} color={colors.hero} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={rowTitleStyle}>{copy.auth.signUp}</Text>
                <Text style={rowDetailStyle}>{copy.auth.createAccountWithEmail}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.subtext} />
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  if (confirmSignOut) {
                    onSignOut();
                    return;
                  }
                  setConfirmSignOut(true);
                  setConfirmWithdraw(false);
                }}
                style={({ pressed }) => [
                  rowBaseStyle,
                  pressed
                    ? {
                        opacity: 0.88,
                      }
                    : null,
                ]}
              >
                <View style={leadingIconWrapStyle}>
                  <MaterialCommunityIcons
                    name={confirmSignOut ? "logout" : "logout-variant"}
                    size={18}
                    color={colors.hero}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={rowTitleStyle}>
                    {confirmSignOut ? copy.community.confirmSignOut : copy.auth.signOut}
                  </Text>
                  <Text style={rowDetailStyle}>
                    {confirmSignOut
                      ? copy.community.confirmSignOutPrompt
                      : copy.common.accountManagement}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.subtext} />
              </Pressable>
              <View style={rowDividerStyle} />
              {confirmSignOut ? (
                <>
                  <Pressable
                    onPress={() => setConfirmSignOut(false)}
                    style={({ pressed }) => [
                      rowBaseStyle,
                      {
                        minHeight: 56,
                      },
                      pressed
                        ? {
                            opacity: 0.88,
                          }
                        : null,
                    ]}
                  >
                    <View style={leadingIconWrapStyle}>
                      <MaterialCommunityIcons name="close" size={18} color={colors.subtext} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={rowTitleStyle}>{copy.community.cancelSignOut}</Text>
                    </View>
                  </Pressable>
                  <View style={rowDividerStyle} />
                </>
              ) : null}
            <Pressable
              onPress={() => {
                if (confirmWithdraw) {
                  onWithdrawAccount();
                  return;
                }
                setConfirmWithdraw(true);
                setConfirmSignOut(false);
              }}
              style={({ pressed }) => [
                rowBaseStyle,
                pressed
                  ? {
                      opacity: 0.88,
                    }
                  : null,
              ]}
            >
              <View
                style={[
                  leadingIconWrapStyle,
                  {
                    backgroundColor: "#FEF2F2",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={confirmWithdraw ? "alert-outline" : "account-remove-outline"}
                  size={18}
                  color="#B42318"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    rowTitleStyle,
                    {
                      color: "#B42318",
                    },
                  ]}
                >
                  {confirmWithdraw ? copy.community.confirmLeave : copy.community.leaveCommunity}
                </Text>
                <Text style={rowDetailStyle}>
                  {confirmWithdraw
                    ? copy.community.confirmLeavePrompt
                    : copy.alerts.leaveCommunityBody}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#B42318" />
            </Pressable>
            {confirmWithdraw ? (
              <>
                <View style={rowDividerStyle} />
                <Pressable
                  onPress={() => setConfirmWithdraw(false)}
                  style={({ pressed }) => [
                    rowBaseStyle,
                    {
                      minHeight: 56,
                    },
                    pressed
                      ? {
                          opacity: 0.88,
                        }
                      : null,
                  ]}
                >
                  <View style={leadingIconWrapStyle}>
                    <MaterialCommunityIcons name="close" size={18} color={colors.subtext} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={rowTitleStyle}>{copy.community.cancelLeaving}</Text>
                  </View>
                </Pressable>
              </>
            ) : null}
            </>
          )}
        </View>
      </View>

      <View>
        <Text style={sectionLabelStyle}>{copy.common.changeLanguage}</Text>
        <Text
          style={[
            styles.cardBody,
            {
              marginBottom: 10,
              marginLeft: 4,
            },
          ]}
        >
          {copy.community.settingsLanguageDescription}
        </Text>
        <View style={groupedListStyle}>
          {options.map((option, index) => {
            const isSelected = option.code === language;
            return (
              <View key={option.code}>
                <Pressable
                  onPress={() => setLanguage(option.code)}
                  style={({ pressed }) => [
                    rowBaseStyle,
                    isSelected
                      ? {
                          backgroundColor: colors.panelAlt,
                        }
                      : null,
                    pressed
                      ? {
                          opacity: 0.88,
                        }
                      : null,
                  ]}
                >
                  <View style={leadingIconWrapStyle}>
                    <MaterialCommunityIcons
                      name="translate"
                      size={18}
                      color={isSelected ? colors.hero : colors.subtext}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={rowTitleStyle}>{option.nativeLabel}</Text>
                    <Text style={rowDetailStyle}>{option.englishLabel}</Text>
                  </View>
                  {isSelected ? (
                    <MaterialCommunityIcons name="check" size={20} color={colors.hero} />
                  ) : (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.subtext}
                    />
                  )}
                </Pressable>
                {index < options.length - 1 ? <View style={rowDividerStyle} /> : null}
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
}
