const UPSTREAM_ORIGIN = "https://license.pimpmybim.fr";
const ACCOUNT_PREFIX = "/api/account";

function isAccountApi(pathname) {
  return pathname === ACCOUNT_PREFIX || pathname.startsWith(ACCOUNT_PREFIX + "/");
}

async function proxyAccountRequest(request) {
  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(incomingUrl.pathname + incomingUrl.search, UPSTREAM_ORIGIN);

  const headers = new Headers(request.headers);
  headers.set("Accept", headers.get("Accept") || "application/json");
  headers.delete("Host");

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set("Cache-Control", "no-store");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/account-config.js" && request.method === "GET") {
      const siteKey = typeof env.TURNSTILE_SITE_KEY === "string" ? env.TURNSTILE_SITE_KEY : "";
      return new Response(
        "window.PMB_ACCOUNT_CONFIG = Object.freeze({ turnstileSiteKey: " + JSON.stringify(siteKey) + " });",
        {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }

    if (isAccountApi(url.pathname)) {
      try {
        return await proxyAccountRequest(request);
      } catch (error) {
        return Response.json(
          {
            code: "ACCOUNT_PROXY_UNAVAILABLE",
            message: "Le service de compte PMB est temporairement indisponible.",
          },
          {
            status: 502,
            headers: { "Cache-Control": "no-store" },
          },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
