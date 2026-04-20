import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  type AdminDashboardData,
  type AdminDriverProfileInsert,
  type AdminDriverProfileRecord,
  type AdminRoutePostInsert,
  type AdminRoutePostRecord,
  type AdminSupportRequestRecord,
  type AdminSupportRequestUpdate,
  claimInitialAdminAccountInDb,
  deleteAdminAccountInDb,
  deleteAdminDriverProfileInDb,
  deleteAdminRoutePostInDb,
  deleteAdminSupportRequestInDb,
  fetchAdminDashboardData,
  isCurrentUserAdminInDb,
  updateAdminDriverProfileInDb,
  updateAdminRoutePostInDb,
  updateAdminSupportRequestInDb,
  updateAdminAccountInDb,
  upsertAdminDriverProfileInDb,
  upsertAdminRoutePostInDb,
  upsertAdminAccountInDb,
} from "../../features/admin/data/adminRepository";
import type { RoadmateAppState } from "../useRoadmateAppState";

type AppAdminOperationsScreenProps = {
  appState: RoadmateAppState;
  isSupabaseReady: boolean;
};

type RouteStatusFilter = "all" | "active" | "inactive" | "private";
type AdminSection = "overview" | "routes" | "notices" | "drivers" | "support" | "access";
type SupportStatusFilter = "all" | AdminSupportRequestRecord["status"];

const ADMIN_SECTIONS: Array<{ value: AdminSection; label: string; description: string }> = [
  { value: "overview", label: "OVERVIEW", description: "System snapshot" },
  { value: "routes", label: "REGULAR", description: "Regular routes" },
  { value: "notices", label: "ONE-TIME", description: "One-time notices" },
  { value: "drivers", label: "DRIVERS", description: "Driver profiles" },
  { value: "support", label: "SUPPORT", description: "User requests" },
  { value: "access", label: "ACCESS", description: "Admin accounts" },
];

const monoFont = Platform.select({
  web: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  default: undefined,
});

const toDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error ?? "Unknown error");

