const locator = {
  autocomplete: {},
  iconShouldVisible: false,
  icon: document.getElementById('detect-location-icon')
}

function initAutocomplete () {
  console.log('Entry initAutocomplete')
  let input = document.getElementById('locSearch')
  let options = {
    type: ['(cities)']
  }
  locator.autocomplete = new google.maps.places.Autocomplete(input, options)
  locator.autocomplete.addListener('place_changed', fillInAddress)
}

const fillInAddress = () => {
  let place = locator.autocomplete.getPlace()
  console.log('place = ', place)
  console.log('place.location = ', place.geometry.location)
  if (place && place.geometry.location) {
    console.log('<fillInAddress> Call to fetchForecast...........')
    let lat = place.geometry.location.lat()
    let lng = place.geometry.location.lng()
    // chkAndInsertInIDB(lat, lng)
    app.fetchForecast(lat, lng)
  }
  document.getElementById('locSearch').value = ''
  document.getElementById('locSearch').focus()
}

function getCurrentGeoLocation () {
  app.alert.style.display = 'none'
  toggleLocationDetectorIcon()
  if ('geolocation' in navigator) {
    console.log('Inside GEOLOC call.............')
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {timeout: 5000})
  } else {
    updateGeoErrorStatus('Unsupported feature')
  }
}

const geoSuccess = position => {
  console.log('<geoSuccess> position = ', position)
  console.log('<geoSuccess> lat = ', position.coords.latitude, ' longitude = ', position.coords.longitude)
  let lat = position.coords.latitude
  let lng = position.coords.longitude
  locator.iconShouldVisible = true
  toggleLocationDetectorIcon()
  locator.icon.blur()
  app.fetchForecast(position.coords.latitude, position.coords.longitude)
}

const geoError = err => {
  console.log('<geoError> Error : ', err.code)
  locator.iconShouldVisible = true
  toggleLocationDetectorIcon()
  locator.icon.blur()
  handleErrorCase(err)
}

const handleErrorCase = err => {
  switch (err.code) {
    case 1: updateGeoErrorStatus('Permision Denied')
      break
    case 2: updateGeoErrorStatus('Network Error')
      break
    case 3: updateGeoErrorStatus('Timeout, Retry')
      break
  }
}

const updateGeoErrorStatus = errorString => {
  app.alert.style.display = 'flex'
  document.querySelector('.geo-error').textContent = ''
  document.querySelector('.geo-error').textContent = errorString
}
const toggleLocationDetectorIcon = () => {
  locator.iconShouldVisible
  ? toggle('detect-location-loader', 'detect-location-icon')
  : toggle('detect-location-icon', 'detect-location-loader')
}

const toggle = (removeClass, addClass) => {
  locator.icon.classList.remove(removeClass)
  locator.icon.classList.add(addClass)
}
