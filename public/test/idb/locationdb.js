const locationList = [
  {name: 'delhi', lat: 12, lng: 13},
  {name: 'mumbai', lat: 14, lng: 17},
  {name: 'Bangalore', lat: 16, lng: 19}
]

const dbPromise = idb.open('weatherApp', 1, upgradeDB => {
  upgradeDB.createObjectStore('locations')
})

const idbKeyVal = {
  set (key, val) {
    return dbPromise.then(db => {
      const tx = db.transaction('locations', 'readwrite')
      tx.objectStore('locations').put(val, key)
      return tx.complete
    })
  },
  getAll () {
    return dbPromise.then(db => {
      return db.transaction('locations', 'readonly')
        .objectStore('locations').getAll()
    })
  },
  get (key) {
    return dbPromise.then(db => {
      return db.transaction('locations').objectStore('locations').get(key)
    })
  }
}

const addLocations = locationList => {
  locationList.forEach(location => {
    idbKeyVal.set(location.lat, location)
  })
}
const getAll = (cb) => idbKeyVal.getAll().then(allObjs => cb(allObjs))
addLocations(locationList)
getAll(allObjs => console.log(allObjs))
idbKeyVal.get(14).then(obj => console.log('res = ', obj))