const confirmDestructive = (title: string, body: string, onConfirm: () => void) => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (window.confirm(`${title}\n\n${body}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, body, [
    { text: "Cancel", style: "cancel" },
    { text: "Confirm", style: "destructive", onPress: onConfirm },
  ]);
};

type AdminRouteDraft = {
  id: string;
  kind: "regular" | "one_time";
  owner_user_id: string;
  owner_name: string;
  from_location: string;
  to_location: string;
  schedule: string;
  return_schedule: string;
  notice_date: string;
  return_date: string;
  available_seats: string;
  operating_days: string;
  contact_phone: string;
  contact_link: string;
  note: string;
  vehicle_model: string;
  vehicle_plate: string;
  is_public: boolean;
  is_active: boolean;
};

type AdminDriverProfileDraft = {
  owner_user_id: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_note: string;
  contact_phone: string;
  contact_link: string;
};

const ADMIN_DEFAULT_DAYS = "Mon,Tue,Wed,Thu,Fri";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const toAdminRouteDraft = (kind: "regular" | "one_time", route?: AdminRoutePostRecord): AdminRouteDraft => ({
  id: route?.id ?? "",
  kind,
  owner_user_id: route?.owner_user_id ?? "",
  owner_name: route?.owner_name ?? "Community driver",
  from_location: route?.from_location ?? "",
  to_location: route?.to_location ?? "",
  schedule: route?.schedule ?? "08:00",
  return_schedule: route?.return_schedule ?? "",
  notice_date: route?.notice_date ?? (kind === "one_time" ? getTodayDate() : ""),
  return_date: route?.return_date ?? "",
  available_seats: String(route?.available_seats ?? 1),
  operating_days: route?.operating_days?.join(",") ?? (kind === "regular" ? ADMIN_DEFAULT_DAYS : ""),
  contact_phone: route?.contact_phone ?? "",
  contact_link: route?.contact_link ?? "",
  note: route?.note ?? "",
  vehicle_model: route?.vehicle_model ?? "",
  vehicle_plate: route?.vehicle_plate ?? "",
  is_public: route?.is_public ?? true,
  is_active: kind === "regular" ? true : route?.is_active ?? true,
});

const toAdminDriverProfileDraft = (profile?: AdminDriverProfileRecord): AdminDriverProfileDraft => ({
  owner_user_id: profile?.owner_user_id ?? "",
  vehicle_model: profile?.vehicle_model ?? "",
  vehicle_plate: profile?.vehicle_plate ?? "",
  vehicle_note: profile?.vehicle_note ?? "",
  contact_phone: profile?.contact_phone ?? "",
  contact_link: profile?.contact_link ?? "",
});

const splitAdminDays = (value: string) =>
  value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean)
    .slice(0, 7);

const requireAdminValue = (value: string, label: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return trimmed;
};

const normalizeAdminSeats = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(parsed, 1), 8);
};

const toAdminRouteRecord = (draft: AdminRouteDraft): AdminRoutePostInsert => {
  const ownerUserId = requireAdminValue(draft.owner_user_id, "Owner user id");
  const fromLocation = requireAdminValue(draft.from_location, "From location");
  const toLocation = requireAdminValue(draft.to_location, "To location");
  const schedule = requireAdminValue(draft.schedule, "Schedule");
  const vehicleModel = requireAdminValue(draft.vehicle_model, "Vehicle model");
  const vehiclePlate = requireAdminValue(draft.vehicle_plate, "Vehicle plate");
  const operatingDays = draft.kind === "regular" ? splitAdminDays(draft.operating_days) : [];
  const contactPhone = draft.contact_phone.trim();
  const contactLink = draft.contact_link.trim();

  if (draft.kind === "regular" && operatingDays.length === 0) {
    throw new Error("Regular routes require at least one operating day.");
  }

  if (draft.kind === "regular" && !contactPhone && !contactLink) {
    throw new Error("Regular routes require phone or chat link.");
  }

  const noticeDate =
    draft.kind === "one_time" ? requireAdminValue(draft.notice_date, "Notice date") : null;
  const returnSchedule = draft.return_schedule.trim() || null;
  const returnDate =
    draft.kind === "one_time" && returnSchedule ? draft.return_date.trim() || noticeDate : null;
  const id =
    draft.id.trim() ||
    (draft.kind === "regular"
      ? `${ownerUserId}:regular`
      : `${ownerUserId}:one_time:${Date.now()}`);

  return {
    id,
    kind: draft.kind,
    owner_user_id: ownerUserId,
    owner_name: draft.owner_name.trim() || "Community driver",
    from_location: fromLocation,
    to_location: toLocation,
    schedule,
    return_schedule: returnSchedule,
    notice_date: draft.kind === "one_time" ? noticeDate : null,
    return_date: returnDate,
    available_seats: normalizeAdminSeats(draft.available_seats),
    operating_days: operatingDays,
    contact_phone: contactPhone || null,
    contact_link: contactLink || null,
    note: draft.note.trim().slice(0, 500),
    vehicle_model: vehicleModel,
    vehicle_plate: vehiclePlate,
    is_public: draft.is_public,
    is_active: draft.kind === "regular" ? true : draft.is_active,
  };
};

const toAdminDriverProfileRecord = (draft: AdminDriverProfileDraft): AdminDriverProfileInsert => ({
  owner_user_id: requireAdminValue(draft.owner_user_id, "Owner user id"),
  vehicle_model: requireAdminValue(draft.vehicle_model, "Vehicle model"),
  vehicle_plate: requireAdminValue(draft.vehicle_plate, "Vehicle plate"),
  vehicle_note: draft.vehicle_note.trim(),
  contact_phone: draft.contact_phone.trim() || null,
  contact_link: draft.contact_link.trim() || null,
});

const adminSearchIncludes = (query: string, values: Array<string | number | null | undefined>) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return values.join(" ").toLowerCase().includes(normalizedQuery);
};

export function AppAdminOperationsScreen({
  appState,
  isSupabaseReady,
}: AppAdminOperationsScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    routes: [],
    driverProfiles: [],
    adminAccounts: [],
    supportRequests: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [routeStatusFilter, setRouteStatusFilter] = useState<RouteStatusFilter>("all");
  const [routeQuery, setRouteQuery] = useState("");
  const [noticeQuery, setNoticeQuery] = useState("");
  const [driverQuery, setDriverQuery] = useState("");
  const [supportQuery, setSupportQuery] = useState("");
  const [supportStatusFilter, setSupportStatusFilter] = useState<SupportStatusFilter>("all");
  const [adminQuery, setAdminQuery] = useState("");
  const [pendingKey, setPendingKey] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminDisplayName, setNewAdminDisplayName] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [regularRouteDraft, setRegularRouteDraft] = useState<AdminRouteDraft>(() =>
    toAdminRouteDraft("regular")
  );
  const [noticeRouteDraft, setNoticeRouteDraft] = useState<AdminRouteDraft>(() =>
    toAdminRouteDraft("one_time")
  );
  const [driverProfileDraft, setDriverProfileDraft] = useState<AdminDriverProfileDraft>(() =>
    toAdminDriverProfileDraft()
  );
  const currentAdminEmail = appState.currentUserEmail.trim().toLowerCase();
  const isWideAdminLayout = width >= 900;

  const refreshDashboard = async () => {
    setIsLoading(true);
    setErrorText("");
    try {
      const nextIsAdmin = await isCurrentUserAdminInDb();
      setIsAdmin(nextIsAdmin);
      if (nextIsAdmin) {
        setDashboardData(await fetchAdminDashboardData());
      }
    } catch (error) {
      setErrorText(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!appState.currentUserId) {
      appState.setAuthMode("signIn");
      appState.setAuthEntryMethod("email");
      setIsAdmin(null);
      return;
    }

    void refreshDashboard();
  }, [appState.currentUserId]);

  const runAdminAction = async (key: string, action: () => Promise<void>) => {
    setPendingKey(key);
    setErrorText("");
    try {
      await action();
      await refreshDashboard();
    } catch (error) {
      setErrorText(toErrorMessage(error));
    } finally {
      setPendingKey("");
    }
  };

  const filteredRegularRoutes = useMemo(() => {
    return dashboardData.routes.filter((route) => {
      if (route.kind !== "regular") {
        return false;
      }
      if (routeStatusFilter === "active" && !route.is_active) {
        return false;
      }
      if (routeStatusFilter === "inactive" && route.is_active) {
        return false;
      }
      if (routeStatusFilter === "private" && route.is_public) {
        return false;
      }

      return adminSearchIncludes(routeQuery, [
        route.id,
        route.owner_user_id,
        route.owner_name,
        route.from_location,
        route.to_location,
        route.vehicle_model,
        route.vehicle_plate,
        route.note,
      ]);
    });
  }, [dashboardData.routes, routeQuery, routeStatusFilter]);

  const filteredNoticeRoutes = useMemo(
    () =>
      dashboardData.routes.filter(
        (route) =>
          route.kind === "one_time" &&
          adminSearchIncludes(noticeQuery, [
            route.id,
            route.owner_user_id,
            route.owner_name,
            route.from_location,
            route.to_location,
            route.vehicle_model,
            route.vehicle_plate,
            route.notice_date,
            route.return_date,
            route.note,
          ])
      ),
    [dashboardData.routes, noticeQuery]
  );

  const filteredDriverProfiles = useMemo(
    () =>
      dashboardData.driverProfiles.filter((profile) =>
        adminSearchIncludes(driverQuery, [
          profile.owner_user_id,
          profile.vehicle_model,
          profile.vehicle_plate,
          profile.vehicle_note,
          profile.contact_phone,
          profile.contact_link,
        ])
      ),
    [dashboardData.driverProfiles, driverQuery]
  );

  const filteredAdminAccounts = useMemo(
    () =>
      dashboardData.adminAccounts.filter((account) =>
        adminSearchIncludes(adminQuery, [
          account.email,
          account.display_name,
          account.role,
          account.enabled ? "enabled" : "disabled",
        ])
      ),
    [adminQuery, dashboardData.adminAccounts]
  );

  const filteredSupportRequests = useMemo(
    () =>
      dashboardData.supportRequests.filter((request) => {
        if (supportStatusFilter !== "all" && request.status !== supportStatusFilter) {
          return false;
        }

        return adminSearchIncludes(supportQuery, [
          request.id,
          request.category,
          request.status,
          request.user_email,
          request.user_id,
          request.title,
          request.message,
          request.admin_note,
        ]);
      }),
    [dashboardData.supportRequests, supportQuery, supportStatusFilter]
  );

  const stats = useMemo(() => {
    const routes = dashboardData.routes;
    return {
      routes: routes.length,
      activeOneTime: routes.filter((route) => route.kind === "one_time" && route.is_active).length,
      privateRoutes: routes.filter((route) => !route.is_public).length,
      profiles: dashboardData.driverProfiles.length,
      supportOpen: dashboardData.supportRequests.filter((request) => request.status === "open").length,
    };
  }, [dashboardData]);

  if (!isSupabaseReady) {
    return (
      <AdminShell topInset={insets.top}>
        <SystemPanel label="CONFIG" title="SUPABASE NOT CONFIGURED">
          <Text style={adminStyles.bodyText}>Set Supabase URL and anon key before using operations.</Text>
        </SystemPanel>
      </AdminShell>
    );
  }

  if (appState.loading) {
    return (
      <AdminShell topInset={insets.top}>
        <SystemPanel label="SESSION" title="BOOTSTRAP">
          <Text style={adminStyles.bodyText}>Loading session state.</Text>
        </SystemPanel>
      </AdminShell>
    );
  }

  if (!appState.currentUserId) {
    return (
      <AdminShell topInset={insets.top}>
        <SystemPanel label="AUTH" title="OPERATOR SIGN IN">
          <View style={adminStyles.loginGrid}>
            <AdminTextInput
              label="EMAIL"
              value={appState.authEmail}
              onChangeText={appState.setAuthEmail}
              placeholder="operator@example.com"
              autoCapitalize="none"
            />
            <AdminTextInput
              label="PASSWORD"
              value={appState.authPassword}
              onChangeText={appState.setAuthPassword}
              placeholder="password"
              secureTextEntry
            />
            {appState.pendingVerificationEmail ? (
              <View style={adminStyles.authNotice}>
                <Text style={adminStyles.authNoticeLabel}>VERIFY EMAIL</Text>
                <Text style={adminStyles.authNoticeText}>{appState.pendingVerificationEmail}</Text>
                <AdminButton
                  label={appState.isResendingVerification ? "SENDING" : "RESEND"}
                  disabled={appState.isResendingVerification}
                  onPress={appState.handleResendVerificationEmail}
                  variant="ghost"
                />
              </View>
            ) : null}
            <AdminButton
              label={appState.isAuthSubmitting ? "PROCESSING" : "SIGN IN"}
              onPress={appState.handleSubmitAuth}
              disabled={appState.isAuthSubmitting}
            />
            <Text style={adminStyles.authPolicyText}>
              ADMIN AUTH ACCOUNTS ARE CREATED OUTSIDE THIS CONSOLE. SIGN IN WITH AN EXISTING VERIFIED
              ACCOUNT, THEN CLAIM THE INITIAL OWNER ONLY ON A FRESH DATABASE.
            </Text>
          </View>
        </SystemPanel>
      </AdminShell>
    );
  }

  if (isAdmin === false) {
    return (
      <AdminShell topInset={insets.top} currentEmail={currentAdminEmail} onSignOut={appState.handleSignOut}>
        <SystemPanel label="ACCESS" title="ADMIN POLICY DENIED">
          <Text style={adminStyles.bodyText}>
            This account is authenticated but not enabled in `public.admin_accounts`.
          </Text>
          <Text style={adminStyles.bodyText}>
            If this is a fresh database with no admin accounts yet, claim this authenticated email as the
            initial owner.
          </Text>
          {errorText ? (
            <View style={adminStyles.errorPanel}>
              <Text style={adminStyles.errorLabel}>ERROR</Text>
              <Text style={adminStyles.errorText}>{errorText}</Text>
            </View>
          ) : null}
          <AdminButton
            label={pendingKey === "admin:claim-initial" ? "CLAIMING" : "CLAIM INITIAL OWNER"}
            disabled={pendingKey === "admin:claim-initial"}
            onPress={() =>
              void runAdminAction("admin:claim-initial", async () => {
                await claimInitialAdminAccountInDb();
              })
            }
          />
        </SystemPanel>
      </AdminShell>
    );
  }

  return (
    <AdminShell topInset={insets.top} currentEmail={currentAdminEmail} onSignOut={appState.handleSignOut}>
      {errorText ? (
        <View style={adminStyles.errorPanel}>
          <Text style={adminStyles.errorLabel}>ERROR</Text>
          <Text style={adminStyles.errorText}>{errorText}</Text>
        </View>
      ) : null}

      <View style={[adminStyles.workspace, isWideAdminLayout ? adminStyles.workspaceWide : null]}>
        <AdminSectionMenu
          activeSection={activeSection}
          isWideLayout={isWideAdminLayout}
          onChange={setActiveSection}
        />

        <View style={adminStyles.workspaceContent}>
          {activeSection === "overview" ? (
            <SystemPanel
              label="OVERVIEW"
              title="OPERATIONS SNAPSHOT"
              action={<AdminButton label={isLoading ? "SYNCING" : "REFRESH"} onPress={() => void refreshDashboard()} />}
            >
              <View style={adminStyles.statsGrid}>
                <StatCard label="ROUTES" value={String(stats.routes)} />
                <StatCard label="ACTIVE NOTICES" value={String(stats.activeOneTime)} />
                <StatCard label="PRIVATE ROUTES" value={String(stats.privateRoutes)} />
                <StatCard label="DRIVER PROFILES" value={String(stats.profiles)} />
                <StatCard label="OPEN SUPPORT" value={String(stats.supportOpen)} />
              </View>
              <View style={adminStyles.overviewGrid}>
                <OverviewSignal label="ADMIN ACCOUNTS" value={String(dashboardData.adminAccounts.length)} />
                <OverviewSignal label="VISIBLE ROUTES" value={String(stats.routes - stats.privateRoutes)} />
                <OverviewSignal label="REGULAR ROUTES" value={String(filteredRegularRoutes.length)} />
                <OverviewSignal label="ONE-TIME NOTICES" value={String(filteredNoticeRoutes.length)} />
                <OverviewSignal label="SUPPORT REQUESTS" value={String(dashboardData.supportRequests.length)} />
              </View>
            </SystemPanel>
          ) : null}

          {activeSection === "routes" ? (
            <SystemPanel
              label="REGULAR"
              title="REGULAR ROUTE CRUD"
              action={<AdminButton label={isLoading ? "SYNCING" : "REFRESH"} onPress={() => void refreshDashboard()} />}
            >
              <AdminRouteEditor
                draft={regularRouteDraft}
                onChange={setRegularRouteDraft}
                onReset={() => setRegularRouteDraft(toAdminRouteDraft("regular"))}
                onSubmit={() =>
                  void runAdminAction("route:save-regular", async () => {
                    await upsertAdminRoutePostInDb(toAdminRouteRecord(regularRouteDraft));
                    setRegularRouteDraft(toAdminRouteDraft("regular"));
                  })
                }
              />

              <View style={adminStyles.filterGrid}>
                <AdminTextInput
                  label="QUERY"
                  value={routeQuery}
                  onChangeText={setRouteQuery}
                  placeholder="route, owner, vehicle"
                />
                <ChipGroup
                  label="STATE"
                  value={routeStatusFilter}
                  options={[
                    ["all", "ALL"],
                    ["active", "ACTIVE"],
                    ["inactive", "INACTIVE"],
                    ["private", "PRIVATE"],
                  ]}
                  onChange={(value) => setRouteStatusFilter(value as RouteStatusFilter)}
                />
              </View>

              <View style={adminStyles.recordsStack}>
                {filteredRegularRoutes.map((route) => (
                  <RouteRecordCard
                    key={route.id}
                    route={route}
                    pendingKey={pendingKey}
                    onEdit={() => setRegularRouteDraft(toAdminRouteDraft("regular", route))}
                    onPatch={(patch) =>
                      runAdminAction(`route:${route.id}`, async () => {
                        await updateAdminRoutePostInDb(route.id, patch);
                      })
                    }
                    onDelete={() =>
                      confirmDestructive("DELETE ROUTE", route.id, () => {
                        void runAdminAction(`delete-route:${route.id}`, async () => {
                          await deleteAdminRoutePostInDb(route.id);
                        });
                      })
                    }
                  />
                ))}
                {filteredRegularRoutes.length === 0 ? (
                  <Text style={adminStyles.emptyText}>NO REGULAR ROUTES MATCH FILTER</Text>
                ) : null}
              </View>
            </SystemPanel>
          ) : null}

          {activeSection === "notices" ? (
            <SystemPanel
              label="ONE-TIME"
              title="ONE_TIME NOTICE CRUD"
              action={<AdminButton label={isLoading ? "SYNCING" : "REFRESH"} onPress={() => void refreshDashboard()} />}
            >
              <AdminRouteEditor
                draft={noticeRouteDraft}
                onChange={setNoticeRouteDraft}
                onReset={() => setNoticeRouteDraft(toAdminRouteDraft("one_time"))}
                onSubmit={() =>
                  void runAdminAction("route:save-notice", async () => {
                    await upsertAdminRoutePostInDb(toAdminRouteRecord(noticeRouteDraft));
                    setNoticeRouteDraft(toAdminRouteDraft("one_time"));
                  })
                }
              />

              <View style={adminStyles.filterGrid}>
                <AdminTextInput
                  label="QUERY"
                  value={noticeQuery}
                  onChangeText={setNoticeQuery}
                  placeholder="notice, date, owner, vehicle"
                />
              </View>

              <View style={adminStyles.recordsStack}>
                {filteredNoticeRoutes.map((route) => (
                  <RouteRecordCard
                    key={route.id}
                    route={route}
                    pendingKey={pendingKey}
                    onEdit={() => setNoticeRouteDraft(toAdminRouteDraft("one_time", route))}
                    onPatch={(patch) =>
                      runAdminAction(`route:${route.id}`, async () => {
                        await updateAdminRoutePostInDb(route.id, patch);
                      })
                    }
                    onDelete={() =>
                      confirmDestructive("DELETE ONE-TIME NOTICE", route.id, () => {
                        void runAdminAction(`delete-route:${route.id}`, async () => {
                          await deleteAdminRoutePostInDb(route.id);
                        });
                      })
                    }
                  />
                ))}
                {filteredNoticeRoutes.length === 0 ? (
                  <Text style={adminStyles.emptyText}>NO ONE-TIME NOTICES MATCH FILTER</Text>
                ) : null}
              </View>
            </SystemPanel>
          ) : null}

          {activeSection === "drivers" ? (
            <SystemPanel label="DRIVERS" title="DRIVER_PROFILES CRUD">
              <AdminDriverProfileEditor
                draft={driverProfileDraft}
                onChange={setDriverProfileDraft}
                onReset={() => setDriverProfileDraft(toAdminDriverProfileDraft())}
                onSubmit={() =>
                  void runAdminAction("driver-profile:save", async () => {
                    await upsertAdminDriverProfileInDb(toAdminDriverProfileRecord(driverProfileDraft));
                    setDriverProfileDraft(toAdminDriverProfileDraft());
                  })
                }
              />

              <View style={adminStyles.filterGrid}>
                <AdminTextInput
                  label="QUERY"
                  value={driverQuery}
                  onChangeText={setDriverQuery}
                  placeholder="owner, vehicle, contact"
                />
              </View>

              <View style={adminStyles.recordsStack}>
                {filteredDriverProfiles.map((profile) => (
                  <DriverProfileCard
                    key={profile.owner_user_id}
                    profile={profile}
                    pendingKey={pendingKey}
                    onEdit={() => setDriverProfileDraft(toAdminDriverProfileDraft(profile))}
                    onPatch={(patch) =>
                      runAdminAction(`profile:${profile.owner_user_id}`, async () => {
                        await updateAdminDriverProfileInDb(profile.owner_user_id, patch);
                      })
                    }
                    onDelete={() =>
                      confirmDestructive("DELETE DRIVER PROFILE", profile.owner_user_id, () => {
                        void runAdminAction(`delete-profile:${profile.owner_user_id}`, async () => {
                          await deleteAdminDriverProfileInDb(profile.owner_user_id);
                        });
                      })
                    }
                  />
                ))}
                {filteredDriverProfiles.length === 0 ? (
                  <Text style={adminStyles.emptyText}>NO DRIVER PROFILES</Text>
                ) : null}
              </View>
            </SystemPanel>
          ) : null}

          {activeSection === "support" ? (
            <SystemPanel
              label="SUPPORT"
              title="SUPPORT_REQUESTS CONTROL"
              action={<AdminButton label={isLoading ? "SYNCING" : "REFRESH"} onPress={() => void refreshDashboard()} />}
            >
              <View style={adminStyles.filterGrid}>
                <AdminTextInput
                  label="QUERY"
                  value={supportQuery}
                  onChangeText={setSupportQuery}
                  placeholder="email, title, message, note"
                />
                <ChipGroup
                  label="STATUS"
                  value={supportStatusFilter}
                  options={[
                    ["all", "ALL"],
                    ["open", "OPEN"],
                    ["in_progress", "IN PROGRESS"],
                    ["resolved", "RESOLVED"],
                    ["closed", "CLOSED"],
                  ]}
                  onChange={(value) => setSupportStatusFilter(value as SupportStatusFilter)}
                />
              </View>

              <View style={adminStyles.recordsStack}>
                {filteredSupportRequests.map((request) => (
                  <SupportRequestCard
                    key={request.id}
                    request={request}
                    pendingKey={pendingKey}
                    onPatch={(patch) =>
                      runAdminAction(`support:${request.id}`, async () => {
                        await updateAdminSupportRequestInDb(request.id, patch);
                      })
                    }
                    onDelete={() =>
                      confirmDestructive("DELETE SUPPORT REQUEST", request.title, () => {
                        void runAdminAction(`delete-support:${request.id}`, async () => {
                          await deleteAdminSupportRequestInDb(request.id);
                        });
                      })
                    }
                  />
                ))}
                {filteredSupportRequests.length === 0 ? (
                  <Text style={adminStyles.emptyText}>NO SUPPORT REQUESTS MATCH FILTER</Text>
                ) : null}
              </View>
            </SystemPanel>
          ) : null}

          {activeSection === "access" ? (
            <SystemPanel label="ACCESS" title="ADMIN_ACCOUNTS CRUD">
              <View style={adminStyles.addAdminRow}>
                <View style={{ flex: 1 }}>
                  <AdminTextInput
                    label="ADD EMAIL"
                    value={newAdminEmail}
                    onChangeText={setNewAdminEmail}
                    placeholder="admin@example.com"
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AdminTextInput
                    label="DISPLAY NAME"
                    value={newAdminDisplayName}
                    onChangeText={setNewAdminDisplayName}
                    placeholder="Operations"
                  />
                </View>
                <AdminButton
                  label="ADD"
                  onPress={() =>
                    void runAdminAction("admin:add", async () => {
                      await upsertAdminAccountInDb(newAdminEmail, true, "operator", newAdminDisplayName);
                      setNewAdminEmail("");
                      setNewAdminDisplayName("");
                    })
                  }
                  disabled={!newAdminEmail.trim()}
                />
              </View>

              <View style={adminStyles.filterGrid}>
                <AdminTextInput
                  label="QUERY"
                  value={adminQuery}
                  onChangeText={setAdminQuery}
                  placeholder="email, name, role, status"
                />
              </View>

              <View style={adminStyles.recordsStack}>
                {filteredAdminAccounts.map((adminAccount) => {
                  const isSelf = adminAccount.email.toLowerCase() === currentAdminEmail;
                  return (
                    <View key={adminAccount.email} style={adminStyles.adminAccountRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={adminStyles.recordTitle}>{adminAccount.email}</Text>
                        <Text style={adminStyles.recordMeta}>
                          {adminAccount.display_name ? `${adminAccount.display_name} / ` : ""}
                          {adminAccount.role.toUpperCase()} / {adminAccount.enabled ? "ENABLED" : "DISABLED"} /
                          {" "}{toDateTime(adminAccount.updated_at)}
                        </Text>
                      </View>
                      <AdminButton
                        label={adminAccount.role === "owner" ? "MAKE OPERATOR" : "MAKE OWNER"}
                        disabled={isSelf || pendingKey === `admin-role:${adminAccount.email}`}
                        variant="ghost"
                        onPress={() =>
                          void runAdminAction(`admin-role:${adminAccount.email}`, async () => {
                            await updateAdminAccountInDb(adminAccount.email, {
                              role: adminAccount.role === "owner" ? "operator" : "owner",
                            });
                          })
                        }
                      />
                      <AdminButton
                        label={adminAccount.enabled ? "DISABLE" : "ENABLE"}
                        disabled={isSelf || pendingKey === `admin:${adminAccount.email}`}
                        variant={adminAccount.enabled ? "danger" : "default"}
                        onPress={() =>
                          void runAdminAction(`admin:${adminAccount.email}`, async () => {
                          await updateAdminAccountInDb(adminAccount.email, { enabled: !adminAccount.enabled });
                        })
                      }
                    />
                    <AdminButton
                      label="DELETE"
                      disabled={isSelf || pendingKey === `admin-delete:${adminAccount.email}`}
                      variant="danger"
                      onPress={() =>
                        confirmDestructive("DELETE ADMIN ACCOUNT", adminAccount.email, () => {
                          void runAdminAction(`admin-delete:${adminAccount.email}`, async () => {
                            await deleteAdminAccountInDb(adminAccount.email);
                          });
                        })
                      }
                    />
                    </View>
                  );
                })}
                {filteredAdminAccounts.length === 0 ? (
                  <Text style={adminStyles.emptyText}>NO ADMIN ACCOUNTS MATCH FILTER</Text>
                ) : null}
              </View>
            </SystemPanel>
          ) : null}
        </View>
      </View>
    </AdminShell>
  );
}

function AdminShell({
  topInset,
  currentEmail,
  onSignOut,
  children,
}: {
  topInset: number;
  currentEmail?: string;
  onSignOut?: () => void;
  children: ReactNode;
}) {
  return (
    <View style={adminStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#05070A" translucent={false} />
      <View style={[adminStyles.header, { paddingTop: topInset + 14 }]}>
        <View>
          <Text style={adminStyles.kicker}>ROADMATE OPS</Text>
          <Text style={adminStyles.headerTitle}>CONTROL PLANE</Text>
        </View>
        <View style={adminStyles.headerRight}>
          {currentEmail ? <Text style={adminStyles.operatorText}>{currentEmail}</Text> : null}
          {onSignOut ? <AdminButton label="SIGN OUT" onPress={onSignOut} variant="ghost" /> : null}
        </View>
      </View>
      <ScrollView style={adminStyles.scroll} contentContainerStyle={adminStyles.content}>
        {children}
      </ScrollView>
    </View>
  );
}

function SystemPanel({
  label,
  title,
  action,
  children,
}: {
  label: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={adminStyles.panel}>
      <View style={adminStyles.panelHeader}>
        <View>
          <Text style={adminStyles.kicker}>{label}</Text>
          <Text style={adminStyles.panelTitle}>{title}</Text>
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={adminStyles.statCard}>
      <Text style={adminStyles.statLabel}>{label}</Text>
      <Text style={adminStyles.statValue}>{value}</Text>
    </View>
  );
}

function AdminSectionMenu({
  activeSection,
  isWideLayout,
  onChange,
}: {
  activeSection: AdminSection;
  isWideLayout: boolean;
  onChange: (section: AdminSection) => void;
}) {
  return (
    <View style={[adminStyles.menuRail, isWideLayout ? adminStyles.menuRailWide : null]}>
      <Text style={adminStyles.menuRailLabel}>MENU</Text>
      <View style={[adminStyles.menuItems, isWideLayout ? adminStyles.menuItemsWide : null]}>
        {ADMIN_SECTIONS.map((section) => {
          const isActive = activeSection === section.value;
          return (
            <Pressable
              key={section.value}
              onPress={() => onChange(section.value)}
              style={({ pressed }) => [
                adminStyles.menuItem,
                isActive ? adminStyles.menuItemActive : null,
                pressed ? adminStyles.menuItemPressed : null,
              ]}
            >
              <Text style={[adminStyles.menuItemLabel, isActive ? adminStyles.menuItemLabelActive : null]}>
                {section.label}
              </Text>
              <Text style={[adminStyles.menuItemDescription, isActive ? adminStyles.menuItemDescriptionActive : null]}>
                {section.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function OverviewSignal({ label, value }: { label: string; value: string }) {
  return (
    <View style={adminStyles.overviewSignal}>
      <Text style={adminStyles.overviewSignalLabel}>{label}</Text>
      <Text style={adminStyles.overviewSignalValue}>{value}</Text>
    </View>
  );
}

function AdminRouteEditor({
  draft,
  onChange,
  onReset,
  onSubmit,
}: {
  draft: AdminRouteDraft;
  onChange: (draft: AdminRouteDraft) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  const updateDraft = <Key extends keyof AdminRouteDraft>(key: Key, value: AdminRouteDraft[Key]) => {
    onChange({ ...draft, [key]: value });
  };

  return (
    <View style={adminStyles.editorPanel}>
      <View style={adminStyles.editorHeader}>
        <View>
          <Text style={adminStyles.inputLabel}>
            {draft.id ? "EDIT ROUTE_POST" : "CREATE ROUTE_POST"}
          </Text>
          <Text style={adminStyles.recordMeta}>
            {draft.kind === "one_time" ? "ONE_TIME NOTICE" : "REGULAR ROUTE"}
          </Text>
        </View>
        <View style={adminStyles.actionRow}>
          <AdminButton label="RESET" variant="ghost" onPress={onReset} />
          <AdminButton label="SAVE" onPress={onSubmit} />
        </View>
      </View>

      <View style={adminStyles.formGrid}>
        <AdminTextInput label="ID" value={draft.id} onChangeText={(value) => updateDraft("id", value)} placeholder="auto if empty" />
        <AdminTextInput label="OWNER USER ID" value={draft.owner_user_id} onChangeText={(value) => updateDraft("owner_user_id", value)} placeholder="auth.users id" />
        <AdminTextInput label="OWNER NAME" value={draft.owner_name} onChangeText={(value) => updateDraft("owner_name", value)} />
        <AdminTextInput label="FROM" value={draft.from_location} onChangeText={(value) => updateDraft("from_location", value)} />
        <AdminTextInput label="TO" value={draft.to_location} onChangeText={(value) => updateDraft("to_location", value)} />
        <AdminTextInput label="SCHEDULE" value={draft.schedule} onChangeText={(value) => updateDraft("schedule", value)} placeholder="08:00" />
        <AdminTextInput label="RETURN SCHEDULE" value={draft.return_schedule} onChangeText={(value) => updateDraft("return_schedule", value)} placeholder="18:00" />
        {draft.kind === "one_time" ? (
          <>
            <AdminTextInput label="NOTICE DATE" value={draft.notice_date} onChangeText={(value) => updateDraft("notice_date", value)} placeholder="YYYY-MM-DD" />
            <AdminTextInput label="RETURN DATE" value={draft.return_date} onChangeText={(value) => updateDraft("return_date", value)} placeholder="YYYY-MM-DD" />
          </>
        ) : (
          <AdminTextInput label="OPERATING DAYS" value={draft.operating_days} onChangeText={(value) => updateDraft("operating_days", value)} placeholder="Mon,Tue,Wed" />
        )}
        <AdminTextInput label="SEATS" value={draft.available_seats} onChangeText={(value) => updateDraft("available_seats", value)} />
        <AdminTextInput label="PHONE" value={draft.contact_phone} onChangeText={(value) => updateDraft("contact_phone", value)} />
        <AdminTextInput label="CHAT LINK" value={draft.contact_link} onChangeText={(value) => updateDraft("contact_link", value)} />
        <AdminTextInput label="VEHICLE MODEL" value={draft.vehicle_model} onChangeText={(value) => updateDraft("vehicle_model", value)} />
        <AdminTextInput label="VEHICLE PLATE" value={draft.vehicle_plate} onChangeText={(value) => updateDraft("vehicle_plate", value)} />
        <AdminTextInput label="NOTE" value={draft.note} onChangeText={(value) => updateDraft("note", value.slice(0, 500))} placeholder="max 500 chars" />
      </View>

      <View style={adminStyles.actionRow}>
        <AdminButton
          label={draft.is_public ? "PUBLIC" : "PRIVATE"}
          variant={draft.is_public ? "default" : "ghost"}
          onPress={() => updateDraft("is_public", !draft.is_public)}
        />
        {draft.kind === "one_time" ? (
          <AdminButton
            label={draft.is_active ? "ACTIVE" : "INACTIVE"}
            variant={draft.is_active ? "default" : "ghost"}
            onPress={() => updateDraft("is_active", !draft.is_active)}
          />
        ) : null}
      </View>
    </View>
  );
}

function AdminDriverProfileEditor({
  draft,
  onChange,
  onReset,
  onSubmit,
}: {
  draft: AdminDriverProfileDraft;
  onChange: (draft: AdminDriverProfileDraft) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  const updateDraft = <Key extends keyof AdminDriverProfileDraft>(
    key: Key,
    value: AdminDriverProfileDraft[Key]
  ) => {
    onChange({ ...draft, [key]: value });
  };

  return (
    <View style={adminStyles.editorPanel}>
      <View style={adminStyles.editorHeader}>
        <View>
          <Text style={adminStyles.inputLabel}>
            {draft.owner_user_id ? "EDIT DRIVER_PROFILE" : "CREATE DRIVER_PROFILE"}
          </Text>
          <Text style={adminStyles.recordMeta}>OWNER USER ID IS THE UPSERT KEY</Text>
        </View>
        <View style={adminStyles.actionRow}>
          <AdminButton label="RESET" variant="ghost" onPress={onReset} />
          <AdminButton label="SAVE" onPress={onSubmit} />
        </View>
      </View>

      <View style={adminStyles.formGrid}>
        <AdminTextInput label="OWNER USER ID" value={draft.owner_user_id} onChangeText={(value) => updateDraft("owner_user_id", value)} />
        <AdminTextInput label="VEHICLE MODEL" value={draft.vehicle_model} onChangeText={(value) => updateDraft("vehicle_model", value)} />
        <AdminTextInput label="VEHICLE PLATE" value={draft.vehicle_plate} onChangeText={(value) => updateDraft("vehicle_plate", value)} />
        <AdminTextInput label="PHONE" value={draft.contact_phone} onChangeText={(value) => updateDraft("contact_phone", value)} />
        <AdminTextInput label="CHAT LINK" value={draft.contact_link} onChangeText={(value) => updateDraft("contact_link", value)} />
        <AdminTextInput label="NOTE" value={draft.vehicle_note} onChangeText={(value) => updateDraft("vehicle_note", value)} />
      </View>
    </View>
  );
}

function AdminTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={adminStyles.inputBlock}>
      <Text style={adminStyles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#56616F"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={adminStyles.input}
      />
    </View>
  );
}

function AdminButton({
  label,
  onPress,
  disabled,
  variant = "default",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "default" | "danger" | "ghost";
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        adminStyles.button,
        variant === "danger" ? adminStyles.buttonDanger : null,
        variant === "ghost" ? adminStyles.buttonGhost : null,
        disabled ? adminStyles.buttonDisabled : null,
        pressed ? adminStyles.buttonPressed : null,
      ]}
    >
      <Text
        style={[
          adminStyles.buttonText,
          variant === "danger" ? adminStyles.buttonDangerText : null,
          variant === "ghost" ? adminStyles.buttonGhostText : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ChipGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <View style={adminStyles.inputBlock}>
      <Text style={adminStyles.inputLabel}>{label}</Text>
      <View style={adminStyles.chipRow}>
        {options.map(([optionValue, optionLabel]) => (
          <Pressable
            key={optionValue}
            onPress={() => onChange(optionValue)}
            style={[
              adminStyles.chip,
              value === optionValue ? adminStyles.chipActive : null,
            ]}
          >
            <Text style={[adminStyles.chipText, value === optionValue ? adminStyles.chipTextActive : null]}>
              {optionLabel}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RouteRecordCard({
  route,
  pendingKey,
  onEdit,
  onPatch,
  onDelete,
}: {
  route: AdminRoutePostRecord;
  pendingKey: string;
  onEdit: () => void;
  onPatch: (
    patch: Partial<Pick<AdminRoutePostRecord, "available_seats" | "is_active" | "is_public">>
  ) => void;
  onDelete: () => void;
}) {
  const isPending = pendingKey === `route:${route.id}` || pendingKey === `delete-route:${route.id}`;

  return (
    <View style={adminStyles.recordCard}>
      <View style={adminStyles.recordHeader}>
        <View style={{ flex: 1 }}>
          <Text style={adminStyles.recordTitle}>
            {route.kind.toUpperCase()} / {route.from_location} TO {route.to_location}
          </Text>
          <Text style={adminStyles.recordMeta}>
            {route.id} / {route.owner_name} / {toDateTime(route.created_at)}
          </Text>
        </View>
        <View style={adminStyles.badgeRow}>
          <StatusBadge label={route.is_public ? "PUBLIC" : "PRIVATE"} tone={route.is_public ? "ok" : "warn"} />
          <StatusBadge label={route.is_active ? "ACTIVE" : "INACTIVE"} tone={route.is_active ? "ok" : "off"} />
        </View>
      </View>

      <View style={adminStyles.recordGrid}>
        <RecordField label="VEHICLE" value={`${route.vehicle_model} / ${route.vehicle_plate}`} />
        <RecordField label="SCHEDULE" value={`${route.schedule}${route.return_schedule ? ` / ${route.return_schedule}` : ""}`} />
        <RecordField label="NOTICE DATE" value={route.notice_date ?? "-"} />
        <RecordField label="SEATS" value={String(route.available_seats)} />
        <RecordField label="CONTACT" value={route.contact_phone || route.contact_link || "-"} />
        <RecordField label="UPDATED" value={toDateTime(route.updated_at)} />
      </View>

      {route.note ? <Text style={adminStyles.noteText}>{route.note}</Text> : null}

      <View style={adminStyles.actionRow}>
        <AdminButton label="EDIT" variant="ghost" disabled={isPending} onPress={onEdit} />
        <AdminButton
          label={route.is_public ? "MAKE PRIVATE" : "MAKE PUBLIC"}
          disabled={isPending}
          onPress={() => onPatch({ is_public: !route.is_public })}
        />
        <AdminButton
          label="SEAT -"
          disabled={isPending || route.available_seats <= 1}
          onPress={() => onPatch({ available_seats: Math.max(1, route.available_seats - 1) })}
        />
        <AdminButton
          label="SEAT +"
          disabled={isPending || route.available_seats >= 8}
          onPress={() => onPatch({ available_seats: Math.min(8, route.available_seats + 1) })}
        />
        {route.kind === "one_time" ? (
          <AdminButton
            label={route.is_active ? "DEACTIVATE" : "ACTIVATE"}
            disabled={isPending}
            onPress={() => onPatch({ is_active: !route.is_active })}
          />
        ) : null}
        <AdminButton label="DELETE" variant="danger" disabled={isPending} onPress={onDelete} />
      </View>
    </View>
  );
}

function DriverProfileCard({
  profile,
  pendingKey,
  onEdit,
  onPatch,
  onDelete,
}: {
  profile: AdminDriverProfileRecord;
  pendingKey: string;
  onEdit: () => void;
  onPatch: (patch: Partial<AdminDriverProfileRecord>) => void;
  onDelete: () => void;
}) {
  const isPending =
    pendingKey === `profile:${profile.owner_user_id}` ||
    pendingKey === `delete-profile:${profile.owner_user_id}`;
  return (
    <View style={adminStyles.recordCard}>
      <View style={adminStyles.recordHeader}>
        <View style={{ flex: 1 }}>
          <Text style={adminStyles.recordTitle}>
            {profile.vehicle_model} / {profile.vehicle_plate}
          </Text>
          <Text style={adminStyles.recordMeta}>{profile.owner_user_id}</Text>
        </View>
        <View style={adminStyles.actionRow}>
          <AdminButton label="EDIT" variant="ghost" disabled={isPending} onPress={onEdit} />
          <AdminButton
            label="CLEAR NOTE"
            variant="ghost"
            disabled={isPending || !profile.vehicle_note}
            onPress={() => onPatch({ vehicle_note: "" })}
          />
          <AdminButton label="DELETE PROFILE" variant="danger" disabled={isPending} onPress={onDelete} />
        </View>
      </View>
      <View style={adminStyles.recordGrid}>
        <RecordField label="PHONE" value={profile.contact_phone ?? "-"} />
        <RecordField label="CHAT" value={profile.contact_link ?? "-"} />
        <RecordField label="UPDATED" value={toDateTime(profile.updated_at)} />
      </View>
      {profile.vehicle_note ? <Text style={adminStyles.noteText}>{profile.vehicle_note}</Text> : null}
    </View>
  );
}

function SupportRequestCard({
  request,
  pendingKey,
  onPatch,
  onDelete,
}: {
  request: AdminSupportRequestRecord;
  pendingKey: string;
  onPatch: (patch: AdminSupportRequestUpdate) => void;
  onDelete: () => void;
}) {
  const [adminNoteDraft, setAdminNoteDraft] = useState(request.admin_note);
  const isPending =
    pendingKey === `support:${request.id}` || pendingKey === `delete-support:${request.id}`;

  useEffect(() => {
    setAdminNoteDraft(request.admin_note);
  }, [request.admin_note]);

  return (
    <View style={adminStyles.recordCard}>
      <View style={adminStyles.recordHeader}>
        <View style={{ flex: 1 }}>
          <Text style={adminStyles.recordTitle}>
            {request.category.toUpperCase()} / {request.title}
          </Text>
          <Text style={adminStyles.recordMeta}>
            {request.user_email} / {request.user_id ?? "GUEST"} / {toDateTime(request.created_at)}
          </Text>
        </View>
        <View style={adminStyles.badgeRow}>
          <StatusBadge
            label={request.status.toUpperCase()}
            tone={
              request.status === "resolved" || request.status === "closed"
                ? "ok"
                : request.status === "in_progress"
                  ? "warn"
                  : "off"
            }
          />
        </View>
      </View>

      <Text style={adminStyles.noteText}>{request.message}</Text>

      <View style={adminStyles.formGrid}>
        <View style={adminStyles.inputBlock}>
          <Text style={adminStyles.inputLabel}>ADMIN NOTE</Text>
          <TextInput
            value={adminNoteDraft}
            onChangeText={(value) => setAdminNoteDraft(value.slice(0, 2000))}
            placeholder="Internal response or handling note"
            placeholderTextColor="#56616F"
            multiline
            textAlignVertical="top"
            style={[adminStyles.input, adminStyles.adminNoteInput]}
          />
        </View>
      </View>

      <View style={adminStyles.actionRow}>
        <AdminButton
          label="SAVE NOTE"
          disabled={isPending || adminNoteDraft === request.admin_note}
          onPress={() => onPatch({ admin_note: adminNoteDraft })}
        />
        <AdminButton
          label="OPEN"
          variant={request.status === "open" ? "default" : "ghost"}
          disabled={isPending}
          onPress={() => onPatch({ status: "open" })}
        />
        <AdminButton
          label="IN PROGRESS"
          variant={request.status === "in_progress" ? "default" : "ghost"}
          disabled={isPending}
          onPress={() => onPatch({ status: "in_progress" })}
        />
        <AdminButton
          label="RESOLVED"
          variant={request.status === "resolved" ? "default" : "ghost"}
          disabled={isPending}
          onPress={() => onPatch({ status: "resolved" })}
        />
        <AdminButton
          label="CLOSED"
          variant={request.status === "closed" ? "default" : "ghost"}
          disabled={isPending}
          onPress={() => onPatch({ status: "closed" })}
        />
        <AdminButton label="DELETE" variant="danger" disabled={isPending} onPress={onDelete} />
      </View>
    </View>
  );
}

function RecordField({ label, value }: { label: string; value: string }) {
  return (
    <View style={adminStyles.recordField}>
      <Text style={adminStyles.recordFieldLabel}>{label}</Text>
      <Text numberOfLines={1} style={adminStyles.recordFieldValue}>{value}</Text>
    </View>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: "ok" | "warn" | "off" }) {
  return (
    <View
      style={[
        adminStyles.statusBadge,
        tone === "ok" ? adminStyles.statusBadgeOk : null,
        tone === "warn" ? adminStyles.statusBadgeWarn : null,
        tone === "off" ? adminStyles.statusBadgeOff : null,
      ]}
    >
      <Text style={adminStyles.statusBadgeText}>{label}</Text>
    </View>
  );
}

const adminStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#1B2533",
    backgroundColor: "#080C12",
    paddingHorizontal: 22,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  kicker: {
    color: "#7C8A9B",
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  headerTitle: {
    color: "#E6EDF7",
    fontFamily: monoFont,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  operatorText: {
    color: "#A9B7C8",
    fontFamily: monoFont,
    fontSize: 12,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 16,
    paddingBottom: 40,
  },
  workspace: {
    gap: 14,
  },
  workspaceWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  workspaceContent: {
    flex: 1,
    minWidth: 0,
  },
  menuRail: {
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#070B10",
    padding: 10,
    gap: 10,
  },
  menuRailWide: {
    width: 220,
  },
  menuRailLabel: {
    color: "#64748B",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  menuItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  menuItemsWide: {
    flexDirection: "column",
  },
  menuItem: {
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#0B1119",
    padding: 11,
    gap: 4,
  },
  menuItemActive: {
    borderColor: "#78A6FF",
    backgroundColor: "#10213A",
  },
  menuItemPressed: {
    opacity: 0.72,
  },
  menuItemLabel: {
    color: "#8D9AAD",
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  menuItemLabelActive: {
    color: "#F8FAFC",
  },
  menuItemDescription: {
    color: "#56616F",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "800",
  },
  menuItemDescriptionActive: {
    color: "#A9C4FF",
  },
  panel: {
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#0B1119",
    padding: 14,
    gap: 14,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  panelTitle: {
    color: "#D8E1EC",
    fontFamily: monoFont,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  bodyText: {
    color: "#A9B7C8",
    fontFamily: monoFont,
    fontSize: 13,
    lineHeight: 19,
  },
  loginGrid: {
    maxWidth: 520,
    gap: 12,
  },
  authNotice: {
    borderWidth: 1,
    borderColor: "#854D0E",
    backgroundColor: "#1E1405",
    padding: 10,
    gap: 8,
  },
  authNoticeLabel: {
    color: "#FACC15",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  authNoticeText: {
    color: "#FEF3C7",
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: "800",
  },
  authPolicyText: {
    color: "#64748B",
    fontFamily: monoFont,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    minWidth: 170,
    flex: 1,
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#0B1119",
    padding: 14,
    gap: 6,
  },
  statLabel: {
    color: "#7C8A9B",
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: "800",
  },
  statValue: {
    color: "#F8FAFC",
    fontFamily: monoFont,
    fontSize: 28,
    fontWeight: "900",
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  overviewSignal: {
    minWidth: 190,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#17202D",
    paddingTop: 10,
    gap: 4,
  },
  overviewSignalLabel: {
    color: "#64748B",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  overviewSignalValue: {
    color: "#C9D4E2",
    fontFamily: monoFont,
    fontSize: 18,
    fontWeight: "900",
  },
  errorPanel: {
    borderWidth: 1,
    borderColor: "#7F1D1D",
    backgroundColor: "#220B0B",
    padding: 12,
    gap: 4,
  },
  errorLabel: {
    color: "#FCA5A5",
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: "900",
  },
  errorText: {
    color: "#FECACA",
    fontFamily: monoFont,
    fontSize: 12,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
  },
  editorPanel: {
    borderWidth: 1,
    borderColor: "#17202D",
    backgroundColor: "#080D14",
    padding: 12,
    gap: 12,
  },
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  inputBlock: {
    gap: 6,
    minWidth: 180,
    flex: 1,
  },
  inputLabel: {
    color: "#788697",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  input: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#253247",
    backgroundColor: "#070B10",
    color: "#E6EDF7",
    fontFamily: monoFont,
    fontSize: 13,
    paddingHorizontal: 10,
  },
  adminNoteInput: {
    minHeight: 84,
    paddingTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#253247",
    backgroundColor: "#070B10",
    paddingHorizontal: 10,
    minHeight: 42,
    justifyContent: "center",
  },
  chipActive: {
    borderColor: "#78A6FF",
    backgroundColor: "#10213A",
  },
  chipText: {
    color: "#8D9AAD",
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: "900",
  },
  chipTextActive: {
    color: "#D7E6FF",
  },
  recordsStack: {
    gap: 10,
  },
  recordCard: {
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#070B10",
    padding: 12,
    gap: 12,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  recordTitle: {
    color: "#E6EDF7",
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: "900",
  },
  recordMeta: {
    color: "#7C8A9B",
    fontFamily: monoFont,
    fontSize: 11,
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusBadgeOk: {
    borderColor: "#166534",
    backgroundColor: "#071A10",
  },
  statusBadgeWarn: {
    borderColor: "#854D0E",
    backgroundColor: "#1E1405",
  },
  statusBadgeOff: {
    borderColor: "#475569",
    backgroundColor: "#111827",
  },
  statusBadgeText: {
    color: "#D8E1EC",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
  },
  recordGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recordField: {
    minWidth: 150,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#17202D",
    paddingTop: 8,
    gap: 3,
  },
  recordFieldLabel: {
    color: "#64748B",
    fontFamily: monoFont,
    fontSize: 10,
    fontWeight: "900",
  },
  recordFieldValue: {
    color: "#C9D4E2",
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: "800",
  },
  noteText: {
    color: "#A9B7C8",
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    minHeight: 36,
    borderWidth: 1,
    borderColor: "#315173",
    backgroundColor: "#10213A",
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDanger: {
    borderColor: "#7F1D1D",
    backgroundColor: "#2A0F12",
  },
  buttonGhost: {
    borderColor: "#253247",
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.42,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: "#D7E6FF",
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  buttonDangerText: {
    color: "#FECACA",
  },
  buttonGhostText: {
    color: "#A9B7C8",
  },
  emptyText: {
    color: "#7C8A9B",
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: "800",
  },
  addAdminRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  adminAccountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1C2736",
    backgroundColor: "#070B10",
    padding: 12,
  },
});
