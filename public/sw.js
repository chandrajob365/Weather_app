const appCacheName = 'Weather_appShell_cache_V1'
const dataCacheName = 'Weather_Data_cache_V1'
const openWeatherMap = 'https://api.openweathermap.org'
const googleApi = 'https://maps.googleapis.com'
const geoStatic = 'https://csi.gstatic.com/'
const apiLinks = [openWeatherMap, googleApi, geoStatic]
console.log('[SERVICEWORKER, STARTUP] this = ', this)
this.addEventListener('install', event => {
  console.log('[SERVICEWORKER, INSTALL] ')
  event.waitUntil(
    caches.open(appCacheName).then(cache => {
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
        '/favicon.ico',
        '/index.html'
      ])
    })
  )
})

this.addEventListener('fetch', event => {
  console.log('[SERVICEWORKER, FETCH] event.request.url = ', event.request.url)
  if (isDataLink(event.request.url)) {
    console.log('[SERVICEWORKER, FETCH] Its a data Link : ', event.request.url)
    fetchAndCacheDataLinks(event)
   //  .catch(err => {
   //   console.log('error in Fetching URL : ', event.request.url, '\n', ' Error : ', err)
   // })
  } else {
    fetchAppShell(event)
  }
})

const isDataLink = url => {
  for (let i = 0; i < apiLinks.length; i++) {
    let res = url.indexOf(apiLinks[i])
    console.log('[SERVICEWORKER, isDataLink] res = ', res)
    if (res !== -1) return true
  }
  return false
}
// event.port[0].postMessage('NETWORK_ERROR')
const fetchAndCacheDataLinks = event => {
  event.respondWith(
    caches.open(dataCacheName).then(cache => {
      console.log('[SERVICEWORKER, fetchAndCacheDataLinks] cache = ', cache)
      // if req and resp key val pair is already in cache then return from cache else make nw call
      return event.request.url.indexOf('openweathermap') === -1
       ? fetch(event.request.url, {mode: 'no-cors'})
          .then(response => saveInCache(event, response, cache))
          .catch(err => event.port[0].postMessage('NETWORK_ERROR'))
       : fetch(event.request.url)
          .then(response => saveInCache(event, response, cache))
          .catch(err => event.port[0].postMessage('NETWORK_ERROR'))
    })
  )
}

const saveInCache = (event, response, cache) => {
  cache.put(event.request.url, response.clone())
  console.log('[SERVICEWORKER, saveInCache] response = ', response)
  return response
}
const fetchAppShell = event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(response => {
        return caches.open(appCacheName)
         .then(cache => saveInCache(event, response, cache))
         .catch(err => event.port[0].postMessage('NETWORK_ERROR'))
      })
    })
  )
}

this.addEventListener('activate', event => {
  console.log('[SERVICEWORKER] ACTIVATE..')
  event.waitUntil(
    caches.open(
      caches.keys().then(keyList => {
        console.log('[SERVICEWORKER, ACTIVATE] KeyList = ', keyList)
        return Promise.all(keyList.map(key => {
          if (key !== appCacheName && key !== dataCacheName) {
            console.log('[SERVICEWORKER, ACTIVATE] Removing Old Cache : ', key)
            return caches.delete(key)
          }
        }))
      })
    )
  )
})
