
const idbKeyVal = {
  set (key, val) {
    return app.dbPromise.then(db => {
      const tx =  db.transaction('locations', 'readwrite')
      tx.objectStore('locations').put(val, key)
      return tx.complete
    }).catch(err => console.log('Error in saving value'))
  },
  getAllLocations () {
    return app.dbPromise.then(db => {
      return db.transaction('locations', 'readonly')
        .objectStore('locations').getAll()
    })
  },
  get (key) {
    return app.dbPromise.then(db => {
      return db.transaction('locations', 'readonly')
        .objectStore('locations')
        .get(key)
    })
  }
}

const chkAndInsertInIDB = (lat, lng) => {
  idbKeyVal.get(lat)
    .then(obj => {
      if (!obj) {
        app.availabelLocations.push({lat: lat, lng: lng})
        idbKeyVal.set(lat, {lat: lat, lng: lng})
      }
    })
}
