self.addEventListener('install', event => {
  // debugger;
  console.log('Install event fired.....')
  // self.skipWaiting()
  console.log('TEST........')
  event.waitUntil(
    caches.open('v1').then(cache => {
      console.log('cache = ', cache)
      return cache.addAll(
        [
          '/index.html',
          '/main.js',
          '/images/bountyHunters.jpg',
          '/images/myLittleVader.jpg',
          '/images/snowTroopers.jpg',
          '/images/star-wars-logo.jpg',
          '/style.css',
          '/image-list.js'
        ]
      )
    })
    .then(self.skipWaiting())
    .catch(err => console.log('error : ', err))
  )
})

self.addEventListener('fetch', event => {
  // debugger;
  // console.log('<Inside Fetch event of.... SW.js> event.request.url = ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(resp => {
      // console.log('<Inside Fetch event of... SW.js> resp = ', resp)
      return resp || fetch(event.request).then(response => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, response.clone())
          console.log('<after cache.put > event.request.url = ', event.request.url)
          console.log('<Response after cache.put > response = ', response)
          return response
        })
      })
    })
  )
})

self.addEventListener('activate', event => {
  console.log('<ACTIVATE ......> Entry')
  console.log('HELLO WORLD')
  event.waitUntil(self.clients.claim())
})
