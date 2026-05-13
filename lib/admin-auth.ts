import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "guma_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;
const SESSION_TOKEN_PAYLOAD = "guma-support-admin-session";

function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

function getSessionToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;

  return createHmac("sha256", password)
    .update(SESSION_TOKEN_PAYLOAD)
    .digest("hex");
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword() !== null;
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;

  return safeCompare(input, password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = getSessionToken();
  if (!token) return false;

  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!currentToken) return false;

  return safeCompare(currentToken, token);
}

export async function createAdminSession(): Promise<void> {
  const token = getSessionToken();
  if (!token) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
