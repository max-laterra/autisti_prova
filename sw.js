/* La Terra Autisti – service worker 1.3 (dall'app 1.22).
   Dalla 1.3: la copia dell'app non viene mai sostituita con una versione più vecchia (prima, subito dopo un aggiornamento,
   poteva tornare la versione di prima e l'aggiornamento ripartiva); dopo un aggiornamento la pagina si prende dal sito;
   le notifiche arrivate con l'app aperta non si ricordano come «arrivate mentre l'app era chiusa».
   - Riceve le notifiche e apre l'app quando le tocchi (come prima).
   - Tiene sul telefono una copia dell'app: si apre subito, anche senza campo, e in sottofondo si rinfresca da sola
     (al massimo una volta ogni 15 minuti). L'aggiornamento con «Ehi, c'è un aggiornamento!» lo fa l'app.
   - Quando arriva la notifica di un foglio nuovo o aggiornato, scarica subito il foglio e il PDF: aprendo l'app
     sono già sul telefono.
   - Ricorda le notifiche arrivate con l'app chiusa, per mostrarle subito all'apertura.
   - Android: quando il telefono lo permette, rinfresca la copia dell'app anche con l'app chiusa. */
const CACHE = "laterra-app";
const FILE = ["index.html", "manifest.webmanifest", "img/bus.png", "img/ruota.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "vendor/pdf.min.mjs", "vendor/pdf.worker.min.mjs"];
const SEGNO = /La Terra Autisti - versione \d/; // una pagina dell'app vera (non una pagina d'errore)
const SEGNO_V = /La Terra Autisti - versione (\d+(?:\.\d+)+)/;
const verDi = (t) => { const m = SEGNO_V.exec(String(t || "").slice(0, 4000)); return m ? m[1] : ""; };
function piuNuova(a, b) { const x = String(a || "").split(".").map(Number), y = String(b || "").split(".").map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0; } return false; }
// dalla 1.3: la pagina si mette nella copia solo se è valida e non più vecchia di quella che c'è già
async function metti(c, t) {
  if (!SEGNO.test(t)) return false;
  const x = await c.match("index.html");
  if (x) { const vecchia = verDi(await x.text()); if (vecchia && piuNuova(vecchia, verDi(t))) return false; }
  await c.put("index.html", new Response(t, { headers: HTML })); return true;
}
const HTML = { "Content-Type": "text/html; charset=utf-8" };
const entro = (pr, ms) => Promise.race([pr, new Promise((_, no) => setTimeout(() => no(new Error("tempo")), ms))]);

// ---------- copia dell'app ----------
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(precarica()); });
async function precarica() {
  const c = await caches.open(CACHE);
  await Promise.all(FILE.map(async (f) => {
    try {
      if (f !== "index.html" && (await c.match(f))) return;
      const r = await fetch(new Request(f, { cache: "reload" })); if (!r.ok) return;
      if (f === "index.html") { await metti(c, await r.text()); return; }
      await c.put(f, r);
    } catch (_) { /* senza campo: si prende al prossimo giro */ }
  }));
}
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  const k = await caches.keys(); await Promise.all(k.filter((x) => x.startsWith("laterra-") && x !== CACHE).map((x) => caches.delete(x)));
  await self.clients.claim();
})()));
let ultimoRinfresco = 0;
async function rinfresca() { // la pagina dell'app dal sito, solo se è valida (con «no-cache»: se non è cambiata costa pochissimo)
  ultimoRinfresco = Date.now();
  try {
    const r = await entro(fetch(new Request("index.html", { cache: "no-cache" })), 30000); if (!r.ok) { ultimoRinfresco = 0; return false; }
    const t = await r.text(); if (!SEGNO.test(t)) { ultimoRinfresco = 0; return false; }
    const c = await caches.open(CACHE); return await metti(c, t);
  } catch (_) { ultimoRinfresco = 0; return false; } // senza campo: si riprova alla prossima apertura
}
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const u = new URL(req.url); if (u.origin !== self.location.origin) return;
  if (u.searchParams.has("controllo")) return; // controllo e download dell'aggiornamento: sempre dal sito
  const base = new URL(self.registration.scope).pathname; if (!u.pathname.startsWith(base)) return;
  const rel = u.pathname.slice(base.length);
  if (req.mode === "navigate" || rel === "" || rel === "index.html") {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      if (u.searchParams.has("v")) { // dalla 1.3: dopo un aggiornamento («?v=…») la pagina si prende dal sito, la copia solo se manca il campo
        try { const r = await entro(fetch(new Request("index.html", { cache: "reload" })), 20000); if (r.ok) { const t = await r.text(); if (SEGNO.test(t)) { await metti(c, t); return new Response(t, { headers: HTML }); } } } catch (_) {}
      }
      const x = await c.match("index.html");
      if (x) { if (Date.now() - ultimoRinfresco > 15 * 60000) e.waitUntil(rinfresca()); return x; } // subito la copia, poi si rinfresca
      try { const r = await fetch(req); if (r.ok) { const t = await r.clone().text(); await metti(c, t); } return r; }
      catch (err) { return Response.error(); }
    })());
    return;
  }
  if (FILE.includes(rel)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE), x = await c.match(rel); if (x) return x;
      const r = await fetch(req); if (r.ok) await c.put(rel, r.clone()); return r;
    })());
  }
});
self.addEventListener("periodicsync", (e) => { if (e.tag === "app") e.waitUntil(rinfresca()); });

