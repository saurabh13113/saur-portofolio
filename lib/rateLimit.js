const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

// ponytail: in-memory, per-instance — resets on redeploy/cold start, and each
// serverless instance has its own map. Fine for a low-traffic contact form;
// move to Upstash/Vercel KV if abuse ever gets past this.
const hits = new Map();

export function isRateLimited(key, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS;
}
