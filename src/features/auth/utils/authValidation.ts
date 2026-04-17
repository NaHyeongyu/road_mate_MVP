import type { AuthMode } from "../types";

type ValidateAuthInputArgs = {
  authMode: AuthMode;
  email: string;
  password: string;
  displayName: string;
};

export const validateAuthInput = ({
  authMode: _authMode,
  email,
  password,
  displayName: _displayName,
}: ValidateAuthInputArgs): string | null => {
  if (!email || !email.includes("@")) {
    return "Please enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
};
