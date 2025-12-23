const CMS_HOME_URL = "https://cms.thesourceofhope.org/wp-json/wp/v2";

export async function fetchContent(endpoint, options = {}) {
  const res = await fetch(`${CMS_HOME_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CMS API Error: ${res.status} – ${text}`);
  }
  return res.json();
}
