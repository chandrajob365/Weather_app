this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('Weather_app_cache_V1').then(cache => {
      return cache.addAll([
        '/css/main.css',
        '/images/ic_refresh_white_24px.svg',
        '/images/icons/location-3x.png',
        '/images/icons/target-4x.png',
        '/images/clear.png',
        '/images/rain.png',
        '/images/snow.png',
        '/images/sleet.png',
        '/images/wind.png',
        '/images/fog.png',
        '/images/cloudy.png',
        '/images/partly-cloudy.png',
        '/images/partly-cloudy.png',
        '/images/thunderstorm.png',
        '/script/lib/idb.js',
        '/script/db/dbController.js',
        '/script/location.js',
        '/script/main.js',
        '/index.html'
      ])
    })
  )
})

this.addEventListener('fetch', event => {
  console.log('<Fetch event > event.request.url = ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(res => {
      // console.log('<Fetch event > response = ', response)
      return res || fetch(event.request).then(response => {
      //   console.log('<From inside response of fetch> event.request.url = ', event.request.url)
      //   console.log('<From inside response of fetch> response = ', response)
        return caches.open('Weather_app_cache_V1').then(cache => {
          cache.put(event.request, response.clone())
          return response
        })
      }).catch(() => {
        // add falback case
        // return some file from cache as fallback measure
        // (cached current weather and all other weathers)
        console.log('Resource didn\'t matched anything and network is also not there')
      })
    })
  )
})
