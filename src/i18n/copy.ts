import type { AppLanguage } from "./types";

const APP_COPY = {
  en: {
    meta: {
      language: "en",
      locale: "en-AU",
    },
    languageSelection: {
      eyebrow: "Roadmate Setup",
      title: "Choose your app language",
      body: "Pick a language for your first session. You can change this later in My Page.",
      continue: "Continue",
    },
    loading: {
      title: "Loading Roadmate...",
    },
    authComplete: {
      eyebrow: "Verification complete",
      title: "Your email has been confirmed.",
      mobileBody: "Return to Roadmate on this phone to continue.",
      desktopBody:
        "This email is confirmed. Open Roadmate on your phone and sign in with the same email to continue.",
      nextTitle: "Next step",
      nextBodyMobile:
        "Tap below to reopen Roadmate. If nothing happens, switch back to the app manually.",
      nextBodyDesktop:
        "Desktop browsers cannot continue inside the mobile app automatically.",
      openApp: "Open Roadmate",
      mobileHint:
        "If the app does not open, return to Roadmate manually and sign in with the same email.",
      desktopHint:
        "After confirming on desktop, open the Roadmate app on your phone and sign in manually.",
      errorTitle: "Authentication could not be completed.",
      errorBody: (message: string) => `Supabase returned: ${message}`,
    },
    config: {
      badgeCaption: "MVP Supabase hookup",
      eyebrow: "Configuration required",
      title: "Connect this MVP to your new Supabase project.",
      body: "Add your MVP project URL and anon key to `rodemate_mvp/.env`, then restart Expo.",
      missingEnvTitle: "Missing Supabase env",
      missingEnvBody: "Create or update `.env` and set the two public values below.",
      hint: "Once those values are set, this login page will use real Supabase Auth instead of the previous local-only mock.",
    },
    common: {
      back: "Back",
      cancel: "Cancel",
      guest: "Guest",
      role: "Role",
      home: "Home",
      saved: "Saved",
      myPage: "My Page",
      regular: "Regular",
      notices: "Notices",
      oneTime: "One-time",
      note: "Note",
      edit: "Edit",
      delete: "Delete",
      driver: "Driver",
      rider: "Rider",
      state: "State",
      allStates: "All states",
      from: "From",
      to: "To",
      searchResults: "Search results",
      anyOrigin: "Any origin",
      anyDestination: "Any destination",
      seats: "Seats",
      visibility: "Visibility",
      public: "Public",
      private: "Private",
      additionalDetails: "Additional details",
      loadMoreResults: "Load more results",
      rideDetails: "Ride details",
      vehicle: "Vehicle",
      phone: "Phone",
      email: "Email",
      name: "Name",
      carNote: "Car note",
      accountSummary: "Account summary",
      accountManagement: "Account management",
      changeLanguage: "App language",
      settings: "Settings",
      dateTbd: "Date TBD",
      today: "Today",
      tomorrow: "Tomorrow",
      past: "Past",
      recently: "Recently",
      me: "Me",
    },
    auth: {
      getStarted: "Get Started with Roadmate",
      emailEnabled: "Email sign-in is enabled for this build.",
      continueWithEmail: "Continue with Email",
      continueWithProvider: (providerLabel: string) => `Continue with ${providerLabel}`,
      openingProvider: (providerLabel: string) => `Opening ${providerLabel}...`,
      emailSignInTitle: "Email Sign In",
      emailSignUpTitle: "Email Sign Up",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign out",
      entrySubtitleSignIn: "Sign in with email to start exploring and posting rides.",
      entrySubtitleSignUp: "Create an account with email to start using Roadmate.",
      emailPlaceholder: "Email",
      passwordLabel: "Password",
      newPasswordLabel: "New password",
      passwordPlaceholder: "Password (at least 6 characters)",
      passwordConfirmLabel: "Confirm password",
      passwordConfirmPlaceholder: "Confirm password",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset password",
      passwordRecoveryTitle: "Reset your password",
      passwordRecoverySubtitle:
        "Set a new password to finish recovering your Roadmate account.",
      passwordResetRequestTitle: "Password reset",
      passwordResetRequestSubtitle:
        "Check that this email is registered before sending a password reset email.",
      checkRegisteredEmail: "Check registered email",
      registeredEmailConfirmed: "This email is registered.",
      unregisteredEmail: "This email is not registered.",
      sendPasswordResetEmail: "Send password reset email",
      passwordResetEmailSentEyebrow: "Reset email sent",
      passwordResetEmailSentSubtitle:
        "Open the newest email, complete verification, then return to Roadmate.",
      passwordResetVerifiedEyebrow: "Verification complete",
      passwordResetVerifiedTitle: "You can change your password now.",
      passwordResetVerifiedSubtitle:
        "The reset link was confirmed on this device. Continue to enter a new password.",
      continueToPasswordChange: "Enter new password",
      changePassword: "Change password",
      passwordResetResendCountdown: (remaining: string) =>
        `Resend available in ${remaining}`,
      passwordResetRequestHint:
        "Only registered email addresses can receive password reset emails.",
      checkEmailDuplicate: "Check email availability",
      emailAvailable: "This email is available.",
      emailAlreadyRegistered: "This email is already registered.",
      working: "Working...",
      switchHint: "Don’t have an account? Switch to Sign Up.",
      verificationHint: "Email verification may be required after sign-up.",
      createAccountWithEmail: "Create account with email",
    },
    community: {
      regularRegistration: "Regular registration",
      oneTimeRegistration: "One-time registration",
      searchNotices: "Search notices",
      searchRides: "Search rides",
      pastNoticesHidden: (count: number) => `${count} past notices are hidden.`,
      upcoming: "Upcoming",
      allNotices: "All notices",
      savedRidesTitle: "Saved rides",
      savedOnlyInRiderMode: "Saved is available in rider mode only.",
      totalSaved: (count: number) => `Total saved: ${count}`,
      savedRecent: "Saved recent",
      noticeRecent: "Notice recent",
      noSavedRides: "No saved rides yet.",
      chooseSearchPrompt: (isNotice: boolean) =>
        isNotice
          ? "Choose a state or enter both from and to to search notices."
          : "Choose a state or enter both from and to to search rides.",
      tapSearchPrompt: (isNotice: boolean) =>
        isNotice ? "Tap search to view notices." : "Tap search to view rides.",
      pastOnlyPrompt: "Only past notices match this filter or search.",
      noNoticesMatch: "No notices match this filter or search.",
      noRidesMatch: "No rides match this filter or search.",
      accountSummaryName: (value: string) => `Name: ${value}`,
      accountSummaryEmail: (value: string) => `Email: ${value}`,
      accountSummaryRole: (value: string) => `Role: ${value}`,
      accountSummaryRoutes: (count: number) => `My routes: ${count}`,
      driverProfileStatus: "Driver profile status",
      riderModeActive: "Rider mode is active.",
      driverProfileReady: "Driver profile is ready for posting.",
      driverProfileMissingContact: "Driver profile is saved, but contact method is missing.",
      driverProfileIncomplete: "Driver profile is not completed yet.",
      switchToDriver: "Switch to driver mode to manage your vehicle profile.",
      registerVehicleFirst:
        "Register vehicle and contact details once to start posting regular or one-time routes.",
      vehicleRow: (model: string, plate: string) => `Vehicle: ${model} · ${plate}`,
      phoneRow: (value: string) => `Phone: ${value}`,
      addContactMethod:
        "Add phone or chat link (WhatsApp/Kakao/Telegram) to make riders contact you.",
      carNoteRow: (value: string) => `Car note: ${value}`,
      accountManagementSignedIn:
        "Sign out keeps your account. Leave community removes your public posts and driver profile, then signs you out.",
      accountManagementGuest:
        "You are browsing as guest. Create an account to save rides and register as a driver.",
      guestMyPageMessage:
        "You are exploring Roadmate as a guest. Create an account to save rides and switch into driver mode.",
      settingsDescription: "Manage language and account options in one place.",
      settingsLanguageDescription: "Choose the language used across the app.",
      openSettings: "Open settings",
      confirmSignOutPrompt: "Tap sign out once more to confirm.",
      confirmSignOut: "Confirm sign out",
      cancelSignOut: "Cancel sign out",
      confirmLeavePrompt: "Tap leave community once more to confirm.",
      confirmLeave: "Confirm leave community",
      leaveCommunity: "Leave community",
      cancelLeaving: "Cancel leaving",
      myCar: "My car",
      driverRegistration: "Driver registration",
      driverGarageFilled:
        "One driver profile only. Vehicle and contact info are auto-applied to regular and one-time posts.",
      driverGarageEmpty:
        "Before using driver mode, register your vehicle and contact profile first.",
      carModel: "Car model",
      plateNumber: "Plate number",
      contactPhone: "Contact phone",
      chatLink: "Chat link (WhatsApp/Kakao/Telegram)",
      saveVehicle: "Save vehicle",
      completeRegistration: "Complete registration",
      routeNotRegistered: "Not registered",
      driverDraftReady:
        "Draft is ready. Save registration to publish this route for riders.",
      driverDraftStarted:
        "Draft started. Complete required fields, then save registration to publish.",
      driverNoActiveOneTimeNotice:
        "No active one-time notice right now. Register a new notice whenever you want riders to see it.",
      driverNoRegistration:
        "No registered information yet. Register once and riders can discover your route.",
      missingPreview: (labels: string[], remainingCount: number) =>
        `Missing: ${labels.join(", ")}${remainingCount > 0 ? ` +${remainingCount} more` : ""}`,
      reviewAndSave: "Review & save",
      continueDraft: "Continue draft",
      registerNow: "Register now",
      postingOneTimeNotice: "Posting one-time notice...",
      savingRegistration: "Saving registration...",
      postOneTimeNotice: "Post one-time notice",
      saveRegistration: "Save registration",
      viewPreviousNotices: "View previous notices",
      hidePreviousNotices: "Hide previous notices",
      previousNotices: "Previous notices",
      previousNoticesDescription: "Filter older notices by period.",
      previousNoticesAll: "All",
      previousNotices30Days: "30 days",
      previousNotices90Days: "90 days",
      previousNotices365Days: "1 year",
      noPreviousNoticesInRange: "No previous notices match this period.",
      oneTimeComposerTitle: "One-time notice",
      oneTimeComposerDescription:
        "Share a single upcoming ride plan. Riders will only see your current active notice.",
      regularComposerTitle: "Regular route",
      regularComposerDescription:
        "Set your repeat route once, then fine-tune seats, days, and visibility anytime.",
      routeSectionTitle: "Route",
      routeSectionDescription: "Set the departure and destination riders should see first.",
      scheduleSectionTitle: "Schedule",
      scheduleSectionDescription: "Choose the date, trip type, and time for this one-time notice.",
      regularScheduleSectionDescription:
        "Choose the departure and arrival time that riders should expect on your repeat route.",
      regularSettingsSectionTitle: "Driver settings",
      regularSettingsSectionDescription:
        "Adjust seats, operating days, contact overrides, and visibility in one place.",
      noteSectionTitle: "Additional details",
      oneTimeNoteDescription: "Optional: add pickup notes or extra instructions for riders.",
      regularNoteDescription:
        "Optional: add pickup notes or extra context riders should know every time.",
      saveNoticeSectionTitle: "Publish",
      saveNoticeSectionDescription:
        "Review the required fields, then publish this notice to riders.",
      saveRouteSectionTitle: "Save",
      saveRouteSectionDescription:
        "Once the required fields are ready, save this route so riders can discover it.",
      oneTimePublishButtonHint: "Visible to riders right away",
      regularSaveButtonHint: "You can update seats and visibility later",
      driverOverviewStatusActive: "Active",
      driverOverviewStatusDraft: "Draft",
      driverOverviewStatusEmpty: "Not set up",
      driverOverviewRegularHint:
        "Keep your recurring route polished so riders can trust it at a glance.",
      driverOverviewOneTimeHint:
        "Only one active notice is shown to riders, so the current trip stays clear.",
      driverOverviewPreviousCount: (count: number) => `${count} previous`,
      driverOverviewMissingCount: (count: number) => `${count} items left`,
      completeRequiredItems: (count: number) =>
        `Complete ${count} required item${count > 1 ? "s" : ""}`,
      fillRequiredOneTime: "Fill required fields to post this one-time notice.",
      fillRequiredRegistration: "Fill all required fields to save this registration.",
      seatsLeft: (count: number) => `${count} seats left`,
      noticeFor: (value: string) => `Notice for ${value}`,
      rideDetailsSubtitle: (from: string, to: string) => `${from} -> ${to}`,
      fromMyDriverProfile: "From my driver profile",
      ownerDriver: "Driver",
      ownerVehicle: "Vehicle",
      stateDefault: "All states",
      noticeHiddenByScope: (count: number) => `${count} past notices are hidden.`,
      searchScopeSummary: (fromLabel: string, toLabel: string) => `${fromLabel} → ${toLabel}`,
    },
    tripTypes: {
      roundTrip: "Round-trip",
      oneWay: "One-way",
    },
    reasons: {
      driverRegistration: "Driver registration",
      routePosting: "Route posting",
      savingRides: "Saving rides",
      updatingRouteSettings: "Updating route settings",
      driverMode: "Driver mode",
      accountAccess: "Account access",
    },
    notices: {
      accountRequired: (reason: string) =>
        `${reason} requires an account. Verify your email and set a password to continue.`,
      supabaseNotConfigured:
        "Supabase is not configured yet. Add your MVP project values to `.env` first.",
      signInSuccess: "Signed in successfully.",
      signUpAndIn: (value: string) => `Signed up and signed in as ${value}.`,
      signUpComplete: "Sign-up complete. Check your email to verify your account, then sign in.",
      authFailed: (action: string, message: string) => `${action} failed: ${message}`,
      signInEmailNotRegistered: (email: string) =>
        `${email} is not registered. Check the email address or create a new account first.`,
      signInWrongPassword: (email: string) =>
        `${email} is registered, but the password is incorrect. Try again or use password reset.`,
      signInInvalidCredentials: (email: string) =>
        `Could not sign in to ${email}. The email or password is incorrect.`,
      signInRateLimited:
        "Too many sign-in attempts were made. Wait a few minutes, then try again.",
      signInNetworkFailed:
        "Roadmate could not reach the auth server. Check your connection and try again.",
      emailVerifiedAndSignedIn: "Email verified. You are now signed in.",
      authenticationCouldNotBeCompleted: (message: string) =>
        `Authentication could not be completed: ${message}`,
      verificationEmailSent: (email: string) =>
        `Verification email sent to ${email}. Open the confirmation page from that email, then return to Roadmate and sign in.`,
      emailVerificationStillNeeded: (email: string) =>
        `This account still needs email verification. Open the email sent to ${email}, then return to Roadmate.`,
      enterEmailBeforeResendingVerification:
        "Enter an email address first so the verification message can be resent.",
      verificationEmailResent: (email: string) => `A fresh verification email was sent to ${email}.`,
      verificationEmailResendFailed: (message: string) =>
        `Could not resend the verification email: ${message}`,
      enterEmailBeforePasswordReset:
        "Enter your email address first so the password reset email can be sent.",
      passwordResetEmailSent: (email: string) =>
        `Password reset email sent to ${email}. Open that link on this device to set a new password.`,
      passwordResetReady: "Password reset verified. Enter a new password to finish.",
      passwordResetComplete: "Password updated successfully.",
      passwordResetFailed: (message: string) => `Password reset failed: ${message}`,
      passwordResetEmailCheckFailed: (message: string) =>
        `Could not verify whether this email is registered: ${message}`,
      passwordResetEmailNotRegistered: (email: string) =>
        `${email} is not registered. Password reset is unavailable for this email.`,
      duplicateEmailFound: (email: string) => `${email} is already registered. Please sign in instead.`,
      emailAvailableForSignUp: (email: string) => `${email} is available for sign-up.`,
      emailDuplicateCheckUnavailable:
        "Email duplicate check is unavailable until the latest Supabase migration is applied.",
      duplicateCheckFailed: (message: string) => `Could not check email availability: ${message}`,
      signedOut: "Signed out.",
      oauthCanceled: (providerLabel: string) => `${providerLabel} sign-in was canceled.`,
      oauthMissingAuthorizationUrl: "Unable to start OAuth flow. Missing authorization URL.",
      oauthMissingSessionTokens:
        "OAuth callback did not include session tokens. Check Supabase provider redirect URL settings.",
      oauthSuccess: (providerLabel: string) => `Signed in with ${providerLabel}.`,
      driverRegistrationFirst:
        "Complete driver registration first: save your car model and plate.",
      signInBeforeLeaving: "Sign in before leaving the community.",
      leaveCommunitySuccess: "Community profile cleared and signed out.",
      leaveCommunityFailed: (message: string) => `Leave community failed: ${message}`,
      signInBeforePosting: "Sign in before posting a route.",
      saveVehicleInfoFirst: "Save vehicle info first.",
      localDbSyncFailed: (message: string) => `DB sync failed. Saved only on this device. (${message})`,
      oneTimeNoticeUpdated: "One-time notice updated and shared to riders.",
      oneTimeNoticePosted: "One-time notice posted and shared to riders.",
      registrationUpdated: (kindLabel: string) => `${kindLabel} registration updated and shared to riders.`,
      registrationSaved: (kindLabel: string) => `${kindLabel} registration saved and shared to riders.`,
      routeDeleteFailed: (message: string) =>
        `Route delete failed in DB. Local list updated only. (${message})`,
      routeRemoved: "Route removed.",
      signInBeforeSavingRides: "Sign in before saving rides.",
      saveRegistrationBeforeSettings:
        "Save registration first before changing seats or visibility.",
      routeUpdateFailed: (message: string) =>
        `Route update failed in DB. Local values updated only. (${message})`,
      routeQuickSettingsSaveFailed: (message: string) =>
        `Route quick settings could not be saved locally. (${message})`,
      signInBeforeSavingVehicle: "Sign in before saving a vehicle.",
      vehicleModelAndPlateRequired: "Driver needs at least a car model and plate number.",
      driverProfileSaved: "Driver profile saved.",
    },
    validation: {
      validEmail: "Please enter a valid email address.",
      passwordLength: "Password must be at least 6 characters.",
      passwordConfirmMismatch: "Passwords do not match.",
    },
    alerts: {
      leaveCommunityTitle: "Leave community?",
      leaveCommunityBody:
        "This removes your route posts and driver profile, marks your community access inactive, and signs you out.",
      leaveCommunityAction: "Leave",
    },
    weekdays: {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    },
  },
  fr: {
    meta: {
      language: "fr",
      locale: "fr-FR",
    },
    languageSelection: {
      eyebrow: "Configuration Roadmate",
      title: "Choisissez la langue de l’application",
      body: "Choisissez une langue pour votre première session. Vous pourrez la modifier plus tard dans Mon compte.",
      continue: "Continuer",
    },
    loading: {
      title: "Chargement de Roadmate...",
    },
    authComplete: {
      eyebrow: "Vérification terminée",
      title: "Votre adresse e-mail a été confirmée.",
      mobileBody: "Revenez dans Roadmate sur ce téléphone pour continuer.",
      desktopBody:
        "Cet e-mail est confirmé. Ouvrez Roadmate sur votre téléphone et connectez-vous avec la même adresse pour continuer.",
      nextTitle: "Étape suivante",
      nextBodyMobile:
        "Touchez ci-dessous pour rouvrir Roadmate. Si rien ne se passe, revenez manuellement dans l’app.",
      nextBodyDesktop:
        "Les navigateurs sur ordinateur ne peuvent pas continuer automatiquement dans l’application mobile.",
      openApp: "Ouvrir Roadmate",
      mobileHint:
        "Si l’app ne s’ouvre pas, revenez manuellement dans Roadmate et connectez-vous avec la même adresse e-mail.",
      desktopHint:
        "Après confirmation sur ordinateur, ouvrez l’app Roadmate sur votre téléphone et connectez-vous manuellement.",
      errorTitle: "L’authentification n’a pas pu être terminée.",
      errorBody: (message: string) => `Supabase a renvoyé : ${message}`,
    },
    config: {
      badgeCaption: "Connexion MVP Supabase",
      eyebrow: "Configuration requise",
      title: "Connectez ce MVP à votre nouveau projet Supabase.",
      body: "Ajoutez l’URL du projet MVP et la clé anon dans `rodemate_mvp/.env`, puis redémarrez Expo.",
      missingEnvTitle: "Variables Supabase manquantes",
      missingEnvBody: "Créez ou mettez à jour `.env`, puis définissez les deux valeurs publiques ci-dessous.",
      hint: "Une fois ces valeurs définies, cette page de connexion utilisera le vrai système Auth de Supabase au lieu de l’ancienne maquette locale.",
    },
    common: {
      back: "Retour",
      cancel: "Annuler",
      guest: "Invité",
      role: "Rôle",
      home: "Accueil",
      saved: "Enregistrés",
      myPage: "Mon compte",
      regular: "Régulier",
      notices: "Annonces",
      oneTime: "Ponctuel",
      note: "Note",
      edit: "Modifier",
      delete: "Supprimer",
      driver: "Conducteur",
      rider: "Passager",
      state: "État",
      allStates: "Tous les États",
      from: "Départ",
      to: "Arrivée",
      searchResults: "Résultats de recherche",
      anyOrigin: "N’importe quel départ",
      anyDestination: "N’importe quelle arrivée",
      seats: "Places",
      visibility: "Visibilité",
      public: "Public",
      private: "Privé",
      additionalDetails: "Détails supplémentaires",
      loadMoreResults: "Charger plus de résultats",
      rideDetails: "Détails du trajet",
      vehicle: "Véhicule",
      phone: "Téléphone",
      email: "E-mail",
      name: "Nom",
      carNote: "Note du véhicule",
      accountSummary: "Résumé du compte",
      accountManagement: "Gestion du compte",
      changeLanguage: "Langue de l’application",
      settings: "Paramètres",
      dateTbd: "Date à confirmer",
      today: "Aujourd’hui",
      tomorrow: "Demain",
      past: "Passé",
      recently: "Récent",
      me: "Moi",
    },
    auth: {
      getStarted: "Commencez avec Roadmate",
      emailEnabled: "La connexion par e-mail est activée pour cette version.",
      continueWithEmail: "Continuer avec l’e-mail",
      continueWithProvider: (providerLabel: string) => `Continuer avec ${providerLabel}`,
      openingProvider: (providerLabel: string) => `Ouverture de ${providerLabel}...`,
      emailSignInTitle: "Connexion par e-mail",
      emailSignUpTitle: "Inscription par e-mail",
      signIn: "Se connecter",
      signUp: "S’inscrire",
      signOut: "Se déconnecter",
      entrySubtitleSignIn:
        "Connectez-vous avec votre e-mail pour explorer et publier des trajets.",
      entrySubtitleSignUp:
        "Créez un compte avec votre e-mail pour commencer à utiliser Roadmate.",
      emailPlaceholder: "E-mail",
      passwordLabel: "Mot de passe",
      newPasswordLabel: "Nouveau mot de passe",
      passwordPlaceholder: "Mot de passe (au moins 6 caractères)",
      passwordConfirmLabel: "Confirmer le mot de passe",
      passwordConfirmPlaceholder: "Confirmer le mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      resetPassword: "Réinitialiser le mot de passe",
      passwordRecoveryTitle: "Réinitialisez votre mot de passe",
      passwordRecoverySubtitle:
        "Définissez un nouveau mot de passe pour terminer la récupération de votre compte Roadmate.",
      passwordResetRequestTitle: "Réinitialisation du mot de passe",
      passwordResetRequestSubtitle:
        "Vérifiez d’abord que cet e-mail est enregistré avant d’envoyer l’e-mail de réinitialisation.",
      checkRegisteredEmail: "Vérifier l’e-mail enregistré",
      registeredEmailConfirmed: "Cette adresse e-mail est enregistrée.",
      unregisteredEmail: "Cette adresse e-mail n’est pas enregistrée.",
      sendPasswordResetEmail: "Envoyer l’e-mail de réinitialisation",
      passwordResetEmailSentEyebrow: "E-mail envoyé",
      passwordResetEmailSentSubtitle:
        "Ouvrez le dernier e-mail reçu, terminez la vérification, puis revenez dans Roadmate.",
      passwordResetVerifiedEyebrow: "Vérification terminée",
      passwordResetVerifiedTitle: "Vous pouvez maintenant changer votre mot de passe.",
      passwordResetVerifiedSubtitle:
        "Le lien de réinitialisation a bien été confirmé sur cet appareil. Continuez pour saisir un nouveau mot de passe.",
      continueToPasswordChange: "Saisir un nouveau mot de passe",
      changePassword: "Changer le mot de passe",
      passwordResetResendCountdown: (remaining: string) =>
        `Renvoi disponible dans ${remaining}`,
      passwordResetRequestHint:
        "Seules les adresses e-mail enregistrées peuvent recevoir un e-mail de réinitialisation.",
      checkEmailDuplicate: "Vérifier la disponibilité de l’e-mail",
      emailAvailable: "Cette adresse e-mail est disponible.",
      emailAlreadyRegistered: "Cette adresse e-mail est déjà enregistrée.",
      working: "Traitement...",
      switchHint: "Vous n’avez pas de compte ? Passez à l’inscription.",
      verificationHint: "Une vérification par e-mail peut être requise après l’inscription.",
      createAccountWithEmail: "Créer un compte par e-mail",
    },
    community: {
      regularRegistration: "Inscription régulière",
      oneTimeRegistration: "Inscription ponctuelle",
      searchNotices: "Rechercher des annonces",
      searchRides: "Rechercher des trajets",
      pastNoticesHidden: (count: number) => `${count} annonces passées sont masquées.`,
      upcoming: "À venir",
      allNotices: "Toutes les annonces",
      savedRidesTitle: "Trajets enregistrés",
      savedOnlyInRiderMode: "Les enregistrements sont disponibles uniquement en mode passager.",
      totalSaved: (count: number) => `Total enregistrés : ${count}`,
      savedRecent: "Enregistrés récents",
      noticeRecent: "Annonces récentes",
      noSavedRides: "Aucun trajet enregistré pour le moment.",
      chooseSearchPrompt: (isNotice: boolean) =>
        isNotice
          ? "Choisissez un État ou renseignez départ et arrivée pour rechercher des annonces."
          : "Choisissez un État ou renseignez départ et arrivée pour rechercher des trajets.",
      tapSearchPrompt: (isNotice: boolean) =>
        isNotice ? "Touchez Rechercher pour voir les annonces." : "Touchez Rechercher pour voir les trajets.",
      pastOnlyPrompt: "Seules des annonces passées correspondent à ce filtre ou à cette recherche.",
      noNoticesMatch: "Aucune annonce ne correspond à ce filtre ou à cette recherche.",
      noRidesMatch: "Aucun trajet ne correspond à ce filtre ou à cette recherche.",
      accountSummaryName: (value: string) => `Nom : ${value}`,
      accountSummaryEmail: (value: string) => `E-mail : ${value}`,
      accountSummaryRole: (value: string) => `Rôle : ${value}`,
      accountSummaryRoutes: (count: number) => `Mes trajets : ${count}`,
      driverProfileStatus: "État du profil conducteur",
      riderModeActive: "Le mode passager est actif.",
      driverProfileReady: "Le profil conducteur est prêt pour la publication.",
      driverProfileMissingContact:
        "Le profil conducteur est enregistré, mais un moyen de contact manque.",
      driverProfileIncomplete: "Le profil conducteur n’est pas encore complet.",
      switchToDriver:
        "Passez en mode conducteur pour gérer le profil de votre véhicule.",
      registerVehicleFirst:
        "Enregistrez une fois le véhicule et les contacts pour publier des trajets réguliers ou ponctuels.",
      vehicleRow: (model: string, plate: string) => `Véhicule : ${model} · ${plate}`,
      phoneRow: (value: string) => `Téléphone : ${value}`,
      addContactMethod:
        "Ajoutez un téléphone ou un lien de chat (WhatsApp/Kakao/Telegram) pour que les passagers puissent vous joindre.",
      carNoteRow: (value: string) => `Note du véhicule : ${value}`,
      accountManagementSignedIn:
        "Se déconnecter conserve votre compte. Quitter la communauté supprime vos publications publiques et votre profil conducteur, puis vous déconnecte.",
      accountManagementGuest:
        "Vous naviguez en tant qu’invité. Créez un compte pour enregistrer des trajets et vous inscrire comme conducteur.",
      guestMyPageMessage:
        "Vous découvrez Roadmate en mode invité. Créez un compte pour enregistrer des trajets et passer en mode conducteur.",
      settingsDescription:
        "Gérez la langue et les options du compte au même endroit.",
      settingsLanguageDescription:
        "Choisissez la langue utilisée dans toute l’application.",
      openSettings: "Ouvrir les paramètres",
      confirmSignOutPrompt: "Touchez encore une fois Se déconnecter pour confirmer.",
      confirmSignOut: "Confirmer la déconnexion",
      cancelSignOut: "Annuler la déconnexion",
      confirmLeavePrompt: "Touchez encore une fois Quitter la communauté pour confirmer.",
      confirmLeave: "Confirmer le départ",
      leaveCommunity: "Quitter la communauté",
      cancelLeaving: "Annuler",
      myCar: "Ma voiture",
      driverRegistration: "Inscription conducteur",
      driverGarageFilled:
        "Un seul profil conducteur. Les informations du véhicule et de contact sont appliquées automatiquement aux trajets réguliers et ponctuels.",
      driverGarageEmpty:
        "Avant d’utiliser le mode conducteur, enregistrez d’abord le véhicule et le profil de contact.",
      carModel: "Modèle du véhicule",
      plateNumber: "Plaque d’immatriculation",
      contactPhone: "Téléphone de contact",
      chatLink: "Lien de chat (WhatsApp/Kakao/Telegram)",
      saveVehicle: "Enregistrer le véhicule",
      completeRegistration: "Terminer l’inscription",
      routeNotRegistered: "Non enregistré",
      driverDraftReady:
        "Le brouillon est prêt. Enregistrez l’inscription pour publier ce trajet aux passagers.",
      driverDraftStarted:
        "Le brouillon a commencé. Complétez les champs requis puis enregistrez l’inscription.",
      driverNoActiveOneTimeNotice:
        "Aucune annonce ponctuelle active pour le moment. Enregistrez-en une nouvelle quand vous voulez la publier aux passagers.",
      driverNoRegistration:
        "Aucune information enregistrée pour le moment. Enregistrez une fois et les passagers pourront découvrir votre trajet.",
      missingPreview: (labels: string[], remainingCount: number) =>
        `Manque : ${labels.join(", ")}${remainingCount > 0 ? ` +${remainingCount} de plus` : ""}`,
      reviewAndSave: "Vérifier et enregistrer",
      continueDraft: "Continuer le brouillon",
      registerNow: "S’inscrire maintenant",
      postingOneTimeNotice: "Publication de l’annonce ponctuelle...",
      savingRegistration: "Enregistrement de l’inscription...",
      postOneTimeNotice: "Publier l’annonce ponctuelle",
      saveRegistration: "Enregistrer l’inscription",
      viewPreviousNotices: "Voir les annonces précédentes",
      hidePreviousNotices: "Masquer les annonces précédentes",
      previousNotices: "Annonces précédentes",
      previousNoticesDescription: "Filtrez les anciennes annonces par période.",
      previousNoticesAll: "Toutes",
      previousNotices30Days: "30 jours",
      previousNotices90Days: "90 jours",
      previousNotices365Days: "1 an",
      noPreviousNoticesInRange: "Aucune annonce précédente ne correspond à cette période.",
      oneTimeComposerTitle: "Annonce ponctuelle",
      oneTimeComposerDescription:
        "Partagez un trajet ponctuel à venir. Les passagers ne verront que votre annonce active actuelle.",
      regularComposerTitle: "Trajet régulier",
      regularComposerDescription:
        "Enregistrez votre trajet récurrent une fois, puis ajustez les places, les jours et la visibilité à tout moment.",
      routeSectionTitle: "Trajet",
      routeSectionDescription:
        "Définissez le départ et la destination que les passagers verront en premier.",
      scheduleSectionTitle: "Horaire",
      scheduleSectionDescription:
        "Choisissez la date, le type de trajet et l’heure pour cette annonce ponctuelle.",
      regularScheduleSectionDescription:
        "Choisissez les horaires de départ et d’arrivée attendus pour ce trajet récurrent.",
      regularSettingsSectionTitle: "Réglages conducteur",
      regularSettingsSectionDescription:
        "Ajustez les places, les jours de circulation, les contacts et la visibilité au même endroit.",
      noteSectionTitle: "Détails supplémentaires",
      oneTimeNoteDescription:
        "Optionnel : ajoutez le lieu de prise en charge ou toute information utile pour les passagers.",
      regularNoteDescription:
        "Optionnel : ajoutez des consignes ou des précisions utiles pour chaque trajet.",
      saveNoticeSectionTitle: "Publier",
      saveNoticeSectionDescription:
        "Vérifiez les champs requis puis publiez cette annonce aux passagers.",
      saveRouteSectionTitle: "Enregistrer",
      saveRouteSectionDescription:
        "Une fois les champs requis prêts, enregistrez ce trajet pour que les passagers puissent le trouver.",
      oneTimePublishButtonHint: "Visible immédiatement pour les passagers",
      regularSaveButtonHint: "Vous pourrez modifier les places et la visibilité plus tard",
      driverOverviewStatusActive: "Actif",
      driverOverviewStatusDraft: "Brouillon",
      driverOverviewStatusEmpty: "Non configuré",
      driverOverviewRegularHint:
        "Gardez ce trajet récurrent net et fiable pour les passagers réguliers.",
      driverOverviewOneTimeHint:
        "Une seule annonce active est montrée aux passagers pour garder le trajet actuel bien clair.",
      driverOverviewPreviousCount: (count: number) => `${count} anciennes`,
      driverOverviewMissingCount: (count: number) => `${count} éléments restants`,
      completeRequiredItems: (count: number) =>
        `Complétez ${count} élément${count > 1 ? "s" : ""} requis`,
      fillRequiredOneTime:
        "Remplissez les champs requis pour publier cette annonce ponctuelle.",
      fillRequiredRegistration:
        "Remplissez tous les champs requis pour enregistrer cette inscription.",
      seatsLeft: (count: number) => `${count} places restantes`,
      noticeFor: (value: string) => `Annonce du ${value}`,
      rideDetailsSubtitle: (from: string, to: string) => `${from} -> ${to}`,
      fromMyDriverProfile: "Depuis mon profil conducteur",
      ownerDriver: "Conducteur",
      ownerVehicle: "Véhicule",
      stateDefault: "Tous les États",
      noticeHiddenByScope: (count: number) => `${count} annonces passées sont masquées.`,
      searchScopeSummary: (fromLabel: string, toLabel: string) => `${fromLabel} → ${toLabel}`,
    },
    tripTypes: {
      roundTrip: "Aller-retour",
      oneWay: "Aller simple",
    },
    reasons: {
      driverRegistration: "L’inscription conducteur",
      routePosting: "La publication du trajet",
      savingRides: "L’enregistrement des trajets",
      updatingRouteSettings: "La mise à jour des réglages du trajet",
      driverMode: "Le mode conducteur",
      accountAccess: "L’accès au compte",
    },
    notices: {
      accountRequired: (reason: string) =>
        `${reason} nécessite un compte. Vérifiez votre e-mail et définissez un mot de passe pour continuer.`,
      supabaseNotConfigured:
        "Supabase n’est pas encore configuré. Ajoutez d’abord les valeurs de votre projet MVP dans `.env`.",
      signInSuccess: "Connexion réussie.",
      signUpAndIn: (value: string) => `Inscription et connexion réussies en tant que ${value}.`,
      signUpComplete:
        "Inscription terminée. Vérifiez votre e-mail pour confirmer le compte, puis connectez-vous.",
      authFailed: (action: string, message: string) => `${action} a échoué : ${message}`,
      signInEmailNotRegistered: (email: string) =>
        `${email} n’est pas enregistré. Vérifiez l’adresse ou créez d’abord un compte.`,
      signInWrongPassword: (email: string) =>
        `${email} est enregistré, mais le mot de passe est incorrect. Réessayez ou utilisez la réinitialisation du mot de passe.`,
      signInInvalidCredentials: (email: string) =>
        `Connexion impossible à ${email}. L’e-mail ou le mot de passe est incorrect.`,
      signInRateLimited:
        "Trop de tentatives de connexion ont été effectuées. Attendez quelques minutes, puis réessayez.",
      signInNetworkFailed:
        "Roadmate ne peut pas joindre le serveur d’authentification. Vérifiez votre connexion, puis réessayez.",
      emailVerifiedAndSignedIn: "Adresse e-mail vérifiée. Vous êtes maintenant connecté.",
      authenticationCouldNotBeCompleted: (message: string) =>
        `L’authentification n’a pas pu être terminée : ${message}`,
      verificationEmailSent: (email: string) =>
        `Un e-mail de vérification a été envoyé à ${email}. Ouvrez la page de confirmation depuis cet e-mail, puis revenez dans Roadmate pour vous connecter.`,
      emailVerificationStillNeeded: (email: string) =>
        `Ce compte nécessite encore une vérification par e-mail. Ouvrez l’e-mail envoyé à ${email}, puis revenez dans Roadmate.`,
      enterEmailBeforeResendingVerification:
        "Saisissez d’abord une adresse e-mail pour pouvoir renvoyer le message de vérification.",
      verificationEmailResent: (email: string) =>
        `Un nouvel e-mail de vérification a été envoyé à ${email}.`,
      verificationEmailResendFailed: (message: string) =>
        `Impossible de renvoyer l’e-mail de vérification : ${message}`,
      enterEmailBeforePasswordReset:
        "Saisissez d’abord votre adresse e-mail pour envoyer l’e-mail de réinitialisation du mot de passe.",
      passwordResetEmailSent: (email: string) =>
        `Un e-mail de réinitialisation du mot de passe a été envoyé à ${email}. Ouvrez ce lien sur cet appareil pour définir un nouveau mot de passe.`,
      passwordResetReady:
        "La réinitialisation du mot de passe a été vérifiée. Saisissez un nouveau mot de passe pour terminer.",
      passwordResetComplete: "Mot de passe mis à jour avec succès.",
      passwordResetFailed: (message: string) =>
        `La réinitialisation du mot de passe a échoué : ${message}`,
      passwordResetEmailCheckFailed: (message: string) =>
        `Impossible de vérifier si cet e-mail est enregistré : ${message}`,
      passwordResetEmailNotRegistered: (email: string) =>
        `${email} n’est pas enregistré. La réinitialisation du mot de passe n’est pas disponible pour cette adresse.`,
      duplicateEmailFound: (email: string) =>
        `${email} est déjà enregistré. Connectez-vous à la place.`,
      emailAvailableForSignUp: (email: string) =>
        `${email} est disponible pour l’inscription.`,
      emailDuplicateCheckUnavailable:
        "La vérification de doublon d’e-mail n’est pas disponible tant que la dernière migration Supabase n’est pas appliquée.",
      duplicateCheckFailed: (message: string) =>
        `Impossible de vérifier la disponibilité de l’e-mail : ${message}`,
      signedOut: "Déconnecté.",
      oauthCanceled: (providerLabel: string) => `La connexion ${providerLabel} a été annulée.`,
      oauthMissingAuthorizationUrl:
        "Impossible de démarrer le flux OAuth. URL d’autorisation manquante.",
      oauthMissingSessionTokens:
        "Le rappel OAuth n’incluait pas les jetons de session. Vérifiez les paramètres d’URL de redirection du fournisseur Supabase.",
      oauthSuccess: (providerLabel: string) => `Connecté avec ${providerLabel}.`,
      driverRegistrationFirst:
        "Terminez d’abord l’inscription conducteur : enregistrez le modèle et la plaque du véhicule.",
      signInBeforeLeaving: "Connectez-vous avant de quitter la communauté.",
      leaveCommunitySuccess: "Profil communautaire effacé et déconnexion effectuée.",
      leaveCommunityFailed: (message: string) => `Échec du départ de la communauté : ${message}`,
      signInBeforePosting: "Connectez-vous avant de publier un trajet.",
      saveVehicleInfoFirst: "Enregistrez d’abord les informations du véhicule.",
      localDbSyncFailed: (message: string) =>
        `Échec de synchronisation DB. Sauvegardé seulement sur cet appareil. (${message})`,
      oneTimeNoticeUpdated: "Annonce ponctuelle mise à jour et partagée avec les passagers.",
      oneTimeNoticePosted: "Annonce ponctuelle publiée et partagée avec les passagers.",
      registrationUpdated: (kindLabel: string) =>
        `Inscription ${kindLabel.toLowerCase()} mise à jour et partagée avec les passagers.`,
      registrationSaved: (kindLabel: string) =>
        `Inscription ${kindLabel.toLowerCase()} enregistrée et partagée avec les passagers.`,
      routeDeleteFailed: (message: string) =>
        `Échec de suppression du trajet en DB. Liste locale uniquement mise à jour. (${message})`,
      routeRemoved: "Trajet supprimé.",
      signInBeforeSavingRides: "Connectez-vous avant d’enregistrer des trajets.",
      saveRegistrationBeforeSettings:
        "Enregistrez d’abord l’inscription avant de changer les places ou la visibilité.",
      routeUpdateFailed: (message: string) =>
        `Échec de mise à jour du trajet en DB. Valeurs locales uniquement mises à jour. (${message})`,
      routeQuickSettingsSaveFailed: (message: string) =>
        `Impossible d’enregistrer localement les réglages rapides du trajet. (${message})`,
      signInBeforeSavingVehicle: "Connectez-vous avant d’enregistrer un véhicule.",
      vehicleModelAndPlateRequired:
        "Le conducteur doit avoir au moins un modèle de véhicule et une plaque.",
      driverProfileSaved: "Profil conducteur enregistré.",
    },
    validation: {
      validEmail: "Veuillez saisir une adresse e-mail valide.",
      passwordLength: "Le mot de passe doit comporter au moins 6 caractères.",
      passwordConfirmMismatch: "Les mots de passe ne correspondent pas.",
    },
    alerts: {
      leaveCommunityTitle: "Quitter la communauté ?",
      leaveCommunityBody:
        "Cela supprime vos publications de trajet et votre profil conducteur, marque votre accès communautaire comme inactif et vous déconnecte.",
      leaveCommunityAction: "Quitter",
    },
    weekdays: {
      Mon: "Lun",
      Tue: "Mar",
      Wed: "Mer",
      Thu: "Jeu",
      Fri: "Ven",
      Sat: "Sam",
      Sun: "Dim",
    },
  },
  ko: {
    meta: {
      language: "ko",
      locale: "ko-KR",
    },
    languageSelection: {
      eyebrow: "Roadmate 시작 설정",
      title: "앱 언어를 선택하세요",
      body: "처음 사용할 언어를 고르세요. 나중에 마이페이지에서 다시 바꿀 수 있습니다.",
      continue: "계속",
    },
    loading: {
      title: "Roadmate 불러오는 중...",
    },
    authComplete: {
      eyebrow: "인증 완료",
      title: "이메일 인증이 완료되었습니다.",
      mobileBody: "이 휴대폰에서 Roadmate로 돌아와 계속 진행하세요.",
      desktopBody:
        "이 이메일은 인증되었습니다. 휴대폰에서 Roadmate를 열고 같은 이메일로 로그인해 계속하세요.",
      nextTitle: "다음 단계",
      nextBodyMobile:
        "아래 버튼으로 Roadmate를 다시 열어보세요. 반응이 없으면 앱으로 직접 돌아가면 됩니다.",
      nextBodyDesktop:
        "PC 브라우저에서는 모바일 앱 안으로 자동으로 이어서 진행할 수 없습니다.",
      openApp: "Roadmate 열기",
      mobileHint:
        "앱이 열리지 않으면 Roadmate로 직접 돌아가 같은 이메일로 다시 로그인하세요.",
      desktopHint:
        "PC에서 인증했다면 휴대폰에서 Roadmate 앱을 열고 직접 로그인하세요.",
      errorTitle: "인증을 완료할 수 없습니다.",
      errorBody: (message: string) => `Supabase 응답: ${message}`,
    },
    config: {
      badgeCaption: "MVP Supabase 연결",
      eyebrow: "설정 필요",
      title: "이 MVP를 새 Supabase 프로젝트에 연결하세요.",
      body: "`rodemate_mvp/.env`에 프로젝트 URL과 anon key를 넣고 Expo를 다시 시작하세요.",
      missingEnvTitle: "Supabase 환경변수가 없습니다",
      missingEnvBody: "`.env`를 만들거나 수정한 뒤 아래 두 개의 공개 값을 설정하세요.",
      hint: "값을 설정하면 이 로그인 화면은 이전 로컬 전용 목업 대신 실제 Supabase Auth를 사용합니다.",
    },
    common: {
      back: "뒤로",
      cancel: "취소",
      guest: "게스트",
      role: "역할",
      home: "홈",
      saved: "저장됨",
      myPage: "마이페이지",
      regular: "정기",
      notices: "공지",
      oneTime: "일회성",
      note: "메모",
      edit: "수정",
      delete: "삭제",
      driver: "드라이버",
      rider: "라이더",
      state: "주",
      allStates: "전체 주",
      from: "출발지",
      to: "도착지",
      searchResults: "검색 결과",
      anyOrigin: "어디서나",
      anyDestination: "어디든",
      seats: "좌석",
      visibility: "공개 범위",
      public: "공개",
      private: "비공개",
      additionalDetails: "추가 안내",
      loadMoreResults: "결과 더 보기",
      rideDetails: "라이드 상세",
      vehicle: "차량",
      phone: "전화번호",
      email: "이메일",
      name: "이름",
      carNote: "차량 메모",
      accountSummary: "계정 요약",
      accountManagement: "계정 관리",
      changeLanguage: "앱 언어",
      settings: "설정",
      dateTbd: "날짜 미정",
      today: "오늘",
      tomorrow: "내일",
      past: "지난 일정",
      recently: "최근",
      me: "나",
    },
    auth: {
      getStarted: "Roadmate 시작하기",
      emailEnabled: "이 빌드에서는 이메일 로그인이 활성화되어 있습니다.",
      continueWithEmail: "이메일로 계속",
      continueWithProvider: (providerLabel: string) => `${providerLabel}로 계속`,
      openingProvider: (providerLabel: string) => `${providerLabel} 여는 중...`,
      emailSignInTitle: "이메일 로그인",
      emailSignUpTitle: "이메일 회원가입",
      signIn: "로그인",
      signUp: "회원가입",
      signOut: "로그아웃",
      entrySubtitleSignIn: "이메일로 로그인해서 라이드를 찾고 등록해보세요.",
      entrySubtitleSignUp: "이메일로 계정을 만들어 Roadmate를 시작하세요.",
      emailPlaceholder: "이메일",
      passwordLabel: "비밀번호",
      newPasswordLabel: "새 비밀번호",
      passwordPlaceholder: "비밀번호 (최소 6자)",
      passwordConfirmLabel: "비밀번호 확인",
      passwordConfirmPlaceholder: "비밀번호를 다시 입력하세요",
      forgotPassword: "비밀번호를 잊으셨나요?",
      resetPassword: "비밀번호 재설정",
      passwordRecoveryTitle: "비밀번호 재설정",
      passwordRecoverySubtitle: "새 비밀번호를 설정해서 Roadmate 계정 복구를 마무리하세요.",
      passwordResetRequestTitle: "비밀번호 찾기",
      passwordResetRequestSubtitle:
        "먼저 이 이메일이 가입된 계정인지 확인한 뒤 비밀번호 재설정 메일을 보냅니다.",
      checkRegisteredEmail: "등록된 이메일 확인",
      registeredEmailConfirmed: "가입된 이메일이 확인되었습니다.",
      unregisteredEmail: "등록되지 않은 이메일입니다.",
      sendPasswordResetEmail: "비밀번호 재설정 메일 보내기",
      passwordResetEmailSentEyebrow: "재설정 메일 발송 완료",
      passwordResetEmailSentSubtitle:
        "가장 최근에 도착한 메일을 열어 인증한 뒤 다시 Roadmate로 돌아오세요.",
      passwordResetVerifiedEyebrow: "인증 완료",
      passwordResetVerifiedTitle: "이제 비밀번호를 변경할 수 있습니다.",
      passwordResetVerifiedSubtitle:
        "이 기기에서 재설정 링크 인증이 완료되었습니다. 계속해서 새 비밀번호를 입력하세요.",
      continueToPasswordChange: "비밀번호 변경하기",
      changePassword: "비밀번호 변경하기",
      passwordResetResendCountdown: (remaining: string) =>
        `${remaining} 후 다시 발송할 수 있습니다`,
      passwordResetRequestHint:
        "가입된 이메일로 확인된 경우에만 비밀번호 재설정 메일을 보낼 수 있습니다.",
      checkEmailDuplicate: "이메일 중복 확인",
      emailAvailable: "사용 가능한 이메일입니다.",
      emailAlreadyRegistered: "이미 가입된 이메일입니다.",
      working: "처리 중...",
      switchHint: "계정이 없나요? 회원가입으로 전환하세요.",
      verificationHint: "회원가입 후 이메일 인증이 필요할 수 있습니다.",
      createAccountWithEmail: "이메일로 계정 만들기",
    },
    community: {
      regularRegistration: "정기 등록",
      oneTimeRegistration: "일회성 등록",
      searchNotices: "공지 검색",
      searchRides: "라이드 검색",
      pastNoticesHidden: (count: number) => `지난 공지 ${count}건은 숨겨져 있습니다.`,
      upcoming: "예정됨",
      allNotices: "전체 공지",
      savedRidesTitle: "저장한 라이드",
      savedOnlyInRiderMode: "저장은 라이더 모드에서만 사용할 수 있습니다.",
      totalSaved: (count: number) => `총 저장 수: ${count}`,
      savedRecent: "최근 저장순",
      noticeRecent: "공지 최신순",
      noSavedRides: "아직 저장한 라이드가 없습니다.",
      chooseSearchPrompt: (isNotice: boolean) =>
        isNotice
          ? "주를 선택하거나 출발지와 도착지를 모두 입력해 공지를 검색하세요."
          : "주를 선택하거나 출발지와 도착지를 모두 입력해 라이드를 검색하세요.",
      tapSearchPrompt: (isNotice: boolean) =>
        isNotice ? "검색 버튼을 눌러 공지를 확인하세요." : "검색 버튼을 눌러 라이드를 확인하세요.",
      pastOnlyPrompt: "이 필터 또는 검색에는 지난 공지만 일치합니다.",
      noNoticesMatch: "이 필터 또는 검색과 일치하는 공지가 없습니다.",
      noRidesMatch: "이 필터 또는 검색과 일치하는 라이드가 없습니다.",
      accountSummaryName: (value: string) => `이름: ${value}`,
      accountSummaryEmail: (value: string) => `이메일: ${value}`,
      accountSummaryRole: (value: string) => `역할: ${value}`,
      accountSummaryRoutes: (count: number) => `내 등록 수: ${count}`,
      driverProfileStatus: "드라이버 프로필 상태",
      riderModeActive: "현재 라이더 모드입니다.",
      driverProfileReady: "드라이버 프로필이 게시 가능한 상태입니다.",
      driverProfileMissingContact: "드라이버 프로필은 저장됐지만 연락 수단이 없습니다.",
      driverProfileIncomplete: "드라이버 프로필이 아직 완성되지 않았습니다.",
      switchToDriver: "차량 프로필을 관리하려면 드라이버 모드로 전환하세요.",
      registerVehicleFirst:
        "정기 또는 일회성 등록을 시작하려면 차량 정보와 연락 수단을 먼저 등록하세요.",
      vehicleRow: (model: string, plate: string) => `차량: ${model} · ${plate}`,
      phoneRow: (value: string) => `전화: ${value}`,
      addContactMethod:
        "라이더가 연락할 수 있도록 전화번호나 채팅 링크(WhatsApp/Kakao/Telegram)를 추가하세요.",
      carNoteRow: (value: string) => `차량 메모: ${value}`,
      accountManagementSignedIn:
        "로그아웃은 계정을 유지합니다. 커뮤니티 나가기는 공개 게시물과 드라이버 프로필을 지운 뒤 로그아웃합니다.",
      accountManagementGuest:
        "현재 게스트로 둘러보고 있습니다. 라이드 저장과 드라이버 등록을 하려면 계정을 만드세요.",
      guestMyPageMessage:
        "지금은 게스트로 둘러보고 있어요. 회원가입하면 저장 기능과 드라이버 모드를 이용할 수 있어요.",
      settingsDescription: "언어와 계정 관련 옵션을 한 곳에서 관리하세요.",
      settingsLanguageDescription: "앱 전체에서 사용할 언어를 선택하세요.",
      openSettings: "설정 열기",
      confirmSignOutPrompt: "한 번 더 누르면 로그아웃됩니다.",
      confirmSignOut: "로그아웃 확인",
      cancelSignOut: "로그아웃 취소",
      confirmLeavePrompt: "한 번 더 누르면 커뮤니티에서 나갑니다.",
      confirmLeave: "커뮤니티 나가기 확인",
      leaveCommunity: "커뮤니티 나가기",
      cancelLeaving: "나가기 취소",
      myCar: "내 차량",
      driverRegistration: "드라이버 등록",
      driverGarageFilled:
        "드라이버 프로필은 하나만 유지됩니다. 차량과 연락 정보는 정기/일회성 등록에 자동 적용됩니다.",
      driverGarageEmpty:
        "드라이버 모드를 쓰기 전에 차량과 연락 프로필을 먼저 등록하세요.",
      carModel: "차량 모델",
      plateNumber: "번호판",
      contactPhone: "연락 전화번호",
      chatLink: "채팅 링크 (WhatsApp/Kakao/Telegram)",
      saveVehicle: "차량 저장",
      completeRegistration: "등록 완료",
      routeNotRegistered: "아직 등록 안 됨",
      driverDraftReady: "초안이 준비됐습니다. 등록을 저장하면 라이더에게 공개됩니다.",
      driverDraftStarted: "초안을 시작했습니다. 필수 항목을 채운 뒤 등록을 저장하세요.",
      driverNoActiveOneTimeNotice:
        "지금 활성화된 일회성 공지가 없습니다. 새 공지를 등록하면 라이더에게 바로 공개할 수 있습니다.",
      driverNoRegistration: "아직 등록된 정보가 없습니다. 한 번 등록하면 라이더가 이 경로를 찾을 수 있습니다.",
      missingPreview: (labels: string[], remainingCount: number) =>
        `누락: ${labels.join(", ")}${remainingCount > 0 ? ` 외 ${remainingCount}개` : ""}`,
      reviewAndSave: "검토 후 저장",
      continueDraft: "초안 이어서",
      registerNow: "지금 등록",
      postingOneTimeNotice: "일회성 공지 올리는 중...",
      savingRegistration: "등록 저장 중...",
      postOneTimeNotice: "일회성 공지 올리기",
      saveRegistration: "등록 저장",
      viewPreviousNotices: "이전 공고 보기",
      hidePreviousNotices: "이전 공고 닫기",
      previousNotices: "이전 공고",
      previousNoticesDescription: "기간 기준으로 지난 공고를 확인할 수 있습니다.",
      previousNoticesAll: "전체",
      previousNotices30Days: "30일",
      previousNotices90Days: "90일",
      previousNotices365Days: "1년",
      noPreviousNoticesInRange: "이 기간에 해당하는 이전 공고가 없습니다.",
      oneTimeComposerTitle: "일회성 공지",
      oneTimeComposerDescription:
        "다가오는 한 번의 이동 계획을 등록하세요. 라이더에게는 현재 활성 공지 1개만 보입니다.",
      regularComposerTitle: "정기 경로",
      regularComposerDescription:
        "반복되는 경로를 한 번 등록하고, 좌석 수와 운행 요일, 공개 상태를 필요할 때마다 조정하세요.",
      routeSectionTitle: "경로",
      routeSectionDescription: "라이더가 먼저 보게 될 출발지와 도착지를 정리하세요.",
      scheduleSectionTitle: "일정",
      scheduleSectionDescription: "날짜, 이동 방식, 시간을 설정해 이번 공지를 완성하세요.",
      regularScheduleSectionDescription:
        "반복 경로에서 라이더가 기대할 출발/도착 시간을 설정하세요.",
      regularSettingsSectionTitle: "드라이버 설정",
      regularSettingsSectionDescription:
        "좌석 수, 운행 요일, 연락처 오버라이드, 공개 범위를 한 번에 조정하세요.",
      noteSectionTitle: "추가 안내",
      oneTimeNoteDescription: "선택 사항: 탑승 위치나 추가 안내가 있다면 적어두세요.",
      regularNoteDescription:
        "선택 사항: 매번 공통으로 전달할 탑승 위치나 안내가 있다면 적어두세요.",
      saveNoticeSectionTitle: "공개",
      saveNoticeSectionDescription: "필수 항목을 확인한 뒤 이 공지를 라이더에게 공개합니다.",
      saveRouteSectionTitle: "저장",
      saveRouteSectionDescription:
        "필수 항목이 준비되면 이 경로를 저장해 라이더가 찾을 수 있게 하세요.",
      oneTimePublishButtonHint: "공개하면 라이더에게 바로 노출됩니다.",
      regularSaveButtonHint: "저장 후에도 좌석과 공개 범위는 바로 수정할 수 있어요.",
      driverOverviewStatusActive: "운영 중",
      driverOverviewStatusDraft: "초안",
      driverOverviewStatusEmpty: "미설정",
      driverOverviewRegularHint:
        "반복 경로는 한눈에 믿음이 가도록 간결하고 최신 상태로 유지하는 게 좋습니다.",
      driverOverviewOneTimeHint:
        "라이더에게는 현재 활성 공지 1개만 보이므로 지금 이동 계획이 더 명확하게 전달됩니다.",
      driverOverviewPreviousCount: (count: number) => `이전 ${count}건`,
      driverOverviewMissingCount: (count: number) => `${count}개 남음`,
      completeRequiredItems: (count: number) => `필수 항목 ${count}개 완료하기`,
      fillRequiredOneTime: "이 일회성 공지를 올리려면 필수 항목을 입력하세요.",
      fillRequiredRegistration: "이 등록을 저장하려면 필수 항목을 모두 입력하세요.",
      seatsLeft: (count: number) => `잔여 좌석 ${count}`,
      noticeFor: (value: string) => `${value} 공지`,
      rideDetailsSubtitle: (from: string, to: string) => `${from} -> ${to}`,
      fromMyDriverProfile: "내 드라이버 프로필에서 가져옴",
      ownerDriver: "드라이버",
      ownerVehicle: "차량",
      stateDefault: "전체 주",
      noticeHiddenByScope: (count: number) => `지난 공지 ${count}건은 숨겨져 있습니다.`,
      searchScopeSummary: (fromLabel: string, toLabel: string) => `${fromLabel} → ${toLabel}`,
    },
    tripTypes: {
      roundTrip: "왕복",
      oneWay: "편도",
    },
    reasons: {
      driverRegistration: "드라이버 등록",
      routePosting: "경로 등록",
      savingRides: "라이드 저장",
      updatingRouteSettings: "경로 설정 변경",
      driverMode: "드라이버 모드",
      accountAccess: "계정 접근",
    },
    notices: {
      accountRequired: (reason: string) =>
        `${reason}을(를) 진행하려면 계정이 필요합니다. 이메일을 확인하고 비밀번호를 설정한 뒤 계속하세요.`,
      supabaseNotConfigured:
        "아직 Supabase가 설정되지 않았습니다. 먼저 `.env`에 MVP 프로젝트 값을 넣어주세요.",
      signInSuccess: "로그인되었습니다.",
      signUpAndIn: (value: string) => `${value} 계정으로 가입과 로그인이 완료되었습니다.`,
      signUpComplete: "회원가입이 완료되었습니다. 이메일 인증 후 로그인하세요.",
      authFailed: (action: string, message: string) => `${action} 실패: ${message}`,
      signInEmailNotRegistered: (email: string) =>
        `${email}은(는) 가입되지 않은 이메일입니다. 이메일 주소를 확인하거나 먼저 회원가입을 진행하세요.`,
      signInWrongPassword: (email: string) =>
        `${email} 계정은 존재하지만 비밀번호가 맞지 않습니다. 다시 입력하거나 비밀번호 찾기로 재설정하세요.`,
      signInInvalidCredentials: (email: string) =>
        `${email}로 로그인할 수 없습니다. 이메일 또는 비밀번호가 올바르지 않습니다.`,
      signInRateLimited: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.",
      signInNetworkFailed:
        "인증 서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도하세요.",
      emailVerifiedAndSignedIn: "이메일 인증이 완료되어 바로 로그인되었습니다.",
      authenticationCouldNotBeCompleted: (message: string) => `인증을 완료할 수 없습니다: ${message}`,
      verificationEmailSent: (email: string) =>
        `${email}로 인증 메일을 보냈습니다. 메일의 확인 페이지를 완료한 뒤 Roadmate로 돌아와 로그인하세요.`,
      emailVerificationStillNeeded: (email: string) =>
        `이 계정은 아직 이메일 인증이 필요합니다. ${email}로 온 메일을 열어 인증한 뒤 Roadmate로 돌아오세요.`,
      enterEmailBeforeResendingVerification:
        "인증 메일을 다시 보내려면 먼저 이메일 주소를 입력하세요.",
      verificationEmailResent: (email: string) => `${email}로 새 인증 메일을 보냈습니다.`,
      verificationEmailResendFailed: (message: string) =>
        `인증 메일을 다시 보내지 못했습니다: ${message}`,
      enterEmailBeforePasswordReset:
        "비밀번호 재설정 메일을 보내려면 먼저 이메일 주소를 입력하세요.",
      passwordResetEmailSent: (email: string) =>
        `${email}로 비밀번호 재설정 메일을 보냈습니다. 이 기기에서 링크를 열어 새 비밀번호를 설정하세요.`,
      passwordResetReady: "비밀번호 재설정 인증이 확인되었습니다. 새 비밀번호를 입력해 마무리하세요.",
      passwordResetComplete: "비밀번호가 변경되었습니다.",
      passwordResetFailed: (message: string) => `비밀번호 재설정 실패: ${message}`,
      passwordResetEmailCheckFailed: (message: string) =>
        `이 이메일이 가입된 계정인지 확인하지 못했습니다: ${message}`,
      passwordResetEmailNotRegistered: (email: string) =>
        `${email}은(는) 등록되지 않은 이메일입니다. 비밀번호 찾기를 진행할 수 없습니다.`,
      duplicateEmailFound: (email: string) =>
        `${email}은(는) 이미 가입된 이메일입니다. 로그인으로 진행하세요.`,
      emailAvailableForSignUp: (email: string) => `${email}은(는) 가입 가능한 이메일입니다.`,
      emailDuplicateCheckUnavailable:
        "최신 Supabase 마이그레이션이 적용되기 전까지는 이메일 중복 확인을 사용할 수 없습니다.",
      duplicateCheckFailed: (message: string) => `이메일 중복 확인에 실패했습니다: ${message}`,
      signedOut: "로그아웃되었습니다.",
      oauthCanceled: (providerLabel: string) => `${providerLabel} 로그인이 취소되었습니다.`,
      oauthMissingAuthorizationUrl: "OAuth를 시작할 수 없습니다. 인증 URL이 없습니다.",
      oauthMissingSessionTokens:
        "OAuth 콜백에 세션 토큰이 없습니다. Supabase provider redirect URL 설정을 확인하세요.",
      oauthSuccess: (providerLabel: string) => `${providerLabel}로 로그인되었습니다.`,
      driverRegistrationFirst:
        "먼저 드라이버 등록을 완료하세요. 차량 모델과 번호판을 저장해야 합니다.",
      signInBeforeLeaving: "커뮤니티를 나가려면 먼저 로그인하세요.",
      leaveCommunitySuccess: "커뮤니티 프로필이 정리되고 로그아웃되었습니다.",
      leaveCommunityFailed: (message: string) => `커뮤니티 나가기 실패: ${message}`,
      signInBeforePosting: "경로를 올리기 전에 로그인하세요.",
      saveVehicleInfoFirst: "먼저 차량 정보를 저장하세요.",
      localDbSyncFailed: (message: string) =>
        `DB 동기화에 실패했습니다. 이 기기에만 저장되었습니다. (${message})`,
      oneTimeNoticeUpdated: "일회성 공지가 업데이트되어 라이더에게 공유되었습니다.",
      oneTimeNoticePosted: "일회성 공지가 등록되어 라이더에게 공유되었습니다.",
      registrationUpdated: (kindLabel: string) => `${kindLabel} 등록이 업데이트되어 라이더에게 공유되었습니다.`,
      registrationSaved: (kindLabel: string) => `${kindLabel} 등록이 저장되어 라이더에게 공유되었습니다.`,
      routeDeleteFailed: (message: string) =>
        `DB에서 경로 삭제에 실패했습니다. 로컬 목록만 업데이트되었습니다. (${message})`,
      routeRemoved: "경로가 삭제되었습니다.",
      signInBeforeSavingRides: "라이드를 저장하려면 먼저 로그인하세요.",
      saveRegistrationBeforeSettings:
        "좌석 수나 공개 범위를 바꾸려면 먼저 등록을 저장하세요.",
      routeUpdateFailed: (message: string) =>
        `DB에서 경로 업데이트에 실패했습니다. 로컬 값만 변경되었습니다. (${message})`,
      routeQuickSettingsSaveFailed: (message: string) =>
        `경로 빠른 설정을 로컬에 저장할 수 없습니다. (${message})`,
      signInBeforeSavingVehicle: "차량 정보를 저장하려면 먼저 로그인하세요.",
      vehicleModelAndPlateRequired: "드라이버는 최소한 차량 모델과 번호판이 필요합니다.",
      driverProfileSaved: "드라이버 프로필이 저장되었습니다.",
    },
    validation: {
      validEmail: "올바른 이메일 주소를 입력하세요.",
      passwordLength: "비밀번호는 최소 6자 이상이어야 합니다.",
      passwordConfirmMismatch: "비밀번호가 서로 일치하지 않습니다.",
    },
    alerts: {
      leaveCommunityTitle: "커뮤니티에서 나가시겠어요?",
      leaveCommunityBody:
        "공개 경로 게시물과 드라이버 프로필이 삭제되고, 커뮤니티 접근이 비활성화된 뒤 로그아웃됩니다.",
      leaveCommunityAction: "나가기",
    },
    weekdays: {
      Mon: "월",
      Tue: "화",
      Wed: "수",
      Thu: "목",
      Fri: "금",
      Sat: "토",
      Sun: "일",
    },
  },
  ja: {
    meta: {
      language: "ja",
      locale: "ja-JP",
    },
    languageSelection: {
      eyebrow: "Roadmate 初期設定",
      title: "アプリの言語を選択してください",
      body: "最初の利用言語を選んでください。後でマイページから変更できます。",
      continue: "続ける",
    },
    loading: {
      title: "Roadmate を読み込み中...",
    },
    authComplete: {
      eyebrow: "認証完了",
      title: "メール認証が完了しました。",
      mobileBody: "この端末で Roadmate に戻って続行してください。",
      desktopBody:
        "このメールは認証されました。スマートフォンで Roadmate を開き、同じメールアドレスでログインして続けてください。",
      nextTitle: "次の手順",
      nextBodyMobile:
        "下のボタンから Roadmate を再度開いてください。反応しない場合は手動でアプリに戻ってください。",
      nextBodyDesktop:
        "デスクトップブラウザではモバイルアプリ内に自動で続行できません。",
      openApp: "Roadmate を開く",
      mobileHint:
        "アプリが開かない場合は、手動で Roadmate に戻り、同じメールアドレスでログインしてください。",
      desktopHint:
        "デスクトップで認証した後は、スマートフォンで Roadmate アプリを開いて手動でログインしてください。",
      errorTitle: "認証を完了できませんでした。",
      errorBody: (message: string) => `Supabase の応答: ${message}`,
    },
    config: {
      badgeCaption: "MVP Supabase 接続",
      eyebrow: "設定が必要です",
      title: "この MVP を新しい Supabase プロジェクトに接続してください。",
      body: "`rodemate_mvp/.env` にプロジェクト URL と anon key を追加して、Expo を再起動してください。",
      missingEnvTitle: "Supabase 環境変数がありません",
      missingEnvBody: "`.env` を作成または更新して、下の 2 つの公開値を設定してください。",
      hint: "これらの値を設定すると、このログイン画面は以前のローカル専用モックではなく実際の Supabase Auth を使います。",
    },
    common: {
      back: "戻る",
      cancel: "キャンセル",
      guest: "ゲスト",
      role: "役割",
      home: "ホーム",
      saved: "保存",
      myPage: "マイページ",
      regular: "定期",
      notices: "お知らせ",
      oneTime: "単発",
      note: "メモ",
      edit: "編集",
      delete: "削除",
      driver: "ドライバー",
      rider: "ライダー",
      state: "州",
      allStates: "すべての州",
      from: "出発地",
      to: "到着地",
      searchResults: "検索結果",
      anyOrigin: "出発地指定なし",
      anyDestination: "到着地指定なし",
      seats: "座席",
      visibility: "公開範囲",
      public: "公開",
      private: "非公開",
      additionalDetails: "追加情報",
      loadMoreResults: "結果をもっと見る",
      rideDetails: "ライド詳細",
      vehicle: "車両",
      phone: "電話番号",
      email: "メール",
      name: "名前",
      carNote: "車両メモ",
      accountSummary: "アカウント概要",
      accountManagement: "アカウント管理",
      changeLanguage: "アプリ言語",
      settings: "設定",
      dateTbd: "日付未定",
      today: "今日",
      tomorrow: "明日",
      past: "終了",
      recently: "最近",
      me: "自分",
    },
    auth: {
      getStarted: "Roadmate を始める",
      emailEnabled: "このビルドではメールサインインが有効です。",
      continueWithEmail: "メールで続ける",
      continueWithProvider: (providerLabel: string) => `${providerLabel} で続ける`,
      openingProvider: (providerLabel: string) => `${providerLabel} を開いています...`,
      emailSignInTitle: "メールログイン",
      emailSignUpTitle: "メール登録",
      signIn: "ログイン",
      signUp: "登録",
      signOut: "ログアウト",
      entrySubtitleSignIn:
        "メールでログインして、ライドを探したり投稿したりできます。",
      entrySubtitleSignUp:
        "メールでアカウントを作成して Roadmate を始めましょう。",
      emailPlaceholder: "メールアドレス",
      passwordLabel: "パスワード",
      newPasswordLabel: "新しいパスワード",
      passwordPlaceholder: "パスワード（6文字以上）",
      passwordConfirmLabel: "パスワード確認",
      passwordConfirmPlaceholder: "パスワードをもう一度入力",
      forgotPassword: "パスワードをお忘れですか？",
      resetPassword: "パスワードを再設定",
      passwordRecoveryTitle: "パスワードを再設定",
      passwordRecoverySubtitle:
        "新しいパスワードを設定して、Roadmate アカウントの復旧を完了してください。",
      passwordResetRequestTitle: "パスワード再設定",
      passwordResetRequestSubtitle:
        "まずこのメールアドレスが登録済みか確認してから、再設定メールを送信します。",
      checkRegisteredEmail: "登録済みメールを確認",
      registeredEmailConfirmed: "このメールアドレスは登録済みです。",
      unregisteredEmail: "このメールアドレスは登録されていません。",
      sendPasswordResetEmail: "パスワード再設定メールを送る",
      passwordResetEmailSentEyebrow: "再設定メールを送信しました",
      passwordResetEmailSentSubtitle:
        "最新のメールを開いて認証を完了し、その後 Roadmate に戻ってください。",
      passwordResetVerifiedEyebrow: "認証完了",
      passwordResetVerifiedTitle: "パスワードを変更できます。",
      passwordResetVerifiedSubtitle:
        "この端末で再設定リンクの確認が完了しました。続けて新しいパスワードを入力してください。",
      continueToPasswordChange: "パスワードを変更する",
      changePassword: "パスワードを変更する",
      passwordResetResendCountdown: (remaining: string) =>
        `${remaining} 後に再送できます`,
      passwordResetRequestHint:
        "登録済みのメールアドレスにのみ、パスワード再設定メールを送信できます。",
      checkEmailDuplicate: "メール重複を確認",
      emailAvailable: "このメールアドレスは使用できます。",
      emailAlreadyRegistered: "このメールアドレスはすでに登録されています。",
      working: "処理中...",
      switchHint: "アカウントがありませんか？ 登録に切り替えてください。",
      verificationHint: "登録後にメール認証が必要になる場合があります。",
      createAccountWithEmail: "メールでアカウント作成",
    },
    community: {
      regularRegistration: "定期登録",
      oneTimeRegistration: "単発登録",
      searchNotices: "お知らせを検索",
      searchRides: "ライドを検索",
      pastNoticesHidden: (count: number) => `過去のお知らせ ${count} 件は非表示です。`,
      upcoming: "予定",
      allNotices: "すべてのお知らせ",
      savedRidesTitle: "保存したライド",
      savedOnlyInRiderMode: "保存機能はライダーモードでのみ利用できます。",
      totalSaved: (count: number) => `保存数: ${count}`,
      savedRecent: "保存順",
      noticeRecent: "お知らせ新着順",
      noSavedRides: "まだ保存したライドはありません。",
      chooseSearchPrompt: (isNotice: boolean) =>
        isNotice
          ? "州を選ぶか、出発地と到着地の両方を入力してお知らせを検索してください。"
          : "州を選ぶか、出発地と到着地の両方を入力してライドを検索してください。",
      tapSearchPrompt: (isNotice: boolean) =>
        isNotice ? "検索を押してお知らせを表示します。" : "検索を押してライドを表示します。",
      pastOnlyPrompt: "この条件では過去のお知らせのみ一致しています。",
      noNoticesMatch: "この条件に一致するお知らせはありません。",
      noRidesMatch: "この条件に一致するライドはありません。",
      accountSummaryName: (value: string) => `名前: ${value}`,
      accountSummaryEmail: (value: string) => `メール: ${value}`,
      accountSummaryRole: (value: string) => `役割: ${value}`,
      accountSummaryRoutes: (count: number) => `自分のルート: ${count}`,
      driverProfileStatus: "ドライバープロフィール状態",
      riderModeActive: "現在はライダーモードです。",
      driverProfileReady: "ドライバープロフィールは投稿可能です。",
      driverProfileMissingContact:
        "ドライバープロフィールは保存済みですが、連絡手段がありません。",
      driverProfileIncomplete: "ドライバープロフィールはまだ未完成です。",
      switchToDriver:
        "車両プロフィールを管理するにはドライバーモードへ切り替えてください。",
      registerVehicleFirst:
        "定期または単発ルートを投稿する前に、車両情報と連絡先を登録してください。",
      vehicleRow: (model: string, plate: string) => `車両: ${model} · ${plate}`,
      phoneRow: (value: string) => `電話: ${value}`,
      addContactMethod:
        "ライダーが連絡できるように電話番号またはチャットリンク（WhatsApp/Kakao/Telegram）を追加してください。",
      carNoteRow: (value: string) => `車両メモ: ${value}`,
      accountManagementSignedIn:
        "ログアウトではアカウントは残ります。コミュニティを退出すると公開投稿とドライバープロフィールが削除され、その後ログアウトします。",
      accountManagementGuest:
        "現在はゲスト閲覧中です。ライド保存やドライバー登録をするにはアカウントを作成してください。",
      guestMyPageMessage:
        "現在はゲストとして Roadmate を閲覧しています。登録すると保存機能とドライバーモードを利用できます。",
      settingsDescription: "言語とアカウント設定をまとめて管理できます。",
      settingsLanguageDescription: "アプリ全体で使用する言語を選択してください。",
      openSettings: "設定を開く",
      confirmSignOutPrompt: "もう一度押すとログアウトします。",
      confirmSignOut: "ログアウトを確認",
      cancelSignOut: "ログアウトを取消",
      confirmLeavePrompt: "もう一度押すとコミュニティを退出します。",
      confirmLeave: "退出を確認",
      leaveCommunity: "コミュニティを退出",
      cancelLeaving: "退出を取消",
      myCar: "自分の車",
      driverRegistration: "ドライバー登録",
      driverGarageFilled:
        "ドライバープロフィールは 1 つだけです。車両情報と連絡先は定期・単発投稿に自動適用されます。",
      driverGarageEmpty:
        "ドライバーモードを使う前に、車両と連絡先プロフィールを先に登録してください。",
      carModel: "車種",
      plateNumber: "ナンバープレート",
      contactPhone: "連絡先電話番号",
      chatLink: "チャットリンク (WhatsApp/Kakao/Telegram)",
      saveVehicle: "車両を保存",
      completeRegistration: "登録を完了",
      routeNotRegistered: "未登録",
      driverDraftReady:
        "下書きの準備ができています。登録を保存するとライダーに公開されます。",
      driverDraftStarted:
        "下書きが始まっています。必須項目を埋めてから保存してください。",
      driverNoActiveOneTimeNotice:
        "現在アクティブな単発のお知らせはありません。ライダーに公開したいときに新しいお知らせを登録できます。",
      driverNoRegistration:
        "まだ登録情報がありません。一度登録するとライダーがこのルートを見つけられます。",
      missingPreview: (labels: string[], remainingCount: number) =>
        `不足: ${labels.join(", ")}${remainingCount > 0 ? ` 他 ${remainingCount}` : ""}`,
      reviewAndSave: "確認して保存",
      continueDraft: "下書きを続ける",
      registerNow: "今すぐ登録",
      postingOneTimeNotice: "単発のお知らせを投稿中...",
      savingRegistration: "登録を保存中...",
      postOneTimeNotice: "単発のお知らせを投稿",
      saveRegistration: "登録を保存",
      viewPreviousNotices: "過去のお知らせを見る",
      hidePreviousNotices: "過去のお知らせを閉じる",
      previousNotices: "過去のお知らせ",
      previousNoticesDescription: "期間で過去のお知らせを絞り込めます。",
      previousNoticesAll: "すべて",
      previousNotices30Days: "30日",
      previousNotices90Days: "90日",
      previousNotices365Days: "1年",
      noPreviousNoticesInRange: "この期間に該当する過去のお知らせはありません。",
      oneTimeComposerTitle: "単発のお知らせ",
      oneTimeComposerDescription:
        "これからの1回分の移動予定を共有します。ライダーには現在のアクティブなお知らせだけが表示されます。",
      regularComposerTitle: "定期ルート",
      regularComposerDescription:
        "繰り返し使うルートを一度登録し、座席数や運行曜日、公開設定をあとから調整できます。",
      routeSectionTitle: "ルート",
      routeSectionDescription:
        "ライダーが最初に見る出発地と到着地を設定してください。",
      scheduleSectionTitle: "スケジュール",
      scheduleSectionDescription:
        "この単発のお知らせに合わせて日付、移動タイプ、時間を選んでください。",
      regularScheduleSectionDescription:
        "定期ルートでライダーに伝えたい出発・到着時刻を設定してください。",
      regularSettingsSectionTitle: "ドライバー設定",
      regularSettingsSectionDescription:
        "座席数、運行曜日、連絡先の上書き、公開範囲をまとめて調整できます。",
      noteSectionTitle: "追加メモ",
      oneTimeNoteDescription: "任意: 乗車場所や補足案内があればここに書いておけます。",
      regularNoteDescription:
        "任意: 毎回共通で伝えたい乗車場所や補足案内があれば書いておけます。",
      saveNoticeSectionTitle: "公開",
      saveNoticeSectionDescription:
        "必須項目を確認してから、このお知らせをライダーに公開します。",
      saveRouteSectionTitle: "保存",
      saveRouteSectionDescription:
        "必須項目がそろったら、このルートを保存してライダーに見つけてもらいましょう。",
      oneTimePublishButtonHint: "公開するとすぐにライダーへ表示されます。",
      regularSaveButtonHint: "保存後でも座席数と公開範囲はすぐ変更できます。",
      driverOverviewStatusActive: "公開中",
      driverOverviewStatusDraft: "下書き",
      driverOverviewStatusEmpty: "未設定",
      driverOverviewRegularHint:
        "定期ルートは、ひと目で信頼できるように整理して最新状態に保つのが効果的です。",
      driverOverviewOneTimeHint:
        "ライダーには現在のアクティブなお知らせ1件だけが表示されるため、今回の移動予定が明確に伝わります。",
      driverOverviewPreviousCount: (count: number) => `過去 ${count} 件`,
      driverOverviewMissingCount: (count: number) => `残り ${count} 件`,
      completeRequiredItems: (count: number) => `必須項目を ${count} 件完了`,
      fillRequiredOneTime:
        "この単発のお知らせを投稿するには必須項目を入力してください。",
      fillRequiredRegistration:
        "この登録を保存するには必須項目をすべて入力してください。",
      seatsLeft: (count: number) => `残り座席 ${count}`,
      noticeFor: (value: string) => `${value} のお知らせ`,
      rideDetailsSubtitle: (from: string, to: string) => `${from} -> ${to}`,
      fromMyDriverProfile: "自分のドライバープロフィールから",
      ownerDriver: "ドライバー",
      ownerVehicle: "車両",
      stateDefault: "すべての州",
      noticeHiddenByScope: (count: number) => `過去のお知らせ ${count} 件は非表示です。`,
      searchScopeSummary: (fromLabel: string, toLabel: string) => `${fromLabel} → ${toLabel}`,
    },
    tripTypes: {
      roundTrip: "往復",
      oneWay: "片道",
    },
    reasons: {
      driverRegistration: "ドライバー登録",
      routePosting: "ルート投稿",
      savingRides: "ライド保存",
      updatingRouteSettings: "ルート設定更新",
      driverMode: "ドライバーモード",
      accountAccess: "アカウントアクセス",
    },
    notices: {
      accountRequired: (reason: string) =>
        `${reason}にはアカウントが必要です。メールを確認し、パスワードを設定してから続けてください。`,
      supabaseNotConfigured:
        "Supabase はまだ設定されていません。まず `.env` に MVP プロジェクトの値を追加してください。",
      signInSuccess: "ログインしました。",
      signUpAndIn: (value: string) => `${value} として登録およびログインしました。`,
      signUpComplete:
        "登録が完了しました。メールを確認してアカウントを認証し、その後ログインしてください。",
      authFailed: (action: string, message: string) => `${action}に失敗しました: ${message}`,
      signInEmailNotRegistered: (email: string) =>
        `${email} は登録されていません。メールアドレスを確認するか、先にアカウントを作成してください。`,
      signInWrongPassword: (email: string) =>
        `${email} のアカウントは存在しますが、パスワードが正しくありません。もう一度入力するか、パスワードを再設定してください。`,
      signInInvalidCredentials: (email: string) =>
        `${email} でログインできません。メールアドレスまたはパスワードが正しくありません。`,
      signInRateLimited:
        "ログイン試行が多すぎます。数分待ってからもう一度お試しください。",
      signInNetworkFailed:
        "認証サーバーに接続できませんでした。通信環境を確認してからもう一度お試しください。",
      emailVerifiedAndSignedIn: "メール認証が完了し、ログインしました。",
      authenticationCouldNotBeCompleted: (message: string) =>
        `認証を完了できませんでした: ${message}`,
      verificationEmailSent: (email: string) =>
        `${email} に確認メールを送りました。メール内の確認ページを完了したあと、Roadmate に戻ってログインしてください。`,
      emailVerificationStillNeeded: (email: string) =>
        `このアカウントはまだメール認証が必要です。${email} に送られたメールを開いてから Roadmate に戻ってください。`,
      enterEmailBeforeResendingVerification:
        "確認メールを再送するには、先にメールアドレスを入力してください。",
      verificationEmailResent: (email: string) =>
        `${email} に新しい確認メールを送りました。`,
      verificationEmailResendFailed: (message: string) =>
        `確認メールを再送できませんでした: ${message}`,
      enterEmailBeforePasswordReset:
        "パスワード再設定メールを送るには、先にメールアドレスを入力してください。",
      passwordResetEmailSent: (email: string) =>
        `${email} にパスワード再設定メールを送りました。この端末でそのリンクを開いて新しいパスワードを設定してください。`,
      passwordResetReady:
        "パスワード再設定の認証が確認されました。新しいパスワードを入力して完了してください。",
      passwordResetComplete: "パスワードを更新しました。",
      passwordResetFailed: (message: string) => `パスワード再設定に失敗しました: ${message}`,
      passwordResetEmailCheckFailed: (message: string) =>
        `このメールアドレスが登録済みか確認できませんでした: ${message}`,
      passwordResetEmailNotRegistered: (email: string) =>
        `${email} は登録されていません。このメールアドレスではパスワード再設定はできません。`,
      duplicateEmailFound: (email: string) =>
        `${email} はすでに登録されています。代わりにログインしてください。`,
      emailAvailableForSignUp: (email: string) =>
        `${email} は登録に使用できます。`,
      emailDuplicateCheckUnavailable:
        "最新の Supabase マイグレーションが適用されるまで、メール重複確認は利用できません。",
      duplicateCheckFailed: (message: string) =>
        `メール重複確認に失敗しました: ${message}`,
      signedOut: "ログアウトしました。",
      oauthCanceled: (providerLabel: string) => `${providerLabel} ログインはキャンセルされました。`,
      oauthMissingAuthorizationUrl: "OAuth を開始できません。認証 URL がありません。",
      oauthMissingSessionTokens:
        "OAuth コールバックにセッショントークンが含まれていません。Supabase の redirect URL 設定を確認してください。",
      oauthSuccess: (providerLabel: string) => `${providerLabel} でログインしました。`,
      driverRegistrationFirst:
        "先にドライバー登録を完了してください。車種とナンバープレートを保存する必要があります。",
      signInBeforeLeaving: "コミュニティを退出する前にログインしてください。",
      leaveCommunitySuccess: "コミュニティプロフィールを削除してログアウトしました。",
      leaveCommunityFailed: (message: string) => `コミュニティ退出に失敗しました: ${message}`,
      signInBeforePosting: "ルートを投稿する前にログインしてください。",
      saveVehicleInfoFirst: "先に車両情報を保存してください。",
      localDbSyncFailed: (message: string) =>
        `DB 同期に失敗しました。この端末のみに保存されました。(${message})`,
      oneTimeNoticeUpdated: "単発のお知らせが更新され、ライダーに共有されました。",
      oneTimeNoticePosted: "単発のお知らせが投稿され、ライダーに共有されました。",
      registrationUpdated: (kindLabel: string) => `${kindLabel} 登録が更新され、ライダーに共有されました。`,
      registrationSaved: (kindLabel: string) => `${kindLabel} 登録が保存され、ライダーに共有されました。`,
      routeDeleteFailed: (message: string) =>
        `DB でルート削除に失敗しました。ローカル一覧のみ更新されました。(${message})`,
      routeRemoved: "ルートを削除しました。",
      signInBeforeSavingRides: "ライドを保存する前にログインしてください。",
      saveRegistrationBeforeSettings:
        "座席数や公開設定を変更する前に、まず登録を保存してください。",
      routeUpdateFailed: (message: string) =>
        `DB でルート更新に失敗しました。ローカル値のみ更新されました。(${message})`,
      routeQuickSettingsSaveFailed: (message: string) =>
        `ルートのクイック設定をローカルに保存できませんでした。(${message})`,
      signInBeforeSavingVehicle: "車両を保存する前にログインしてください。",
      vehicleModelAndPlateRequired: "ドライバーには最低でも車種とナンバープレートが必要です。",
      driverProfileSaved: "ドライバープロフィールを保存しました。",
    },
    validation: {
      validEmail: "有効なメールアドレスを入力してください。",
      passwordLength: "パスワードは 6 文字以上である必要があります。",
      passwordConfirmMismatch: "パスワードが一致しません。",
    },
    alerts: {
      leaveCommunityTitle: "コミュニティを退出しますか？",
      leaveCommunityBody:
        "ルート投稿とドライバープロフィールが削除され、コミュニティアクセスが無効になった後にログアウトします。",
      leaveCommunityAction: "退出",
    },
    weekdays: {
      Mon: "月",
      Tue: "火",
      Wed: "水",
      Thu: "木",
      Fri: "金",
      Sat: "土",
      Sun: "日",
    },
  },
  zh: {
    meta: {
      language: "zh",
      locale: "zh-CN",
    },
    languageSelection: {
      eyebrow: "Roadmate 初始设置",
      title: "请选择应用语言",
      body: "请选择首次使用的语言。之后可以在我的页面中再次修改。",
      continue: "继续",
    },
    loading: {
      title: "正在加载 Roadmate...",
    },
    authComplete: {
      eyebrow: "验证完成",
      title: "你的邮箱已验证完成。",
      mobileBody: "请回到这台手机上的 Roadmate 继续操作。",
      desktopBody:
        "该邮箱已完成验证。请在手机上打开 Roadmate，并使用同一个邮箱登录后继续。",
      nextTitle: "下一步",
      nextBodyMobile:
        "点击下面按钮重新打开 Roadmate。如果没有反应，请手动回到应用。",
      nextBodyDesktop:
        "桌面浏览器无法自动继续进入移动应用。",
      openApp: "打开 Roadmate",
      mobileHint:
        "如果应用没有自动打开，请手动回到 Roadmate，并使用同一个邮箱重新登录。",
      desktopHint:
        "如果你是在电脑上完成验证，请在手机上打开 Roadmate 应用并手动登录。",
      errorTitle: "无法完成身份验证。",
      errorBody: (message: string) => `Supabase 返回：${message}`,
    },
    config: {
      badgeCaption: "MVP Supabase 连接",
      eyebrow: "需要配置",
      title: "请将此 MVP 连接到新的 Supabase 项目。",
      body: "把项目 URL 和 anon key 添加到 `rodemate_mvp/.env`，然后重新启动 Expo。",
      missingEnvTitle: "缺少 Supabase 环境变量",
      missingEnvBody: "请创建或更新 `.env`，并填写下面两个公开值。",
      hint: "设置完成后，此登录页将使用真实的 Supabase Auth，而不是之前的本地 mock。",
    },
    common: {
      back: "返回",
      cancel: "取消",
      guest: "游客",
      role: "角色",
      home: "首页",
      saved: "已保存",
      myPage: "我的",
      regular: "固定",
      notices: "通知",
      oneTime: "单次",
      note: "备注",
      edit: "编辑",
      delete: "删除",
      driver: "司机",
      rider: "乘客",
      state: "州",
      allStates: "所有州",
      from: "出发地",
      to: "目的地",
      searchResults: "搜索结果",
      anyOrigin: "任意出发地",
      anyDestination: "任意目的地",
      seats: "座位",
      visibility: "可见范围",
      public: "公开",
      private: "私密",
      additionalDetails: "附加说明",
      loadMoreResults: "加载更多结果",
      rideDetails: "行程详情",
      vehicle: "车辆",
      phone: "电话",
      email: "邮箱",
      name: "姓名",
      carNote: "车辆备注",
      accountSummary: "账号概览",
      accountManagement: "账号管理",
      changeLanguage: "应用语言",
      settings: "设置",
      dateTbd: "日期待定",
      today: "今天",
      tomorrow: "明天",
      past: "已过期",
      recently: "最近",
      me: "我",
    },
    auth: {
      getStarted: "开始使用 Roadmate",
      emailEnabled: "此版本已启用邮箱登录。",
      continueWithEmail: "使用邮箱继续",
      continueWithProvider: (providerLabel: string) => `使用 ${providerLabel} 继续`,
      openingProvider: (providerLabel: string) => `正在打开 ${providerLabel}...`,
      emailSignInTitle: "邮箱登录",
      emailSignUpTitle: "邮箱注册",
      signIn: "登录",
      signUp: "注册",
      signOut: "退出登录",
      entrySubtitleSignIn: "使用邮箱登录后即可开始搜索和发布行程。",
      entrySubtitleSignUp: "使用邮箱创建账号后即可开始使用 Roadmate。",
      emailPlaceholder: "邮箱",
      passwordLabel: "密码",
      newPasswordLabel: "新密码",
      passwordPlaceholder: "密码（至少 6 位）",
      passwordConfirmLabel: "确认密码",
      passwordConfirmPlaceholder: "请再次输入密码",
      forgotPassword: "忘记密码？",
      resetPassword: "重置密码",
      passwordRecoveryTitle: "重置密码",
      passwordRecoverySubtitle: "设置一个新密码以完成 Roadmate 账号找回。",
      passwordResetRequestTitle: "找回密码",
      passwordResetRequestSubtitle:
        "先确认这个邮箱是否已注册，再发送密码重置邮件。",
      checkRegisteredEmail: "检查已注册邮箱",
      registeredEmailConfirmed: "该邮箱已注册。",
      unregisteredEmail: "该邮箱未注册。",
      sendPasswordResetEmail: "发送密码重置邮件",
      passwordResetEmailSentEyebrow: "重置邮件已发送",
      passwordResetEmailSentSubtitle:
        "请打开最新收到的邮件完成验证，然后再返回 Roadmate。",
      passwordResetVerifiedEyebrow: "验证完成",
      passwordResetVerifiedTitle: "现在可以修改密码了。",
      passwordResetVerifiedSubtitle:
        "该重置链接已在此设备上验证完成。继续输入新密码即可。",
      continueToPasswordChange: "去修改密码",
      changePassword: "修改密码",
      passwordResetResendCountdown: (remaining: string) =>
        `${remaining} 后可重新发送`,
      passwordResetRequestHint:
        "只有已注册的邮箱地址才能收到密码重置邮件。",
      checkEmailDuplicate: "检查邮箱是否重复",
      emailAvailable: "该邮箱可以使用。",
      emailAlreadyRegistered: "该邮箱已被注册。",
      working: "处理中...",
      switchHint: "还没有账号？切换到注册。",
      verificationHint: "注册后可能需要进行邮箱验证。",
      createAccountWithEmail: "用邮箱创建账号",
    },
    community: {
      regularRegistration: "固定行程登记",
      oneTimeRegistration: "单次行程登记",
      searchNotices: "搜索通知",
      searchRides: "搜索行程",
      pastNoticesHidden: (count: number) => `已隐藏 ${count} 条过期通知。`,
      upcoming: "即将到来",
      allNotices: "全部通知",
      savedRidesTitle: "已保存行程",
      savedOnlyInRiderMode: "保存功能仅在乘客模式下可用。",
      totalSaved: (count: number) => `已保存总数：${count}`,
      savedRecent: "按最近保存",
      noticeRecent: "按通知时间",
      noSavedRides: "还没有保存的行程。",
      chooseSearchPrompt: (isNotice: boolean) =>
        isNotice
          ? "请选择州，或同时填写出发地和目的地以搜索通知。"
          : "请选择州，或同时填写出发地和目的地以搜索行程。",
      tapSearchPrompt: (isNotice: boolean) =>
        isNotice ? "点击搜索以查看通知。" : "点击搜索以查看行程。",
      pastOnlyPrompt: "当前筛选或搜索仅匹配到已过期通知。",
      noNoticesMatch: "没有通知符合当前筛选或搜索。",
      noRidesMatch: "没有行程符合当前筛选或搜索。",
      accountSummaryName: (value: string) => `姓名：${value}`,
      accountSummaryEmail: (value: string) => `邮箱：${value}`,
      accountSummaryRole: (value: string) => `角色：${value}`,
      accountSummaryRoutes: (count: number) => `我的路线：${count}`,
      driverProfileStatus: "司机资料状态",
      riderModeActive: "当前为乘客模式。",
      driverProfileReady: "司机资料已可用于发布。",
      driverProfileMissingContact: "司机资料已保存，但缺少联系方式。",
      driverProfileIncomplete: "司机资料尚未完成。",
      switchToDriver: "切换到司机模式后即可管理车辆资料。",
      registerVehicleFirst:
        "发布固定或单次路线前，请先登记车辆信息和联系方式。",
      vehicleRow: (model: string, plate: string) => `车辆：${model} · ${plate}`,
      phoneRow: (value: string) => `电话：${value}`,
      addContactMethod:
        "请添加电话或聊天链接（WhatsApp/Kakao/Telegram），方便乘客联系你。",
      carNoteRow: (value: string) => `车辆备注：${value}`,
      accountManagementSignedIn:
        "退出登录会保留账号。离开社区会删除公开帖子和司机资料，然后退出登录。",
      accountManagementGuest:
        "你当前以游客身份浏览。创建账号后即可保存行程并注册为司机。",
      guestMyPageMessage:
        "你当前正以游客身份浏览 Roadmate。注册后即可使用保存功能并切换到司机模式。",
      settingsDescription: "在一个地方集中管理语言和账号选项。",
      settingsLanguageDescription: "选择整个应用中使用的语言。",
      openSettings: "打开设置",
      confirmSignOutPrompt: "再次点击即可确认退出登录。",
      confirmSignOut: "确认退出登录",
      cancelSignOut: "取消退出",
      confirmLeavePrompt: "再次点击即可确认离开社区。",
      confirmLeave: "确认离开社区",
      leaveCommunity: "离开社区",
      cancelLeaving: "取消离开",
      myCar: "我的车辆",
      driverRegistration: "司机注册",
      driverGarageFilled:
        "司机资料仅保留一份。车辆和联系信息会自动应用到固定和单次发布中。",
      driverGarageEmpty:
        "使用司机模式前，请先登记车辆和联系资料。",
      carModel: "车型",
      plateNumber: "车牌号",
      contactPhone: "联系电话",
      chatLink: "聊天链接 (WhatsApp/Kakao/Telegram)",
      saveVehicle: "保存车辆",
      completeRegistration: "完成注册",
      routeNotRegistered: "尚未登记",
      driverDraftReady: "草稿已准备好。保存登记后即可向乘客发布此路线。",
      driverDraftStarted: "草稿已开始。请补全必填项后再保存登记。",
      driverNoActiveOneTimeNotice:
        "当前没有处于激活状态的单次通知。需要发布给乘客时，可以重新登记一条新通知。",
      driverNoRegistration:
        "目前还没有登记信息。完成一次登记后，乘客就能发现你的路线。",
      missingPreview: (labels: string[], remainingCount: number) =>
        `缺少：${labels.join("、")}${remainingCount > 0 ? ` 等 ${remainingCount} 项` : ""}`,
      reviewAndSave: "检查并保存",
      continueDraft: "继续草稿",
      registerNow: "立即登记",
      postingOneTimeNotice: "正在发布单次通知...",
      savingRegistration: "正在保存登记...",
      postOneTimeNotice: "发布单次通知",
      saveRegistration: "保存登记",
      viewPreviousNotices: "查看过往通知",
      hidePreviousNotices: "收起过往通知",
      previousNotices: "过往通知",
      previousNoticesDescription: "可以按时间范围筛选过往通知。",
      previousNoticesAll: "全部",
      previousNotices30Days: "30天",
      previousNotices90Days: "90天",
      previousNotices365Days: "1年",
      noPreviousNoticesInRange: "该时间范围内没有过往通知。",
      oneTimeComposerTitle: "单次通知",
      oneTimeComposerDescription:
        "发布一次即将发生的行程计划。乘客只会看到你当前处于激活状态的通知。",
      regularComposerTitle: "固定路线",
      regularComposerDescription:
        "把重复路线先登记好，之后可随时调整座位数、运行日期和可见范围。",
      routeSectionTitle: "路线",
      routeSectionDescription: "整理好乘客最先看到的出发地和目的地。",
      scheduleSectionTitle: "时间安排",
      scheduleSectionDescription: "为这条单次通知设置日期、行程方式和时间。",
      regularScheduleSectionDescription:
        "设置这条固定路线的出发和到达时间，让乘客更容易理解。",
      regularSettingsSectionTitle: "司机设置",
      regularSettingsSectionDescription:
        "在这里统一调整座位数、运行日期、联系方式覆盖和公开范围。",
      noteSectionTitle: "补充说明",
      oneTimeNoteDescription: "可选：如果有上车地点或补充说明，可以写在这里。",
      regularNoteDescription:
        "可选：如果每次都要提醒乘客的上车点或说明，可以写在这里。",
      saveNoticeSectionTitle: "发布",
      saveNoticeSectionDescription: "确认必填项后，再将这条通知发布给乘客。",
      saveRouteSectionTitle: "保存",
      saveRouteSectionDescription:
        "确认必填项已完成后，保存这条路线，让乘客可以搜索到你。",
      oneTimePublishButtonHint: "发布后会立即展示给乘客。",
      regularSaveButtonHint: "保存后也能随时调整座位和公开范围。",
      driverOverviewStatusActive: "进行中",
      driverOverviewStatusDraft: "草稿",
      driverOverviewStatusEmpty: "未设置",
      driverOverviewRegularHint:
        "固定路线保持简洁、清晰、最新，乘客会更容易建立信任感。",
      driverOverviewOneTimeHint:
        "乘客一次只会看到你当前激活的通知，因此当前行程会更清晰。",
      driverOverviewPreviousCount: (count: number) => `历史 ${count} 条`,
      driverOverviewMissingCount: (count: number) => `还差 ${count} 项`,
      completeRequiredItems: (count: number) => `完成 ${count} 项必填内容`,
      fillRequiredOneTime: "请填写必填项后再发布这条单次通知。",
      fillRequiredRegistration: "请填写所有必填项后再保存登记。",
      seatsLeft: (count: number) => `剩余座位 ${count}`,
      noticeFor: (value: string) => `${value} 的通知`,
      rideDetailsSubtitle: (from: string, to: string) => `${from} -> ${to}`,
      fromMyDriverProfile: "来自我的司机资料",
      ownerDriver: "司机",
      ownerVehicle: "车辆",
      stateDefault: "所有州",
      noticeHiddenByScope: (count: number) => `已隐藏 ${count} 条过期通知。`,
      searchScopeSummary: (fromLabel: string, toLabel: string) => `${fromLabel} → ${toLabel}`,
    },
    tripTypes: {
      roundTrip: "往返",
      oneWay: "单程",
    },
    reasons: {
      driverRegistration: "司机注册",
      routePosting: "发布路线",
      savingRides: "保存行程",
      updatingRouteSettings: "更新路线设置",
      driverMode: "司机模式",
      accountAccess: "访问账号",
    },
    notices: {
      accountRequired: (reason: string) =>
        `${reason}需要账号。请先验证邮箱并设置密码后再继续。`,
      supabaseNotConfigured:
        "Supabase 尚未配置。请先把 MVP 项目的值添加到 `.env` 中。",
      signInSuccess: "登录成功。",
      signUpAndIn: (value: string) => `已完成注册并以 ${value} 登录。`,
      signUpComplete: "注册完成。请先查看邮箱完成验证，然后再登录。",
      authFailed: (action: string, message: string) => `${action}失败：${message}`,
      signInEmailNotRegistered: (email: string) =>
        `${email} 尚未注册。请检查邮箱地址，或先创建账号。`,
      signInWrongPassword: (email: string) =>
        `${email} 已注册，但密码不正确。请重试，或使用找回密码重置。`,
      signInInvalidCredentials: (email: string) =>
        `无法使用 ${email} 登录。邮箱或密码不正确。`,
      signInRateLimited: "登录尝试次数过多。请等待几分钟后再试。",
      signInNetworkFailed:
        "Roadmate 无法连接认证服务器。请检查网络后重试。",
      emailVerifiedAndSignedIn: "邮箱已验证，现在已登录。",
      authenticationCouldNotBeCompleted: (message: string) => `无法完成身份验证：${message}`,
      verificationEmailSent: (email: string) =>
        `验证邮件已发送到 ${email}。请先完成邮件中的确认页面，然后返回 Roadmate 再登录。`,
      emailVerificationStillNeeded: (email: string) =>
        `该账号仍需进行邮箱验证。请打开发送到 ${email} 的邮件，然后再返回 Roadmate。`,
      enterEmailBeforeResendingVerification: "请先输入邮箱地址，再重新发送验证邮件。",
      verificationEmailResent: (email: string) => `新的验证邮件已发送到 ${email}。`,
      verificationEmailResendFailed: (message: string) =>
        `无法重新发送验证邮件：${message}`,
      enterEmailBeforePasswordReset: "请先输入邮箱地址，再发送密码重置邮件。",
      passwordResetEmailSent: (email: string) =>
        `密码重置邮件已发送到 ${email}。请在这台设备上打开邮件中的链接并设置新密码。`,
      passwordResetReady: "密码重置验证已完成。请输入新密码以继续。",
      passwordResetComplete: "密码已更新。",
      passwordResetFailed: (message: string) => `密码重置失败：${message}`,
      passwordResetEmailCheckFailed: (message: string) =>
        `无法确认该邮箱是否已注册：${message}`,
      passwordResetEmailNotRegistered: (email: string) =>
        `${email} 尚未注册，无法为这个邮箱找回密码。`,
      duplicateEmailFound: (email: string) => `${email} 已经注册，请直接登录。`,
      emailAvailableForSignUp: (email: string) => `${email} 可用于注册。`,
      emailDuplicateCheckUnavailable:
        "在应用最新的 Supabase migration 之前，暂时无法检查邮箱是否重复。",
      duplicateCheckFailed: (message: string) => `无法检查邮箱是否可用：${message}`,
      signedOut: "已退出登录。",
      oauthCanceled: (providerLabel: string) => `${providerLabel} 登录已取消。`,
      oauthMissingAuthorizationUrl: "无法启动 OAuth 流程，缺少授权 URL。",
      oauthMissingSessionTokens:
        "OAuth 回调中没有会话令牌。请检查 Supabase provider 的 redirect URL 设置。",
      oauthSuccess: (providerLabel: string) => `已使用 ${providerLabel} 登录。`,
      driverRegistrationFirst:
        "请先完成司机注册：保存车型和车牌号。",
      signInBeforeLeaving: "离开社区前请先登录。",
      leaveCommunitySuccess: "社区资料已清理并已退出登录。",
      leaveCommunityFailed: (message: string) => `离开社区失败：${message}`,
      signInBeforePosting: "发布路线前请先登录。",
      saveVehicleInfoFirst: "请先保存车辆信息。",
      localDbSyncFailed: (message: string) =>
        `数据库同步失败，仅保存在当前设备。(${message})`,
      oneTimeNoticeUpdated: "单次通知已更新并分享给乘客。",
      oneTimeNoticePosted: "单次通知已发布并分享给乘客。",
      registrationUpdated: (kindLabel: string) => `${kindLabel}登记已更新并分享给乘客。`,
      registrationSaved: (kindLabel: string) => `${kindLabel}登记已保存并分享给乘客。`,
      routeDeleteFailed: (message: string) =>
        `数据库删除路线失败，仅更新本地列表。(${message})`,
      routeRemoved: "路线已删除。",
      signInBeforeSavingRides: "保存行程前请先登录。",
      saveRegistrationBeforeSettings:
        "修改座位数或可见性前，请先保存登记。",
      routeUpdateFailed: (message: string) =>
        `数据库更新路线失败，仅更新本地值。(${message})`,
      routeQuickSettingsSaveFailed: (message: string) =>
        `无法在本地保存路线快捷设置。(${message})`,
      signInBeforeSavingVehicle: "保存车辆前请先登录。",
      vehicleModelAndPlateRequired: "司机至少需要填写车型和车牌号。",
      driverProfileSaved: "司机资料已保存。",
    },
    validation: {
      validEmail: "请输入有效的邮箱地址。",
      passwordLength: "密码至少需要 6 位。",
      passwordConfirmMismatch: "两次输入的密码不一致。",
    },
    alerts: {
      leaveCommunityTitle: "确定要离开社区吗？",
      leaveCommunityBody:
        "这会删除你的路线帖子和司机资料，将社区访问标记为停用，然后退出登录。",
      leaveCommunityAction: "离开",
    },
    weekdays: {
      Mon: "周一",
      Tue: "周二",
      Wed: "周三",
      Thu: "周四",
      Fri: "周五",
      Sat: "周六",
      Sun: "周日",
    },
  },
} as const;

export type AppCopy = (typeof APP_COPY)[keyof typeof APP_COPY];

export const getAppCopy = (language: AppLanguage): AppCopy => APP_COPY[language] ?? APP_COPY.en;
