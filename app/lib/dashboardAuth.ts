import axios from "axios";

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
  const { token, headers } = getDashboardAuthHeaders();
  if (!token) {
    return { allowed: false, reason: "no_token" };
  }

  try {
    await axios.get(`${baseUrl}/dashboard-access/`, { headers });
    return { allowed: true, reason: "" };
  } catch {
    return { allowed: false, reason: "forbidden" };
  }
};
