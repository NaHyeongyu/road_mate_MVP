import type { AppCopy } from "../../../i18n/copy";
import type { AuthMode } from "../types";

type ValidateAuthInputArgs = {
  authMode: AuthMode;
  email: string;
  password: string;
  passwordConfirm?: string;
};

export const validateAuthInput = ({
  authMode,
  email,
  password,
  passwordConfirm,
}: ValidateAuthInputArgs, copy: AppCopy): string | null => {
  if (!email || !email.includes("@")) {
    return copy.validation.validEmail;
  }

  if (password.length < 6) {
    return copy.validation.passwordLength;
  }

  if (authMode === "signUp" && password !== String(passwordConfirm ?? "")) {
    return copy.validation.passwordConfirmMismatch;
  }

  return null;
};
