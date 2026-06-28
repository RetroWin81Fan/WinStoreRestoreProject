// _middleware.js — Cloudflare Pages Functions
//
// Cel: GitHub Pages/raw odpowiada 403 na żądania POST do statycznych plików
// (np. Channel.xml, MyApps, itp. — serwisy WinStore wysyłane jako POST).
// Ten middleware przechwytuje WSZYSTKIE metody HTTP (GET, POST, ...) i,
// niezależnie od metody, serwuje statyczny plik z repo, tak jakby żądanie
// było zwykłym GET.
//
// Umieść ten plik w katalogu głównym repo (tam gdzie DiscoveryService.xml,
// Pages.xml, Channel.xml) — Cloudflare Pages automatycznie go wykryje.

export async function onRequest(context) {
  const { request, next, env } = context;

  // Dla GET/HEAD nic nie zmieniamy — niech Pages obsłuży to normalnie.
  if (request.method === "GET" || request.method === "HEAD") {
    return next();
  }

  // Dla POST (i każdej innej metody) — Cloudflare Pages odrzuca metody
  // inne niż GET/HEAD na poziomie routingu do plików statycznych, więc
  // next() z podszywanym GET nie pomaga. Musimy sami pobrać plik z
  // bindingu ASSETS i zwrócić go bezpośrednio, z metodą POST nadal w
  // żądaniu, ale docelowy fetch do ASSETS robimy jako GET.
  const url = new URL(request.url);

  try {
    const assetResponse = await env.ASSETS.fetch(
      new Request(url.toString(), { method: "GET" })
    );

    // Klonujemy odpowiedź, żeby mieć pełną kontrolę nad nagłówkami/statusem.
    const body = await assetResponse.text();
    return new Response(body, {
      status: 200,
      headers: assetResponse.headers,
    });
  } catch (err) {
    return new Response("Middleware error: " + err.message, { status: 500 });
  }
}
