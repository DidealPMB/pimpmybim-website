const UPSTREAM_ORIGIN = "https://license.pimpmybim.fr";

export async function onRequest(context) {
  const { request, params } = context;

  const incomingUrl = new URL(request.url);
  const rest = Array.isArray(params.path)
    ? params.path.join("/")
    : (params.path || "");

  const upstreamUrl = new URL(
    "/api/account/" + rest + incomingUrl.search,
    UPSTREAM_ORIGIN
  );

  const headers = new Headers(request.headers);
  headers.delete("Host");
  headers.set("Accept", headers.get("Accept") || "application/json");

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, init);
    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set("Cache-Control", "no-store");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        code: "ACCOUNT_PROXY_UNAVAILABLE",
        message: "Le service de compte PMB est temporairement indisponible.",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
