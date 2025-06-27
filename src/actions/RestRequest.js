const LOGIN_PATH = "/";

const hostname =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "localhost"
    : window.location.hostname;

const port = process.env.REACT_APP_BACKEND_PORT;
const contextPath = process.env.REACT_APP_CONTEXT_PATH;
export const BASE_URL = `${contextPath}`;

const getAuthToken = () => localStorage.getItem("token");
const getProjectId = () => localStorage.getItem("projectId");
const handleUnauthorized = (response, url) => {
  if (url.includes("login")) {
    return response.json(); // Handle login response
  } else {
    localStorage.removeItem("token");
    window.location.href = LOGIN_PATH;
    throw new Error("Unauthorized");
  }
};

const handleResponse = (response, url) => {
  if (response.status === 401 || response.status === 403) {
    return handleUnauthorized(response, url);
  }

  const contentType = response.headers.get("Content-Type") || "";
  return contentType.includes("text") ? response.text() : response.json();
};

export const RestRequest = (url, method = "GET", body = null) => {
  const projectId = getProjectId();
  const urlWithProjectId =
    projectId && !url.includes("/login") && !url.includes("/projects")
      ? `/${projectId}${url}`
      : url;
  return fetch(`${BASE_URL}${urlWithProjectId}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
    .then((response) => handleResponse(response, url))
    .catch((error) => {
      console.error("API Request Failed:", error);
      throw error;
    });
};
