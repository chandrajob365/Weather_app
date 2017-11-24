const APPKEY = '6d0e3f929541145218c53f14a59c7aa2'
const GPLACEAPPKEY = 'AIzaSyAWc4-9-Dy6nJ_1hDUcQjX1_ZxhwzIsVw4'
const app = {
  availableCards: {},
  container: document.querySelector('.main'),
  weatherTemplate: document.querySelector('.weatherTemplate'),
  isLoading: true,
  spinner: document.querySelector('.app-loader'),
  searchedLocations: [],
  dbPromise: {},
  availabelLocations: [],
  noDataIndicator: document.querySelector('.no-data'),
  emptyIDB: true,
  alert: document.querySelector('.alert'),
  geoError: document.querySelector('.geo-error')
}

const errorStrings = {
  PERMISSION_DENIED: 'Permision Denied',
  POSITION_UNAVAILABLE: 'Network Error',
  TIMEOUT: 'Timeout, Retry'
}

const warningStrings = {
  NO_INTERNET: 'No Connection'
}

const updateNotification = (errorString, notificationClass) => {
  app.alert.style.display = 'flex'
  resetAlert()
  app.alert.classList.add(notificationClass)
  app.geoError.textContent = ''
  app.geoError.textContent = errorString
  setTimeout(clearError, 8000)
}

const resetAlert = () => {
  app.alert.classList.remove('error')
  app.alert.classList.contains('warning')
}
// Removes alert box after 8 seconds
const clearError = () => {
  app.geoError.textContent = ''
  resetAlert()
  app.alert.style.display = 'none'
}
const toggleNoData = respString => {
  if (app.emptyIDB) {
    app.noDataIndicator.removeAttribute('hidden')
    app.noDataIndicator.textContent = ''
    app.noDataIndicator.textContent = respString
  } else {
    app.noDataIndicator.textContent = ''
    app.noDataIndicator.setAttribute('hidden', true)
  }
}
// 'Please use above to fetch some data'
document.addEventListener('DOMContentLoaded', function () {
  // document.querySelector('.alert').style.display = 'flex'
  console.log('[MAIN] error ====== ', document.querySelector('.error'))
  // document.querySelector('.error').innerText = 'Network Error!!!! '
  app.dbPromise = idb.open('weatherApp', 1, upgradeDB => {
    upgradeDB.createObjectStore('locations')
  })
  idbKeyVal.getAllLocations()
    .then(locationsObjs => {
      if (locationsObjs.length > 0) {
        locationsObjs.forEach(location => {
          app.availabelLocations.push({lat: location.lat, lng: location.lng})
          app.fetchForecast(location.lat, location.lng)
        })
      } else {
        console.log('[MAIN, DOMContentLoaded] No data in IDB')
        toggleNoData('Please use above to fetch weather')
      }
    })
})

const getFormatedDate = epoch => {
  var dt = new Date(epoch * 1000)
  // console.log('epoch = ', epoch, ' dt = ', dt)
  return (format) => {
    return converter(dt.toString(), format)
  }
}

const converter = (dt, format) => {
  // console.log('dt = ', dt)
  switch (format) {
    case 'lastUpdated':
      return dt.slice(0, dt.length - 15)
    case 'sunrise':
    case 'sunset':
      return dt.match(/(\d{2}:){2}\d{2}/)[0]
    default:
  }
}

const getIconClass = weatherId => {
  // console.log('<getIconClass> currentWeatherNature = ', weatherId)
  if (weatherId >= 200 && weatherId <= 232) return 'thunderstorms'
  if (weatherId >= 300 && weatherId <= 321) return 'scattered-showers'
  if (weatherId >= 500 && weatherId <= 531) return 'rain'
  if (weatherId >= 600 && weatherId <= 622) return 'snow'
  if (weatherId >= 700 && weatherId <= 781) return 'fog'
  if (weatherId === 800) return 'clear'
  if (/80[1-4]/.test(weatherId)) return 'cloudy'
}

