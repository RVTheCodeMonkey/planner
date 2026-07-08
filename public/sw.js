self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', async () => {
  await self.clients.claim()
  await self.registration.unregister()
  const all = await self.clients.matchAll()
  all.forEach(c => c.navigate(c.url))
})
