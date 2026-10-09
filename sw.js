/* La Terra Autisti – service worker 1.1: riceve le notifiche e apre l'app quando le tocchi.
   Non conserva copie delle pagine: l'app si scarica sempre aggiornata. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const titolo = String(d.title || "La Terra Autisti").slice(0, 80);
  e.waitUntil(self.registration.showNotification(titolo, {
    body: String(d.body || "").slice(0, 240),
    tag: String(d.tag || "laterra"),
    renotify: true,
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    vibrate: [250, 120, 250],
    data: { url: typeof d.url === "string" ? d.url : "./" },
  }));
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
