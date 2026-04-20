import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppI18n } from "../../../../i18n/AppI18nContext";
import type { AppLanguage } from "../../../../i18n/types";
import {
  createSupportRequestInDb,
  type SupportRequestCategory,
} from "../../../support/data/supportRequestRepository";
import type { AppStyles } from "../../../../ui/types";

type SettingsTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  isAuthenticated: boolean;
  currentUserId: string;
  currentUserEmail: string;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
  onRequestAuth: () => void;
};

const SUPPORT_CATEGORY_OPTIONS: Array<{
  value: SupportRequestCategory;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { value: "inquiry", icon: "message-question-outline" },
  { value: "bug", icon: "bug-outline" },
  { value: "change_request", icon: "pencil-ruler" },
  { value: "other", icon: "dots-horizontal-circle-outline" },
];

const SUPPORT_COPY: Record<
  AppLanguage,
  {
    section: string;
    description: string;
    email: string;
    title: string;
    message: string;
    titlePlaceholder: string;
    messagePlaceholder: string;
    invalidEmail: string;
    submit: string;
    sending: string;
    sent: string;
    failed: (message: string) => string;
    categories: Record<SupportRequestCategory, string>;
  }
> = {
  en: {
    section: "Contact support",
    description: "Send inquiries, bug reports, or change requests directly to operations.",
    email: "Reply email",
    title: "Title",
    message: "Message",
    titlePlaceholder: "Brief summary",
    messagePlaceholder: "Describe what happened or what should change.",
    invalidEmail: "Enter a valid reply email.",
    submit: "Send request",
    sending: "Sending...",
    sent: "Request sent. We will review it in the admin console.",
    failed: (message) => `Could not send request: ${message}`,
    categories: {
      inquiry: "Inquiry",
      bug: "Bug",
      change_request: "Change request",
      other: "Other",
    },
  },
  fr: {
    section: "Contacter le support",
    description: "Envoyez une question, un bug ou une demande de modification aux opérations.",
    email: "E-mail de réponse",
    title: "Titre",
    message: "Message",
    titlePlaceholder: "Résumé court",
    messagePlaceholder: "Décrivez le problème ou le changement demandé.",
    invalidEmail: "Saisissez une adresse e-mail de réponse valide.",
    submit: "Envoyer",
    sending: "Envoi...",
    sent: "Demande envoyée. Nous la traiterons dans la console admin.",
    failed: (message) => `Impossible d’envoyer la demande : ${message}`,
    categories: {
      inquiry: "Question",
      bug: "Bug",
      change_request: "Modification",
      other: "Autre",
    },
  },
  ko: {
    section: "문의하기",
    description: "문의, 버그 제보, 수정 요청을 관리자에게 바로 보낼 수 있어요.",
    email: "답변 받을 이메일",
    title: "제목",
    message: "내용",
    titlePlaceholder: "간단한 요약",
    messagePlaceholder: "문제 상황이나 수정 요청 내용을 적어주세요.",
    invalidEmail: "답변받을 수 있는 올바른 이메일을 입력하세요.",
    submit: "문의 보내기",
    sending: "보내는 중...",
    sent: "문의가 접수되었습니다. 관리자 콘솔에서 확인할 수 있습니다.",
    failed: (message) => `문의 접수에 실패했습니다: ${message}`,
    categories: {
      inquiry: "문의",
      bug: "버그 발견",
      change_request: "수정 요청",
      other: "기타",
    },
  },
  ja: {
    section: "お問い合わせ",
    description: "問い合わせ、バグ報告、修正依頼を運営へ送信できます。",
    email: "返信先メール",
    title: "タイトル",
    message: "内容",
    titlePlaceholder: "短い概要",
    messagePlaceholder: "問題や変更してほしい内容を書いてください。",
    invalidEmail: "返信を受け取れる有効なメールアドレスを入力してください。",
    submit: "送信",
    sending: "送信中...",
    sent: "リクエストを送信しました。管理画面で確認できます。",
    failed: (message) => `送信できませんでした: ${message}`,
    categories: {
      inquiry: "問い合わせ",
      bug: "バグ",
      change_request: "修正依頼",
      other: "その他",
    },
  },
  zh: {
    section: "联系支持",
    description: "向管理员发送咨询、问题反馈或修改请求。",
    email: "回复邮箱",
    title: "标题",
    message: "内容",
    titlePlaceholder: "简短摘要",
    messagePlaceholder: "描述问题或希望修改的内容。",
    invalidEmail: "请输入有效的回复邮箱。",
    submit: "发送",
    sending: "发送中...",
    sent: "请求已发送，可在管理后台查看。",
    failed: (message) => `发送失败：${message}`,
    categories: {
      inquiry: "咨询",
      bug: "Bug",
      change_request: "修改请求",
      other: "其他",
    },
  },
};

