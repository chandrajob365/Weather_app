let db = indexedDB.open('WeatherApp')
let store = null
db.onerror = function (event) {
  console.log('IndexedDB is not suported in your browser error: ' + event.target.errorCode)
}
db.onupgradeneeded = function (event) {
  db = event.target.result
  store = db.createObjectStore('locations')
  store.createIndex('location', 'location', { unique: false })
}


function insertData (name) {
  store.transaction.oncomplete = event => {
    var locationObjectStore = db.transaction('locations', 'readwrite').objectStore('locations')
    locationObjectStore.add(name.lat, name.lng)
  }
}
