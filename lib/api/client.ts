import { ApiError } from "./types";
import { getToken, removeToken, getSpreadsheetId, getSheetName, API_URL, refreshAccessToken } from "../auth";

// Helper to get localized error message
function getLocalizedErrorMessage(key: string): string {
  if (typeof window === "undefined") {
    // Server-side: default to English
    const messages = { spreadsheetNotSet: "Google Sheet link is not set. Please configure it in Profile Settings first." };
    return messages[key as keyof typeof messages] || key;
  }
  
  // Client-side: get locale from cookie
  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1] || "en";

  const messages: Record<string, Record<string, string>> = {
    en: { spreadsheetNotSet: "Google Sheet link is not set. Please configure it in Profile Settings first." },
    id: { spreadsheetNotSet: "Link Google Sheet belum diatur. Silakan konfigurasi di Pengaturan Profil terlebih dahulu." },
  };

  return messages[locale]?.[key] || messages.en[key] || key;
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  /** Extra headers merged with defaults */
  headers?: Record<string, string>;
  /** Skip attaching the Authorization header */
  skipAuth?: boolean;
};

/**
 * Centralized fetch wrapper.
 * - Automatically attaches Bearer token
 * - Serializes JSON body
 * - Throws typed ApiError on non-2xx responses
 * - Redirects to /login on 401
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: extraHeaders, skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  // Attach auth token — if not authenticated, block the request early
  if (!skipAuth) {
    const token = getToken();
    if (!token) {
      throw new ApiError(401, "Not authenticated. Please log in first.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Attach spreadsheet config if not already set
  if (!headers["X-Spreadsheet-ID"]) {
    const sid = getSpreadsheetId();
    if (sid) headers["X-Spreadsheet-ID"] = sid;
  }
  if (!headers["X-Sheet-Name"]) {
    const sn = getSheetName();
    if (sn) headers["X-Sheet-Name"] = sn;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    // Attempt to silently refresh the access token and retry once
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getToken();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (retryResponse.ok) {
        if (retryResponse.status === 204) return undefined as T;
        return retryResponse.json() as Promise<T>;
      }
    }
    removeToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError(401, "Unauthorized");
  }

  // Handle other error responses
  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    if (!getSpreadsheetId()) {
      throw new ApiError(
        response.status,
        getLocalizedErrorMessage("spreadsheetNotSet"),
        errorBody
      );
    }

    throw new ApiError(response.status, `Request failed: ${response.statusText}`, errorBody);
  }

  // Some endpoints may return no body (204)
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ── Convenience methods ──────────────────────────

export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "POST", body });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
