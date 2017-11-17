
const idbKeyVal = {
  set (key, val) {
    return dbPromise.then(db => {
      const tx =  db.transaction('locations', 'readwrite')
      tx.objectStore('locations').put(key, val)
      return tx.complete
    }).catch(err => console.log('Error in saving value'))
  },
  getAll () {
    return dbPromise.then(db => {
      return db.transaction('locations', 'readonly')
        .objectStore('locations').getAll()
    })
  },
  get (key) {
    return dbPromise.then(db => {
      return db.transaction('locations', 'readonly')
        .objectStore('locations')
        .get(key)
    })
  }
}

const getAllLocations = (cb) =>
  idbKeyVal.getAll().then(locationsObjs => cb(locationsObjs))
