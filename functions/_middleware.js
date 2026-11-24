const CANONICAL_HOST = "seventaskcalculator.in";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const isPagesDev = hostname === "pages.dev" || hostname.endsWith(".pages.dev");
  const isWww = hostname === `www.${CANONICAL_HOST}`;

  if (isWww) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  if (isPagesDev) headers.set('X-Robots-Tag', 'noindex');
  if (headers.get('Content-Type')?.includes('text/html')) {
    headers.set('Content-Security-Policy', "object-src 'none'; base-uri 'self'; frame-ancestors 'self'");
    headers.set('Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; media-src 'self' blob:; worker-src 'self' blob:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'");
  }
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
