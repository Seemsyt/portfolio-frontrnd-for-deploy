import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/";

let refreshRequest: Promise<string | null> | null = null;

const normalizeBaseUrl = (baseUrl?: string) => (baseUrl || DEFAULT_API_BASE).replace(/\/+$/, "");

const clearAuthStorage = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.dispatchEvent(new Event("auth-changed"));
};

const ensureLeadingSlash = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const toHeaderRecord = (headers?: AxiosRequestConfig["headers"]) => {
  if (!headers) return {} as Record<string, string>;

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[String(key)] = String(value);
      return acc;
    }, {});
  }

  return { ...(headers as Record<string, string>) };
};

const refreshAccessToken = async (baseUrl?: string): Promise<string | null> => {
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      clearAuthStorage();
      return null;
    }

    try {
      const response = await axios.post(`${normalizeBaseUrl(baseUrl)}/refresh/`, { refresh });
      const newAccess = response?.data?.access;
      const rotatedRefresh = response?.data?.refresh;

      if (!newAccess || typeof newAccess !== "string") {
        throw new Error("Missing refreshed access token.");
      }

      localStorage.setItem("access", newAccess);
      if (typeof rotatedRefresh === "string" && rotatedRefresh) {
        localStorage.setItem("refresh", rotatedRefresh);
      }
      window.dispatchEvent(new Event("auth-changed"));
      return newAccess;
    } catch {
      clearAuthStorage();
      return null;
    } finally {
      refreshRequest = null;
    }
  })();

  return refreshRequest;
};

type AuthenticatedRequestOptions = {
  includeDashboardKey?: boolean;
};

export const authenticatedRequest = async <T = unknown>(
  baseUrl: string,
  config: AxiosRequestConfig,
  options: AuthenticatedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const includeDashboardKey = options.includeDashboardKey ?? false;
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  const makeRequest = async (token?: string | null) => {
    const headers = toHeaderRecord(config.headers);

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      delete headers.Authorization;
    }

    if (includeDashboardKey) {
      const dashboardSecret = localStorage.getItem("dashboard_secret") || "";
      if (dashboardSecret) {
        headers["X-Dashboard-Key"] = dashboardSecret;
      }
    }

    const url = config.url || "";
    const resolvedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${normalizedBaseUrl}${ensureLeadingSlash(url)}`;

    return axios.request<T>({
      ...config,
      url: resolvedUrl,
      headers,
    });
  };

  try {
    return await makeRequest(localStorage.getItem("access"));
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status !== 401) throw error;

    const renewedAccess = await refreshAccessToken(normalizedBaseUrl);
    if (!renewedAccess) throw error;

    return makeRequest(renewedAccess);
  }
};

export const getDashboardAuthHeaders = () => {
  const token = localStorage.getItem("access") || "";
  const dashboardSecret = localStorage.getItem("dashboard_secret") || "";

  return {
    token,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(dashboardSecret ? { "X-Dashboard-Key": dashboardSecret } : {}),
    },
  };
};

export const verifyDashboardAccess = async (baseUrl: string) => {
  const hasAccess = !!localStorage.getItem("access");
  const hasRefresh = !!localStorage.getItem("refresh");

  if (!hasAccess && !hasRefresh) {
    return { allowed: false, reason: "no_token" };
  }

  try {
    await authenticatedRequest(baseUrl, { method: "get", url: "/dashboard-access/" }, { includeDashboardKey: true });
    return { allowed: true, reason: "" };
  } catch {
    return { allowed: false, reason: "forbidden" };
  }
};
