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
    chkAndInsertInIDB(lat, lng)
    app.fetchForecast(lat, lng)
  }
  document.getElementById('locSearch').value = ''
  document.getElementById('locSearch').focus()
}

function getCurrentGeoLocation () {
  toggleLocationDetectorIcon()
  if ('geolocation' in navigator) {
    console.log('Inside GEOLOC call.............')
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
  } else {
    // Do Something
  }
}

const geoSuccess = position => {
  console.log('<geoSuccess> lat = ', position.coords.latitude, ' longitude = ', position.coords.longitude)
  let lat = position.coords.latitude
  let lng = position.coords.longitude
  locator.iconShouldVisible = true
  toggleLocationDetectorIcon()
  locator.icon.blur()
  app.fetchForecast(position.coords.latitude, position.coords.longitude)
  chkAndInsertInIDB(lat, lng)
}

const geoError = () => {
  console.log('<geoError> Error')
  locator.iconShouldVisible = true
  toggleLocationDetectorIcon()
  locator.icon.blur()
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
