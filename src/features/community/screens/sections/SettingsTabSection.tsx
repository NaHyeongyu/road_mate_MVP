import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import type { AppThemeMode } from "../../../../app/theme";
import type { AppColors } from "../../../../brandTheme";
import { useAppI18n } from "../../../../i18n/AppI18nContext";
import type { AppLanguage } from "../../../../i18n/types";
import { supabase } from "../../../../lib/supabase";
import type { AppStyles } from "../../../../ui/types";
import {
  createSupportRequestInDb,
  fetchMySupportRequestsFromDb,
  type SupportRequestCategory,
  type SupportRequestRecord,
} from "../../../support/data/supportRequestRepository";

type SettingsTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  isAuthenticated: boolean;
  currentUserId: string;
  currentUserEmail: string;
  appThemeMode: AppThemeMode;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
  onRequestAuth: () => void;
  onAppThemeModeChange: (mode: AppThemeMode) => void;
};

type SettingsRoute = "home" | "account" | "support" | "supportHistory";

const SUPPORT_CATEGORY_OPTIONS: Array<{
  value: SupportRequestCategory;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { value: "inquiry", icon: "message-question-outline" },
  { value: "bug", icon: "bug-outline" },
  { value: "change_request", icon: "pencil-ruler" },
  { value: "other", icon: "dots-horizontal-circle-outline" },
];

const SETTINGS_COPY: Record<
  AppLanguage,
  {
    account: string;
    accountDetail: string;
    support: string;
    supportDetail: string;
    appearance: string;
    appearanceDetail: string;
    themeSystem: string;
    themeSystemDetail: string;
    themeLight: string;
    themeLightDetail: string;
    themeDark: string;
    themeDarkDetail: string;
    language: string;
    languageDetail: string;
    loginInfo: string;
    signedInEmail: string;
    passwordChange: string;
    passwordHint: string;
    passwordSuccess: string;
    passwordFailed: (message: string) => string;
    passwordMismatch: string;
    deleteAccount: string;
    deleteRetentionNotice: string;
    supportCreate: string;
    supportTitle: string;
    supportMessage: string;
    supportHistory: string;
    supportHistoryDetail: string;
    supportSent: string;
    supportFailed: (message: string) => string;
    supportHistoryAuthRequired: string;
    loadingHistory: string;
    noHistory: string;
    adminReply: string;
    categories: Record<SupportRequestCategory, string>;
    statuses: Record<SupportRequestRecord["status"], string>;
  }
