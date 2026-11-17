/* Partie Double : fonctionnement hors ligne.
   Réseau d'abord (pour recevoir les mises à jour), copie locale si le réseau manque. */
const CACHE = 'partie-double-v3';
const FICHIERS = ['./', 'index.html', 'data.js', 'app.js', 'plus.js', 'manifest.webmanifest',
  'icones/icone.svg', 'icones/icone-180.png', 'icones/icone-192.png', 'icones/icone-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(K => Promise.all(K.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/') || u.pathname.startsWith('/_/')) return;
  e.respondWith(
    fetch(r).then(rep => {
      if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
      return rep;
    }).catch(() => caches.match(r).then(m => m || caches.match('index.html')))
  );
});
