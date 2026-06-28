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
  const { request, next } = context;

  // Dla GET/HEAD nic nie zmieniamy — niech Pages obsłuży to normalnie
  // (czyli zwróci statyczny plik tak jak zawsze).
  if (request.method === "GET" || request.method === "HEAD") {
    return next();
  }

  // Dla POST (i każdej innej metody) — budujemy "podszywane" żądanie GET
  // pod tym samym URL-em, żeby Pages zwróciło ten sam statyczny plik,
  // który normalnie serwowałoby dla GET.
  const url = new URL(request.url);
  const getRequest = new Request(url.toString(), {
    method: "GET",
    headers: request.headers,
  });

  return next(getRequest);
}
