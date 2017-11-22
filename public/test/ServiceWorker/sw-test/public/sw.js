self.addEventListener('install', event => {
  console.log('Install event fired.....')
  event.waitUntil(
    caches.open('v1').then( cache => {
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
    }).catch(err => console.log('error : ', err))
  )
})

self.addEventListener('fetch', event => {
  console.log('<Inside Fetch event of SW.js> event.request.url = ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log('<Inside Fetch event of SW.js> response = ', response)
      return response || fetch(event.request)
    })
  )
})
