document.addEventListener('DOMContentLoaded', function () {
  const dbPromise = idb.open('weatherApp', 1, upgradeDB => {
    upgradeDB.createObjectStore('locations')
  })
})
