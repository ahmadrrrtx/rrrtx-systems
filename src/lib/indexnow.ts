import { SITE_URL } from "./site-config";

export async function notifyIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key) || paths.length === 0) return;
  const urls = Array.from(new Set(paths.map((path) => path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`)));
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE_URL).host, key, keyLocation: `${SITE_URL}/indexnow-key.txt`, urlList: urls }),
      cache: "no-store",
    });
    if (!response.ok && response.status !== 202) console.error("IndexNow notification failed", response.status);
  } catch (error) {
    console.error("IndexNow notification failed", error);
  }
}
