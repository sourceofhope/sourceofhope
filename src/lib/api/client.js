const hostname = window.location.hostname;

const API_BASE_URL =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : hostname.includes("dev.")
      ? "https://api.thesourceofhope.org/dev/api"
      : "https://api.thesourceofhope.org/app/api";

export function sanitize(str) {
  return String(str).replace(/[<>]/g, "");
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : null;

    if (!res.ok) {
      return {
        error: data?.error || "Request failed",
        status: res.status,
      };
    }

    return {
      data,
      status: res.status,
    };
  } catch {
    return {
      error: "Network error",
      status: 0,
    };
  }
}

export function get(path) {
  return apiRequest(path);
}

export function post(path, body) {
  return apiRequest(path, {
    method: "POST",
    body,
  });
}

export function put(path, body) {
  return apiRequest(path, {
    method: "PUT",
    body,
  });
}

export function del(path) {
  return apiRequest(path, {
    method: "DELETE",
  });
}