export function SettingsTabSection({
  colors,
  styles,
  isAuthenticated,
  currentUserId,
  currentUserEmail,
  onSignOut,
  onWithdrawAccount,
  onRequestAuth,
}: SettingsTabSectionProps) {
  const { copy, language, options, setLanguage } = useAppI18n();
  const supportCopy = SUPPORT_COPY[language] ?? SUPPORT_COPY.en;
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [supportCategory, setSupportCategory] = useState<SupportRequestCategory>("inquiry");
  const [supportEmail, setSupportEmail] = useState(currentUserEmail);
  const [supportTitle, setSupportTitle] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState("");
  const [isSupportSubmitting, setIsSupportSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserEmail && !supportEmail.trim()) {
      setSupportEmail(currentUserEmail);
    }
  }, [currentUserEmail, supportEmail]);
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
  const supportInputStyle = {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.panelAlt,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  };
  const supportLabelStyle = {
    color: colors.subtext,
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  };
  const normalizedSupportEmail = supportEmail.trim();
  const isSupportEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedSupportEmail);
  const canSubmitSupport = Boolean(
    normalizedSupportEmail &&
      isSupportEmailValid &&
      supportTitle.trim() &&
      supportMessage.trim() &&
      !isSupportSubmitting
  );
  const handleSubmitSupportRequest = async () => {
    if (!canSubmitSupport) {
      return;
    }

    setIsSupportSubmitting(true);
    setSupportStatus("");
    if (!isSupportEmailValid) {
      setSupportStatus(supportCopy.invalidEmail);
      setIsSupportSubmitting(false);
      return;
    }
    try {
      await createSupportRequestInDb({
        category: supportCategory,
        userId: currentUserId,
        userEmail: normalizedSupportEmail,
        title: supportTitle,
        message: supportMessage,
      });
      setSupportTitle("");
      setSupportMessage("");
      setSupportStatus(supportCopy.sent);
    } catch (error) {
      setSupportStatus(
        supportCopy.failed(error instanceof Error ? error.message : String(error ?? "Unknown error"))
      );
    } finally {
      setIsSupportSubmitting(false);
    }
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

      <View
        style={{
          marginBottom: 22,
        }}
      >
        <Text style={sectionLabelStyle}>{supportCopy.section}</Text>
        <Text
          style={[
            styles.cardBody,
            {
              marginBottom: 10,
              marginLeft: 4,
            },
          ]}
        >
          {supportCopy.description}
        </Text>
        <View
          style={[
            groupedListStyle,
            {
              padding: 14,
              gap: 12,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {SUPPORT_CATEGORY_OPTIONS.map((option) => {
              const isSelected = supportCategory === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSupportCategory(option.value)}
                  style={({ pressed }) => [
                    {
                      minHeight: 40,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.hero : colors.border,
                      backgroundColor: isSelected ? colors.panelAlt : "#FFFFFF",
                      paddingHorizontal: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    },
                    pressed
                      ? {
                          opacity: 0.86,
                        }
                      : null,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={16}
                    color={isSelected ? colors.hero : colors.subtext}
                  />
                  <Text
                    style={{
                      color: isSelected ? colors.text : colors.subtext,
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                  >
                    {supportCopy.categories[option.value]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View>
            <Text style={supportLabelStyle}>{supportCopy.email}</Text>
            <TextInput
              value={supportEmail}
              onChangeText={setSupportEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.subtext}
	              autoCapitalize="none"
	              keyboardType="email-address"
	              style={supportInputStyle}
	            />
	            {normalizedSupportEmail && !isSupportEmailValid ? (
	              <Text style={[styles.authStatusText, styles.authStatusErrorText]}>
	                {supportCopy.invalidEmail}
	              </Text>
	            ) : null}
	          </View>
          <View>
            <Text style={supportLabelStyle}>{supportCopy.title}</Text>
            <TextInput
              value={supportTitle}
              onChangeText={(value) => setSupportTitle(value.slice(0, 120))}
              placeholder={supportCopy.titlePlaceholder}
              placeholderTextColor={colors.subtext}
              style={supportInputStyle}
            />
          </View>
          <View>
            <Text style={supportLabelStyle}>{supportCopy.message}</Text>
            <TextInput
              value={supportMessage}
              onChangeText={(value) => setSupportMessage(value.slice(0, 2000))}
              placeholder={supportCopy.messagePlaceholder}
              placeholderTextColor={colors.subtext}
              multiline
              textAlignVertical="top"
              style={[
                supportInputStyle,
                {
                  minHeight: 112,
                  lineHeight: 20,
                },
              ]}
            />
          </View>
          {supportStatus ? (
            <Text
              style={[
                styles.cardBody,
                {
                  color: supportStatus === supportCopy.sent ? colors.hero : "#B42318",
                },
              ]}
            >
              {supportStatus}
            </Text>
          ) : null}
          <Pressable
            disabled={!canSubmitSupport}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                marginTop: 0,
                opacity: canSubmitSupport ? 1 : 0.42,
              },
              pressed
                ? {
                    opacity: 0.78,
                  }
                : null,
            ]}
            onPress={handleSubmitSupportRequest}
          >
            <Text style={styles.primaryButtonText}>
              {isSupportSubmitting ? supportCopy.sending : supportCopy.submit}
            </Text>
          </Pressable>
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