> = {
  en: {
    account: "Account",
    accountDetail: "Login info, password, sign out, and deletion request.",
    support: "Support",
    supportDetail: "Send a request or check previous support messages.",
    appearance: "Appearance",
    appearanceDetail: "Choose system, light, or dark mode for this app.",
    themeSystem: "System setting",
    themeSystemDetail: "Follow this device setting.",
    themeLight: "Light mode",
    themeLightDetail: "Keep the app bright.",
    themeDark: "Dark mode",
    themeDarkDetail: "Keep the app dark.",
    language: "Language",
    languageDetail: "Choose the app language used on this device.",
    loginInfo: "Login info",
    signedInEmail: "Signed in email",
    passwordChange: "Change password",
    passwordHint: "Enter a new password with at least 6 characters.",
    passwordSuccess: "Password changed.",
    passwordFailed: (message) => `Password change failed: ${message}`,
    passwordMismatch: "Passwords do not match.",
    deleteAccount: "Delete account",
    deleteRetentionNotice:
      "Deletion requests keep account data for 30 days before permanent cleanup.",
    supportCreate: "Create support request",
    supportTitle: "Title",
    supportMessage: "Message",
    supportHistory: "Previous support requests",
    supportHistoryDetail: "View status and admin replies.",
    supportSent: "Request sent. We will review it in the admin console.",
    supportFailed: (message) => `Could not send request: ${message}`,
    supportHistoryAuthRequired: "Sign in to view previous support requests.",
    loadingHistory: "Loading support history...",
    noHistory: "No previous support requests yet.",
    adminReply: "Admin reply",
    categories: {
      inquiry: "Inquiry",
      bug: "Bug",
      change_request: "Change request",
      other: "Other",
    },
    statuses: {
      open: "Open",
      in_progress: "In progress",
      resolved: "Resolved",
      closed: "Closed",
    },
  },
  fr: {
    account: "Compte",
    accountDetail: "Connexion, mot de passe, déconnexion et suppression.",
    support: "Support",
    supportDetail: "Envoyez une demande ou consultez les messages précédents.",
    appearance: "Apparence",
    appearanceDetail: "Choisissez le mode système, clair ou sombre.",
    themeSystem: "Réglage système",
    themeSystemDetail: "Suit le réglage de cet appareil.",
    themeLight: "Mode clair",
    themeLightDetail: "Garde l’app en mode clair.",
    themeDark: "Mode sombre",
    themeDarkDetail: "Garde l’app en mode sombre.",
    language: "Langue",
    languageDetail: "Choisissez la langue utilisée sur cet appareil.",
    loginInfo: "Infos de connexion",
    signedInEmail: "E-mail connecté",
    passwordChange: "Changer le mot de passe",
    passwordHint: "Saisissez un nouveau mot de passe de 6 caractères minimum.",
    passwordSuccess: "Mot de passe modifié.",
    passwordFailed: (message) => `Échec du changement de mot de passe : ${message}`,
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    deleteAccount: "Supprimer le compte",
    deleteRetentionNotice:
      "Les demandes de suppression conservent les données du compte pendant 30 jours.",
    supportCreate: "Créer une demande",
    supportTitle: "Titre",
    supportMessage: "Message",
    supportHistory: "Demandes précédentes",
    supportHistoryDetail: "Consultez le statut et les réponses admin.",
    supportSent: "Demande envoyée. Nous la traiterons dans la console admin.",
    supportFailed: (message) => `Impossible d’envoyer la demande : ${message}`,
    supportHistoryAuthRequired: "Connectez-vous pour voir les demandes précédentes.",
    loadingHistory: "Chargement de l’historique...",
    noHistory: "Aucune demande précédente.",
    adminReply: "Réponse admin",
    categories: {
      inquiry: "Question",
      bug: "Bug",
      change_request: "Modification",
      other: "Autre",
    },
    statuses: {
      open: "Ouverte",
      in_progress: "En cours",
      resolved: "Résolue",
      closed: "Fermée",
    },
  },
  ko: {
    account: "계정",
    accountDetail: "로그인 정보, 비밀번호 변경, 로그아웃, 계정 삭제를 관리합니다.",
    support: "문의",
    supportDetail: "문의 등록과 이전 문의 내역을 확인합니다.",
    appearance: "화면 모드",
    appearanceDetail: "앱 화면을 시스템 설정, 화이트 모드, 다크 모드 중 선택합니다.",
    themeSystem: "시스템 설정",
    themeSystemDetail: "기기 설정을 따라갑니다.",
    themeLight: "화이트 모드",
    themeLightDetail: "밝은 화면으로 고정합니다.",
    themeDark: "다크 모드",
    themeDarkDetail: "어두운 화면으로 고정합니다.",
    language: "언어",
    languageDetail: "이 기기에서 사용할 앱 언어를 선택합니다.",
    loginInfo: "로그인 정보",
    signedInEmail: "로그인 이메일",
    passwordChange: "비밀번호 변경",
    passwordHint: "6자 이상의 새 비밀번호를 입력하세요.",
    passwordSuccess: "비밀번호가 변경되었습니다.",
    passwordFailed: (message) => `비밀번호 변경에 실패했습니다: ${message}`,
    passwordMismatch: "비밀번호가 서로 일치하지 않습니다.",
    deleteAccount: "계정 삭제",
    deleteRetentionNotice:
      "계정 삭제 요청 후 데이터는 30일 동안 보관되며 이후 영구 정리됩니다.",
    supportCreate: "문의 등록",
    supportTitle: "제목",
    supportMessage: "내용",
    supportHistory: "이전 문의 내역",
    supportHistoryDetail: "처리 상태와 관리자 답변을 확인합니다.",
    supportSent: "문의가 접수되었습니다. 관리자 콘솔에서 확인할 수 있습니다.",
    supportFailed: (message) => `문의 접수에 실패했습니다: ${message}`,
    supportHistoryAuthRequired: "이전 문의 내역은 로그인 후 확인할 수 있습니다.",
    loadingHistory: "문의 내역을 불러오는 중...",
    noHistory: "아직 이전 문의 내역이 없습니다.",
    adminReply: "관리자 답변",
    categories: {
      inquiry: "문의",
      bug: "버그 발견",
      change_request: "수정 요청",
      other: "기타",
    },
    statuses: {
      open: "접수",
      in_progress: "처리 중",
      resolved: "해결",
      closed: "종료",
    },
  },
  ja: {
    account: "アカウント",
    accountDetail: "ログイン情報、パスワード、ログアウト、削除を管理します。",
    support: "お問い合わせ",
    supportDetail: "問い合わせの送信と履歴確認を行います。",
    appearance: "表示モード",
    appearanceDetail: "システム、ライト、ダークから選択します。",
    themeSystem: "システム設定",
    themeSystemDetail: "端末の設定に従います。",
    themeLight: "ライトモード",
    themeLightDetail: "明るい表示に固定します。",
    themeDark: "ダークモード",
    themeDarkDetail: "暗い表示に固定します。",
    language: "言語",
    languageDetail: "この端末で使うアプリ言語を選択します。",
    loginInfo: "ログイン情報",
    signedInEmail: "ログインメール",
    passwordChange: "パスワード変更",
    passwordHint: "6文字以上の新しいパスワードを入力してください。",
    passwordSuccess: "パスワードを変更しました。",
    passwordFailed: (message) => `パスワード変更に失敗しました: ${message}`,
    passwordMismatch: "パスワードが一致しません。",
    deleteAccount: "アカウント削除",
    deleteRetentionNotice:
      "削除リクエスト後、データは30日間保持され、その後完全に削除されます。",
    supportCreate: "問い合わせを送信",
    supportTitle: "タイトル",
    supportMessage: "内容",
    supportHistory: "過去の問い合わせ",
    supportHistoryDetail: "ステータスと管理者返信を確認します。",
    supportSent: "リクエストを送信しました。管理画面で確認できます。",
    supportFailed: (message) => `送信できませんでした: ${message}`,
    supportHistoryAuthRequired: "過去の問い合わせを見るにはログインしてください。",
    loadingHistory: "問い合わせ履歴を読み込み中...",
    noHistory: "過去の問い合わせはありません。",
    adminReply: "管理者返信",
    categories: {
      inquiry: "問い合わせ",
      bug: "バグ",
      change_request: "修正依頼",
      other: "その他",
    },
    statuses: {
      open: "受付",
      in_progress: "対応中",
      resolved: "解決済み",
      closed: "終了",
    },
  },
  zh: {
    account: "账号",
    accountDetail: "管理登录信息、密码、退出和删除请求。",
    support: "支持",
    supportDetail: "提交请求或查看历史支持消息。",
    appearance: "显示模式",
    appearanceDetail: "选择系统、浅色或深色模式。",
    themeSystem: "跟随系统",
    themeSystemDetail: "跟随此设备设置。",
    themeLight: "浅色模式",
    themeLightDetail: "保持浅色显示。",
    themeDark: "深色模式",
    themeDarkDetail: "保持深色显示。",
    language: "语言",
    languageDetail: "选择此设备使用的应用语言。",
    loginInfo: "登录信息",
    signedInEmail: "登录邮箱",
    passwordChange: "修改密码",
    passwordHint: "请输入至少 6 位的新密码。",
    passwordSuccess: "密码已修改。",
    passwordFailed: (message) => `修改密码失败：${message}`,
    passwordMismatch: "两次输入的密码不一致。",
    deleteAccount: "删除账号",
    deleteRetentionNotice:
      "提交删除请求后，账号数据将保留 30 天，然后永久清理。",
    supportCreate: "提交支持请求",
    supportTitle: "标题",
    supportMessage: "内容",
    supportHistory: "历史支持请求",
    supportHistoryDetail: "查看状态和管理员回复。",
    supportSent: "请求已发送，可在管理后台查看。",
    supportFailed: (message) => `发送失败：${message}`,
    supportHistoryAuthRequired: "请登录后查看历史支持请求。",
    loadingHistory: "正在加载支持历史...",
    noHistory: "暂无历史支持请求。",
    adminReply: "管理员回复",
    categories: {
      inquiry: "咨询",
      bug: "Bug",
      change_request: "修改请求",
      other: "其他",
    },
    statuses: {
      open: "已提交",
      in_progress: "处理中",
      resolved: "已解决",
      closed: "已关闭",
    },
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SettingsTabSection({
  colors,
  styles,
  isAuthenticated,
  currentUserId,
  currentUserEmail,
  appThemeMode,
  onSignOut,
  onWithdrawAccount,
  onRequestAuth,
  onAppThemeModeChange,
}: SettingsTabSectionProps) {
  const { copy, language, options, setLanguage } = useAppI18n();
  const settingsCopy = SETTINGS_COPY[language] ?? SETTINGS_COPY.en;
  const [settingsRoute, setSettingsRoute] = useState<SettingsRoute>("home");
  const [supportCategory, setSupportCategory] = useState<SupportRequestCategory>("inquiry");
  const [supportEmail, setSupportEmail] = useState(currentUserEmail);
  const [supportTitle, setSupportTitle] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState("");
  const [isSupportSubmitting, setIsSupportSubmitting] = useState(false);
  const [supportHistory, setSupportHistory] = useState<SupportRequestRecord[]>([]);
  const [supportHistoryStatus, setSupportHistoryStatus] = useState("");
  const [isSupportHistoryLoading, setIsSupportHistoryLoading] = useState(false);
  const [supportHistoryVersion, setSupportHistoryVersion] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  useEffect(() => {
    if (currentUserEmail && !supportEmail.trim()) {
      setSupportEmail(currentUserEmail);
    }
  }, [currentUserEmail, supportEmail]);

  useEffect(() => {
    if (settingsRoute !== "supportHistory") {
      return;
    }

    if (!isAuthenticated || !currentUserId) {
      setSupportHistory([]);
      setSupportHistoryStatus("");
      return;
    }

    let isMounted = true;
    setIsSupportHistoryLoading(true);
    setSupportHistoryStatus("");

    void fetchMySupportRequestsFromDb(currentUserId)
      .then((requests) => {
        if (isMounted) {
          setSupportHistory(requests);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setSupportHistoryStatus(
            error instanceof Error ? error.message : String(error ?? "Unknown error")
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsSupportHistoryLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUserId, isAuthenticated, settingsRoute, supportHistoryVersion]);

  const normalizedSupportEmail = supportEmail.trim();
  const isSupportEmailValid = EMAIL_PATTERN.test(normalizedSupportEmail);
  const canSubmitSupport = Boolean(
    normalizedSupportEmail &&
      isSupportEmailValid &&
      supportTitle.trim() &&
      supportMessage.trim() &&
      !isSupportSubmitting
  );
  const canChangePassword = Boolean(
    newPassword.length >= 6 &&
      newPassword === newPasswordConfirm &&
      !isPasswordChanging &&
      isAuthenticated
  );
  const selectedLanguageLabel = useMemo(
    () => options.find((option) => option.code === language)?.nativeLabel ?? language,
    [language, options]
  );
  const themeOptions = useMemo(
    () =>
      [
        {
          value: "system" as const,
          icon: "theme-light-dark" as const,
          title: settingsCopy.themeSystem,
          detail: settingsCopy.themeSystemDetail,
        },
        {
          value: "light" as const,
          icon: "white-balance-sunny" as const,
          title: settingsCopy.themeLight,
          detail: settingsCopy.themeLightDetail,
        },
        {
          value: "dark" as const,
          icon: "weather-night" as const,
          title: settingsCopy.themeDark,
          detail: settingsCopy.themeDarkDetail,
        },
      ] satisfies Array<{
        value: AppThemeMode;
        icon: keyof typeof MaterialCommunityIcons.glyphMap;
        title: string;
        detail: string;
      }>,
    [settingsCopy]
  );
  const selectedThemeLabel = useMemo(
    () => themeOptions.find((option) => option.value === appThemeMode)?.title ?? settingsCopy.themeSystem,
    [appThemeMode, settingsCopy.themeSystem, themeOptions]
  );

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
    fontWeight: "800" as const,
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
  const inputStyle = {
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
  const inputLabelStyle = {
    color: colors.subtext,
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  };

  const renderDivider = () => <View style={rowDividerStyle} />;

  const renderRow = ({
    icon,
    title,
    detail,
    onPress,
    danger,
    rightLabel,
  }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    detail?: string;
    onPress?: () => void;
    danger?: boolean;
    rightLabel?: string;
  }) => (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        rowBaseStyle,
        pressed
          ? {
              opacity: 0.86,
            }
          : null,
      ]}
    >
      <View
        style={[
          leadingIconWrapStyle,
          danger
            ? {
                backgroundColor: colors.dangerBg,
              }
            : null,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={danger ? colors.danger : colors.hero}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[rowTitleStyle, danger ? { color: colors.danger } : null]}>{title}</Text>
        {detail ? <Text style={rowDetailStyle}>{detail}</Text> : null}
      </View>
      {rightLabel ? (
        <Text style={[styles.cardBody, { fontWeight: "800" }]}>{rightLabel}</Text>
      ) : null}
      {onPress ? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={danger ? colors.danger : colors.subtext}
        />
      ) : null}
    </Pressable>
  );

  const renderBackIcon = (onPress: () => void) => (
    <Pressable
      accessibilityLabel={copy.common.back}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignSelf: "flex-start",
          width: 38,
          height: 38,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.panel,
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginBottom: 12,
        },
        pressed ? { opacity: 0.8 } : null,
      ]}
    >
      <MaterialCommunityIcons name="arrow-left" size={16} color={colors.text} />
    </Pressable>
  );

  const handleConfirmSignOut = () => {
    Alert.alert(copy.community.confirmSignOut, copy.community.confirmSignOutPrompt, [
      { text: copy.common.cancel, style: "cancel" },
      {
        text: copy.auth.signOut,
        style: "destructive",
        onPress: onSignOut,
      },
    ]);
  };

  const handleSubmitSupportRequest = async () => {
    if (!canSubmitSupport) {
      return;
    }

    setIsSupportSubmitting(true);
    setSupportStatus("");

    try {
      await createSupportRequestInDb({
        category: supportCategory,
        userId: isAuthenticated ? currentUserId : undefined,
        userEmail: normalizedSupportEmail,
        title: supportTitle,
        message: supportMessage,
      });
      setSupportTitle("");
      setSupportMessage("");
      setSupportStatus(settingsCopy.supportSent);
      setSupportHistoryVersion((current) => current + 1);
    } catch (error) {
      setSupportStatus(
        settingsCopy.supportFailed(
          error instanceof Error ? error.message : String(error ?? "Unknown error")
        )
      );
    } finally {
      setIsSupportSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!isAuthenticated || !supabase) {
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus(copy.validation.passwordLength);
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordStatus(settingsCopy.passwordMismatch);
      return;
    }

    setIsPasswordChanging(true);
    setPasswordStatus("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        throw error;
      }
      setNewPassword("");
      setNewPasswordConfirm("");
      setPasswordStatus(settingsCopy.passwordSuccess);
    } catch (error) {
      setPasswordStatus(
        settingsCopy.passwordFailed(
          error instanceof Error ? error.message : String(error ?? "Unknown error")
        )
      );
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const renderThemeSettings = () => (
    <View style={{ marginBottom: 22 }}>
      <Text style={sectionLabelStyle}>{settingsCopy.appearance}</Text>
      <Text style={[styles.cardBody, { marginBottom: 10, marginLeft: 4 }]}>
        {settingsCopy.appearanceDetail}
      </Text>
      <View style={groupedListStyle}>
        {themeOptions.map((option, index) => {
          const isSelected = option.value === appThemeMode;
          return (
            <View key={option.value}>
              <Pressable
                onPress={() => onAppThemeModeChange(option.value)}
                style={({ pressed }) => [
                  rowBaseStyle,
                  isSelected ? { backgroundColor: colors.panelAlt } : null,
                  pressed ? { opacity: 0.88 } : null,
                ]}
              >
                <View style={leadingIconWrapStyle}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={18}
                    color={isSelected ? colors.hero : colors.subtext}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={rowTitleStyle}>{option.title}</Text>
                  <Text style={rowDetailStyle}>{option.detail}</Text>
                </View>
                {isSelected ? (
                  <MaterialCommunityIcons name="check" size={20} color={colors.hero} />
                ) : null}
              </Pressable>
              {index < themeOptions.length - 1 ? renderDivider() : null}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderLanguageSettings = () => (
    <View>
      <Text style={sectionLabelStyle}>{settingsCopy.language}</Text>
      <Text style={[styles.cardBody, { marginBottom: 10, marginLeft: 4 }]}>
        {settingsCopy.languageDetail}
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
                  isSelected ? { backgroundColor: colors.panelAlt } : null,
                  pressed ? { opacity: 0.88 } : null,
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
                ) : null}
              </Pressable>
              {index < options.length - 1 ? renderDivider() : null}
            </View>
          );
        })}
      </View>
    </View>
  );

  if (settingsRoute === "account") {
    return (
      <View>
        {renderBackIcon(() => {
          setSettingsRoute("home");
        })}

        {!isAuthenticated ? (
          <View style={groupedListStyle}>
            {renderRow({
              icon: "account-plus-outline",
              title: copy.auth.signUp,
              detail: copy.community.accountManagementGuest,
              onPress: onRequestAuth,
            })}
          </View>
        ) : (
          <>
            <View style={{ marginBottom: 18 }}>
              <Text style={sectionLabelStyle}>{settingsCopy.loginInfo}</Text>
              <View style={groupedListStyle}>
                {renderRow({
                  icon: "email-outline",
                  title: settingsCopy.signedInEmail,
                  detail: currentUserEmail || copy.common.email,
                })}
              </View>
            </View>

            <View style={{ marginBottom: 18 }}>
              <Text style={sectionLabelStyle}>{settingsCopy.passwordChange}</Text>
              <View style={[groupedListStyle, { padding: 14, gap: 12 }]}>
                <Text style={styles.cardBody}>{settingsCopy.passwordHint}</Text>
                <View>
                  <Text style={inputLabelStyle}>{copy.auth.newPasswordLabel}</Text>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder={copy.auth.passwordPlaceholder}
                    placeholderTextColor={colors.subtext}
                    secureTextEntry
                    autoCapitalize="none"
                    textContentType="newPassword"
                    style={inputStyle}
                  />
                </View>
                <View>
                  <Text style={inputLabelStyle}>{copy.auth.passwordConfirmLabel}</Text>
                  <TextInput
                    value={newPasswordConfirm}
                    onChangeText={setNewPasswordConfirm}
                    placeholder={copy.auth.passwordConfirmPlaceholder}
                    placeholderTextColor={colors.subtext}
                    secureTextEntry
                    autoCapitalize="none"
                    textContentType="newPassword"
                    style={inputStyle}
                  />
                </View>
                {passwordStatus ? (
                  <Text
                    style={[
                      styles.cardBody,
                      {
                        color: passwordStatus === settingsCopy.passwordSuccess ? colors.successText : colors.danger,
                      },
                    ]}
                  >
                    {passwordStatus}
                  </Text>
                ) : null}
                <Pressable
                  disabled={!canChangePassword}
                  onPress={handleChangePassword}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { marginTop: 0, opacity: canChangePassword ? 1 : 0.42 },
                    pressed ? { opacity: 0.78 } : null,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    {isPasswordChanging ? copy.auth.working : copy.auth.changePassword}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text style={sectionLabelStyle}>{copy.common.accountManagement}</Text>
              <View style={groupedListStyle}>
                {renderRow({
                  icon: "logout-variant",
                  title: copy.auth.signOut,
                  detail: copy.common.accountManagement,
                  onPress: handleConfirmSignOut,
                })}
                {renderDivider()}
                {renderRow({
                  icon: "account-remove-outline",
                  title: settingsCopy.deleteAccount,
                  detail: settingsCopy.deleteRetentionNotice,
                  danger: true,
                  onPress: onWithdrawAccount,
                })}
              </View>
            </View>
          </>
        )}
      </View>
    );
  }

  if (settingsRoute === "supportHistory") {
    return (
      <View>
        {renderBackIcon(() => setSettingsRoute("support"))}

        {!isAuthenticated ? (
          <View style={groupedListStyle}>
            {renderRow({
              icon: "account-plus-outline",
              title: copy.auth.signUp,
              detail: settingsCopy.supportHistoryAuthRequired,
              onPress: onRequestAuth,
            })}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {isSupportHistoryLoading ? (
              <View style={styles.card}>
                <Text style={styles.cardBody}>{settingsCopy.loadingHistory}</Text>
              </View>
            ) : null}
            {supportHistoryStatus ? (
              <View style={styles.card}>
                <Text style={[styles.cardBody, { color: colors.danger }]}>
                  {supportHistoryStatus}
                </Text>
              </View>
            ) : null}
            {!isSupportHistoryLoading && !supportHistoryStatus && !supportHistory.length ? (
              <View style={styles.card}>
                <Text style={styles.cardBody}>{settingsCopy.noHistory}</Text>
              </View>
            ) : null}
            {supportHistory.map((request) => (
              <View key={request.id} style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.cardTitle, { flex: 1 }]}>{request.title}</Text>
                  <View style={[styles.postMetaBadge, styles.postMetaBadgeNeutral]}>
                    <Text style={[styles.postMetaBadgeText, styles.postMetaBadgeTextNeutral]}>
                      {settingsCopy.statuses[request.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardBody}>
                  {settingsCopy.categories[request.category]} ·{" "}
                  {formatSettingsDate(request.created_at, copy.meta.locale)}
                </Text>
                <Text style={styles.postNote}>{request.message}</Text>
                {request.admin_note.trim() ? (
                  <View style={styles.postSummaryRow}>
                    <Text style={styles.postSummaryText}>{settingsCopy.adminReply}</Text>
                    <Text style={styles.postNote}>{request.admin_note.trim()}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (settingsRoute === "support") {
    return (
      <View>
        {renderBackIcon(() => setSettingsRoute("home"))}

        <View style={{ marginBottom: 18 }}>
          <Text style={sectionLabelStyle}>{settingsCopy.support}</Text>
          <View style={groupedListStyle}>
            {renderRow({
              icon: "history",
              title: settingsCopy.supportHistory,
              detail: settingsCopy.supportHistoryDetail,
              onPress: () => setSettingsRoute("supportHistory"),
            })}
          </View>
        </View>

        <View>
          <Text style={sectionLabelStyle}>{settingsCopy.supportCreate}</Text>
          <View style={[groupedListStyle, { padding: 14, gap: 12 }]}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
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
                        backgroundColor: isSelected ? colors.panelAlt : colors.panel,
                        paddingHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      },
                      pressed ? { opacity: 0.86 } : null,
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
                      {settingsCopy.categories[option.value]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View>
              <Text style={inputLabelStyle}>{copy.common.email}</Text>
              <TextInput
                value={supportEmail}
                onChangeText={setSupportEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.subtext}
                autoCapitalize="none"
                keyboardType="email-address"
                style={inputStyle}
              />
              {normalizedSupportEmail && !isSupportEmailValid ? (
                <Text style={[styles.authStatusText, styles.authStatusErrorText]}>
                  {copy.validation.validEmail}
                </Text>
              ) : null}
            </View>
            <View>
              <Text style={inputLabelStyle}>{settingsCopy.supportTitle}</Text>
              <TextInput
                value={supportTitle}
                onChangeText={(value) => setSupportTitle(value.slice(0, 120))}
                placeholder={settingsCopy.supportCreate}
                placeholderTextColor={colors.subtext}
                style={inputStyle}
              />
            </View>
            <View>
              <Text style={inputLabelStyle}>{settingsCopy.supportMessage}</Text>
              <TextInput
                value={supportMessage}
                onChangeText={(value) => setSupportMessage(value.slice(0, 2000))}
                placeholder={settingsCopy.supportDetail}
                placeholderTextColor={colors.subtext}
                multiline
                textAlignVertical="top"
                style={[inputStyle, { minHeight: 112, lineHeight: 20 }]}
              />
            </View>
            {supportStatus ? (
              <Text
                style={[
                  styles.cardBody,
                  {
                    color: supportStatus === settingsCopy.supportSent ? colors.successText : colors.danger,
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
                { marginTop: 0, opacity: canSubmitSupport ? 1 : 0.42 },
                pressed ? { opacity: 0.78 } : null,
              ]}
              onPress={handleSubmitSupportRequest}
            >
              <Text style={styles.primaryButtonText}>
                {isSupportSubmitting ? copy.auth.working : settingsCopy.supportCreate}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={{ marginBottom: 22 }}>
        <Text style={sectionLabelStyle}>{copy.common.settings}</Text>
        <View style={groupedListStyle}>
          {renderRow({
            icon: "account-circle-outline",
            title: settingsCopy.account,
            detail: settingsCopy.accountDetail,
            onPress: () => setSettingsRoute("account"),
          })}
          {renderDivider()}
          {renderRow({
            icon: "message-text-outline",
            title: settingsCopy.support,
            detail: settingsCopy.supportDetail,
            onPress: () => setSettingsRoute("support"),
          })}
          {renderDivider()}
          {renderRow({
            icon: "theme-light-dark",
            title: settingsCopy.appearance,
            detail: settingsCopy.appearanceDetail,
            rightLabel: selectedThemeLabel,
          })}
          {renderDivider()}
          {renderRow({
            icon: "translate",
            title: settingsCopy.language,
            detail: settingsCopy.languageDetail,
            rightLabel: selectedLanguageLabel,
          })}
        </View>
      </View>

      {renderThemeSettings()}
      {renderLanguageSettings()}
    </>
  );
}

function formatSettingsDate(value: string, locale: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}
