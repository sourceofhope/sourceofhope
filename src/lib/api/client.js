const hostname = window.location.hostname.toLowerCase();

const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

const isDevSite =
  hostname === "dev.thesourceofhope.org" || hostname.startsWith("dev.");

export const API_BASE_URL = isLocal
  ? "http://localhost:3001/api"
  : isDevSite
    ? "https://api.thesourceofhope.org/dev/api"
    : "https://api.thesourceofhope.org/app/api";

export function sanitize(str) {
  return String(str).replace(/[<>]/g, "");
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const url = `${API_BASE_URL}${path}`;
  
  console.log('🌐 API Request:', {
    method,
    url,
    body
  });

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    console.log('📡 Response status:', res.status);

    const contentType = res.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : null;
    
    console.log('📦 Response data:', data);

    if (!res.ok) {
      console.error('❌ Request failed:', data);
      return {
        error: data?.error || "Request failed",
        status: res.status,
      };
    }

    return {
      data,
      status: res.status,
    };
  } catch (err) {
    console.error('❌ Network error:', err);
    return {
      error: "Network error",
      status: 0,
    };
  }
}

export function get(path, queryParams) {
  let fullPath = path;
  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams);
    fullPath = `${path}?${searchParams.toString()}`;
  }
  return apiRequest(fullPath);
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
