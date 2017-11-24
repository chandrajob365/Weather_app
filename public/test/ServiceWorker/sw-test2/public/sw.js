console.log('SW startup')
self.addEventListener('install', event => {
  console.log('SW installed...')
})

self.addEventListener('activated', event => {
  console.log('SW activated......')
  event.waitUntil(wait(5000).then(() => console.log('Acitvated')))
})

self.addEventListener('fetch', event => {
  console.log('Caught a fetch')
  event.respondWith(new Response('Hello everyone'))
})
