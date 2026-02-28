const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const SPREADSHEET_ID_KEY = "googleSheetId";
const SHEET_NAME_KEY = "sheet_name";

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

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

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeRefreshToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  const accessToken = getToken();
  if (!refreshToken || !accessToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json() as { access_token: string; refresh_token: string };
    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export function getSpreadsheetId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SPREADSHEET_ID_KEY);
}

export function getSheetName(): string {
  return INDONESIAN_MONTHS[new Date().getMonth()];
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
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SPREADSHEET_ID_KEY);
  localStorage.removeItem(SHEET_NAME_KEY);
  window.location.href = "/login";
}

export function handleAuthCallback(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const refreshToken = params.get("refresh_token");
  if (token) {
    setToken(token);
    if (refreshToken) setRefreshToken(refreshToken);
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
}