const populateUpdatedData = (data) => {
  console.log('[MAIN, populateUpdatedData] data = ', data)
  // document.querySelector('.no-data').removeAttribute('hidden', true)
  // console.log('dataLastUpdated = ', getFormatedDate(data.dt)('lastUpdated'), ' data.dt = ', data.dt)
  let dataLastUpdated = data.dt
  // console.log('<populateUpdatedData> data.name = ', data.name)
  let card = app.availableCards[data.name]
  if (!card) {
    card = app.weatherTemplate.cloneNode(true)
    card.querySelector('.location').textContent = data.name + ' , ' + data.sys.country
    card.removeAttribute('hidden')
    app.container.appendChild(card)
    app.availableCards[data.name] = card
  }
  // Verifies the data provide is newer than what's already visible
  // on the card, if it's not bail, if it is, continue and update the
  // time saved in the card
  let cardLastUpdatedElem = card.querySelector('.card-last-updated')
  let cardLastUpdated = cardLastUpdatedElem.textContent
  if (cardLastUpdated) {
    if (dataLastUpdated < cardLastUpdated) return
  }
  cardLastUpdatedElem.textContent = data.dt
  let currentLocation = data.name
  let countryCode = data.sys.country
  let dataLastUpdatedFormated = getFormatedDate(data.dt)('lastUpdated')
  let currentWeatherNature = data.weather[0].main
  let currentWeatherId = data.weather[0].id
  let currentTempVal = Math.floor(data.main.temp)
  let humidity = data.main.humidity
  let windVal = data.wind.speed
  let windScale = data.wind.scale || 'mps'
  let windDirection = data.wind.deg
  let sunrise = getFormatedDate(data.sys.sunrise)('sunrise')
  let sunset = getFormatedDate(data.sys.sunset)('sunset')
  card.querySelector('.place .location').textContent = currentLocation + ' , ' + countryCode
  card.querySelector('.place .date').textContent = dataLastUpdatedFormated
  card.querySelector('.nature').textContent = currentWeatherNature
  card.querySelector('.visual .description .icon').classList.add(getIconClass(currentWeatherId))
  card.querySelector('.description .temprature .value').textContent = currentTempVal
  card.querySelector('.humidity').textContent = humidity
  card.querySelector('.wind ').textContent = windVal + ' ' + windScale + ' ' + (!isNaN(windDirection) ? Math.round(windDirection) + '°' : '')
  card.querySelector('.sunrise').textContent = sunrise
  card.querySelector('.sunset').textContent = sunset
  document.querySelector('.app-loader').setAttribute('hidden', true)
}

app.fetchForecast = (lat, lng) => {
  console.log('<app.js, fetchForecast> lat = ', lat, ' lng = ', lng)
  app.emptyIDB = false
  toggleNoData()
  document.querySelector('.app-loader').removeAttribute('hidden')
  const URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + APPKEY + '&units=metric&units=imperial'
  if ('caches' in window) {
    fetchCachedData(URL)
  }
  makeNetworkReq(URL, lat, lng)
}

const fetchCachedData = URL => {
  caches.match(URL).then(response => {
    console.log('[MAIN, fetchForecast] response = ', response)
    if (response) {
      console.log('.............................')
      response.json().then((json) => {
        console.log('[MAIN] JSON ......... : ', json)
        populateUpdatedData(json)
      })
    }
  })
}

const makeNetworkReq = (URL, lat, lng) => {
  const request = new XMLHttpRequest()
  request.onreadystatechange = () => {
    console.log('[MAIN], request = ', request)
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        let response = JSON.parse(request.response)
        // console.log('<app.js, fetchForecast> response = ', response)
        populateUpdatedData(response)
        chkAndInsertInIDB(response.id, lat, lng)
      } else {
        updateNotification(warningStrings.NO_INTERNET, 'warning')
      }
    }
  }
  request.onerror = () => {
    console.log('[MAIN, makeNetworkReq] Error')
    updateNotification(warningStrings.NO_INTERNET, 'warning')
    document.querySelector('.app-loader').setAttribute('hidden', true)
    toggleNoData('No Network')
  }
  request.open('GET', URL)
  request.send()
}

const getRefreshedData = () => {
  // console.log('<getRefreshedData> Entry')
  if (app.availabelLocations.length > 0) {
    app.availabelLocations.forEach(location => {
      app.fetchForecast(location.lat, location.lng)
    })
  }
}

window.onload = () => {
  console.log('Inside window load event...')
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(reg => {
        console.log('serviceWorker Registration success. Scope is : ', reg.scope)
      })
      .catch(err => {
        console.log('error in serviceWorker Registration: ', err)
      })
  }
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('[MAIN] client recieved msg : ', event.data)
    if (event.data === 'NETWORK_ERROR') {
      updateNotification(warning.NO_INTERNET, 'warning')
    }
  })
}
