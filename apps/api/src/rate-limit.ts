/** Fixed-window rate limiter per client key (in memory; one api instance). */
export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

/** Parse "30/min", "300/hour", "5/s". Default 30 per minute. */
export function parseRateLimit(value: string | undefined): RateLimitConfig {
  const m = /^\s*(\d+)\s*\/\s*(s|sec|second|m|min|minute|h|hour)\s*$/i.exec(value ?? '');
  if (!m) return { limit: 30, windowMs: 60_000 };
  const unit = m[2]!.toLowerCase();
  const windowMs = unit.startsWith('s') ? 1000 : unit.startsWith('h') ? 3_600_000 : 60_000;
  return { limit: Math.max(1, Number(m[1])), windowMs };
}

export class RateLimiter {
  private hits = new Map<string, { count: number; reset: number }>();
  constructor(private readonly config: RateLimitConfig, private readonly now: () => number = Date.now) {}

  /** Returns seconds to wait if the request is over the limit, otherwise 0. */
  take(key: string): { allowed: boolean; remaining: number; retryAfter: number } {
    const t = this.now();
    if (this.hits.size > 10_000) this.sweep(t);
    let e = this.hits.get(key);
    if (!e || e.reset <= t) {
      e = { count: 0, reset: t + this.config.windowMs };
      this.hits.set(key, e);
    }
    e.count++;
    const allowed = e.count <= this.config.limit;
    return {
      allowed,
      remaining: Math.max(0, this.config.limit - e.count),
      retryAfter: allowed ? 0 : Math.ceil((e.reset - t) / 1000),
    };
  }

  private sweep(t: number) {
    for (const [k, v] of this.hits) if (v.reset <= t) this.hits.delete(k);
  }
}

/** Small TTL cache with a size cap (oldest entries evicted first). */
export class TtlCache<V> {
  private map = new Map<string, { value: V; expires: number }>();
  constructor(private readonly ttlMs: number, private readonly max = 1000, private readonly now: () => number = Date.now) {}
  get(key: string): V | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.expires <= this.now()) {
      this.map.delete(key);
      return undefined;
    }
    return e.value;
  }
  set(key: string, value: V) {
    if (this.map.size >= this.max) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
    this.map.set(key, { value, expires: this.now() + this.ttlMs });
  }
  get size() {
    return this.map.size;
  }
}
