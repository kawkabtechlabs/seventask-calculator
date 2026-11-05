const CANONICAL_HOST = "seventaskcalculator.in";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  if (hostname === "pages.dev" || hostname.endsWith(".pages.dev")) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