// ---------- memoria del telefono (la stessa dell'app) ----------
function db() { return new Promise((ok, no) => { const r = indexedDB.open("laterra-autisti", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }); }
async function idbGet(k) { const d = await db(); return new Promise((ok) => { try { const q = d.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => { ok(q.result); d.close(); }; q.onerror = () => { ok(undefined); d.close(); }; } catch (_) { ok(undefined); d.close(); } }); }
async function idbSet(k, v) { const d = await db(); return new Promise((ok) => { try { const t = d.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = () => { ok(); d.close(); }; t.onerror = () => { ok(); d.close(); }; } catch (_) { ok(); d.close(); } }); }

// ---------- notifiche ----------
async function ricorda(d) { // le notifiche arrivate con l'app chiusa (le ultime 10, degli ultimi 3 giorni)
  if (!d || !d.title) return;
  const l = (await idbGet("novita")) || [];
  l.push({ t: String(d.title).slice(0, 80), b: String(d.body || "").slice(0, 200), tag: String(d.tag || ""), at: Date.now() });
  await idbSet("novita", l.filter((x) => x && Date.now() - (Number(x.at) || 0) < 3 * 864e5).slice(-10));
}
const argH = (o) => JSON.stringify(o).replace(/[\u007f-￿]/g, (c) => "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4));
async function tokenDropbox(conn, forza) {
  const t = await idbGet("sw-token"); if (!forza && t && t.r === conn.r && Date.now() < t.exp) return t.a;
  const r = await entro(fetch("https://api.dropboxapi.com/oauth2/token", { method: "POST", body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: conn.r, client_id: conn.k }) }), 15000);
  if (!r.ok) throw new Error("token " + r.status);
  const j = await r.json(); await idbSet("sw-token", { a: j.access_token, r: conn.r, exp: Date.now() + ((j.expires_in || 14400) - 300) * 1000 }); return j.access_token;
}
async function scaricaDropbox(conn, path) { // { rev, buf } oppure null se il file non c'è
  for (let giro = 0; giro < 2; giro++) {
    const t = await tokenDropbox(conn, giro > 0);
    const r = await entro(fetch("https://content.dropboxapi.com/2/files/download", { method: "POST", headers: { Authorization: "Bearer " + t, "Dropbox-API-Arg": argH({ path }) } }), 20000);
    if (r.status === 401 && giro === 0) continue;
    if (r.status === 409) return null;
    if (!r.ok) throw new Error("download " + r.status);
    let meta = {}; try { meta = JSON.parse(r.headers.get("Dropbox-API-Result") || "{}"); } catch (_) {}
    return { rev: meta.rev || "", buf: await r.arrayBuffer() };
  }
  return null;
}
// foglio nuovo o aggiornato: foglio e PDF subito sul telefono (le chiavi le usa l'app: «pre:…» e «pdf:…»)
async function prendiFoglio(d) {
  if (!d || !/^f-[a-z0-9_-]+$/.test(String(d.tag || "")) || /tolto/i.test(String(d.title || ""))) return;
  const conn = await idbGet("sw-conn"); if (!conn || !conn.k || !conn.r) return;
  const id = d.tag.slice(2), anno = new Date().getFullYear();
  const cartelle = d.c && /^\/servizi\/\d{4}\/[a-z0-9_-]+$/.test(d.c) ? [d.c] : [anno, anno + 1, anno - 1].map((y) => "/servizi/" + y + "/" + id);
  for (const c of cartelle) {
    const fj = await scaricaDropbox(conn, c + "/foglio.json"); if (!fj) continue;
    let j = null; try { j = JSON.parse(new TextDecoder().decode(fj.buf)); } catch (_) {}
    if (!j) return;
    await idbSet("pre:" + c + "/foglio.json", { rev: fj.rev, j });
    const rev = String((j.pdf && j.pdf.rev) || (Number(j.inviato && j.inviato.n) || 1)), prima = await idbGet("pdf:" + c);
    if (!(prima && prima.rev === rev && prima.buf)) { const p = await scaricaDropbox(conn, c + "/foglio.pdf"); if (p) await idbSet("pdf:" + c, { rev, buf: p.buf }); }
    return;
  }
}
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const titolo = String(d.title || "La Terra Autisti").slice(0, 80);
  e.waitUntil(Promise.all([
    self.registration.showNotification(titolo, {
      body: String(d.body || "").slice(0, 240),
      tag: String(d.tag || "laterra"),
      renotify: true,
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      vibrate: [250, 120, 250],
      data: { url: typeof d.url === "string" ? d.url : "./" },
    }),
    (async () => { // dalla 1.3: solo se l'app non è aperta davanti
      const aperte = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      if (!aperte.some((c) => c.visibilityState === "visible")) await ricorda(Object.assign({}, d, { title: titolo }));
    })().catch(() => {}),
    entro(prendiFoglio(d), 25000).catch(() => {}),
  ]));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const scope = self.registration.scope, verso = e.notification.data && e.notification.data.url === "#mese" ? scope + "#vai=mese" : scope;
  e.waitUntil((async () => {
    const aperte = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of aperte) if (c.url.indexOf(scope) === 0 && "focus" in c) { try { if (verso !== scope && "navigate" in c) await c.navigate(verso); } catch (_) {} return c.focus(); }
    return self.clients.openWindow(verso);
  })());
});
// «rinfresca»: la copia dell'app dal sito adesso; «prova-push» (per le prove): come l'arrivo di una notifica, senza mostrarla
self.addEventListener("message", (e) => {
  const m = e.data || {};
  if (m.tipo === "rinfresca") e.waitUntil(rinfresca().then((x) => { if (e.source) e.source.postMessage({ tipo: "rinfrescata", ok: !!x }); }));
  if (m.tipo === "prova-push") e.waitUntil(Promise.all([ricorda(m.d).catch(() => {}), entro(prendiFoglio(m.d), 25000).catch(() => {})]).then(() => { if (e.source) e.source.postMessage({ tipo: "prova-push-fatta" }); }));
});
