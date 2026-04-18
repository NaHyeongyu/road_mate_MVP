import { describe, expect, it } from "vitest";

import {
  isEmailAlreadyRegisteredError,
  isEmailConfirmationRequiredError,
  parseAuthCallback,
} from "./authCallback";

describe("parseAuthCallback", () => {
  it("reads an auth code from the query string", () => {
    expect(parseAuthCallback("roadmate://auth/callback?code=signup-code-123")).toEqual({
      accessToken: null,
      refreshToken: null,
      code: "signup-code-123",
      type: null,
      errorMessage: null,
    });
  });

  it("reads session tokens from the URL fragment", () => {
    expect(
      parseAuthCallback(
        "roadmate://auth/callback#access_token=access-123&refresh_token=refresh-456",
      ),
    ).toEqual({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      code: null,
      type: null,
      errorMessage: null,
    });
  });

  it("reads auth errors from the callback", () => {
    expect(
      parseAuthCallback("roadmate://auth/callback#error_description=Verification+link+expired"),
    ).toEqual({
      accessToken: null,
      refreshToken: null,
      code: null,
      type: null,
      errorMessage: "Verification link expired",
    });
  });

  it("returns null for unrelated URLs", () => {
    expect(parseAuthCallback("roadmate://community/home")).toBeNull();
  });
});

describe("isEmailConfirmationRequiredError", () => {
  it("detects confirmation-required sign-in errors", () => {
    expect(isEmailConfirmationRequiredError("Email not confirmed")).toBe(true);
    expect(isEmailConfirmationRequiredError("email verification required before sign in")).toBe(
      true,
    );
  });

  it("ignores unrelated auth errors", () => {
    expect(isEmailConfirmationRequiredError("Invalid login credentials")).toBe(false);
  });
});

describe("isEmailAlreadyRegisteredError", () => {
  it("detects duplicate-registration errors", () => {
    expect(isEmailAlreadyRegisteredError("User already registered")).toBe(true);
    expect(isEmailAlreadyRegisteredError("This email already exists")).toBe(true);
  });

  it("ignores unrelated sign-up errors", () => {
    expect(isEmailAlreadyRegisteredError("Password should be at least 6 characters")).toBe(
      false,
    );
  });
});
