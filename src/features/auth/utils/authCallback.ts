export type ParsedAuthCallback = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  type: string | null;
  errorMessage: string | null;
};

export function parseAuthCallback(callbackUrl: string): ParsedAuthCallback | null {
  const [baseUrl, hashFragment] = callbackUrl.split("#");
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(hashFragment ?? "");

  const parsedCallback = {
    accessToken: queryParams.get("access_token") ?? fragmentParams.get("access_token"),
    refreshToken: queryParams.get("refresh_token") ?? fragmentParams.get("refresh_token"),
    code: queryParams.get("code") ?? fragmentParams.get("code"),
    type: queryParams.get("type") ?? fragmentParams.get("type"),
    errorMessage:
      queryParams.get("error_description") ??
      fragmentParams.get("error_description") ??
      queryParams.get("error") ??
      fragmentParams.get("error"),
  } satisfies ParsedAuthCallback;

  if (
    !parsedCallback.accessToken &&
    !parsedCallback.refreshToken &&
    !parsedCallback.code &&
    !parsedCallback.type &&
    !parsedCallback.errorMessage
  ) {
    return null;
  }

  return parsedCallback;
}

export function isEmailConfirmationRequiredError(message: string) {
  return /email[^a-z0-9]*(not confirmed|not verified|confirmation|verification required)/i.test(
    message,
  );
}

export function isEmailAlreadyRegisteredError(message: string) {
  return /(already registered|already been registered|email.*exists|user.*exists)/i.test(
    message,
  );
}
