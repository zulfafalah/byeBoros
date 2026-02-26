const TOKEN_KEY = "auth_token";
const SPREADSHEET_ID_KEY = "spreadsheet_id";
const SHEET_NAME_KEY = "sheet_name";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface JwtPayload {
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
}

export function getGoogleLoginUrl(): string {
  return `${API_URL}/auth/google/login`;
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getSpreadsheetId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SPREADSHEET_ID_KEY);
}

export function getSheetName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SHEET_NAME_KEY);
}

export function decodeJWT(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  const payload = decodeJWT(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

export function getUserFromToken(): JwtPayload | null {
  const token = getToken();
  return token ? decodeJWT(token) : null;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SPREADSHEET_ID_KEY);
  localStorage.removeItem(SHEET_NAME_KEY);
  window.location.href = "/login";
}

export function handleAuthCallback(): boolean {
  if (typeof window === "undefined") return false;
  const token = new URLSearchParams(window.location.search).get("token");
  if (token) {
    setToken(token);
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
}
