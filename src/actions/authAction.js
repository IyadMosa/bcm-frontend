import { BASE_URL } from "./RestRequest";

export const login_new = async (username, password) => {
  try {
    const res = await fetch(BASE_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      return {
        success: true,
        token: data.token,
        message: data.message || "Login successful",
      };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch {
    return { success: false, message: "Network error, try again" };
  }
};
export const checkUsername = async (username) => {
  try {
    const res = await fetch(BASE_URL + "/api/auth/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) return { available: false };
    const data = await res.json();
    return { available: data.success, message: data.message || "" };
  } catch {
    return { available: false };
  }
};

export const registerUser = async ({ username, password }) => {
  try {
    const res = await fetch(BASE_URL + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: data.success, message: data.message || "" };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Registration failed",
      };
    }
  } catch {
    return { success: false, message: "Registration failed, try again." };
  }
};
