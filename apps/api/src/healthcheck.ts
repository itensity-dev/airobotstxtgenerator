// Used by the Docker HEALTHCHECK (no curl/wget in the image).
const port = process.env.PORT ?? '8081';
try {
  const res = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(2000) });
  process.exit(res.ok ? 0 : 1);
} catch {
  process.exit(1);
}

export {};
