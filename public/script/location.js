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
  console.log('place.name = ', place.name)
  let lat = place.geometry.location.lat()
  console.log('lat = ', lat)
  let lng = place.geometry.location.lng()
  document.getElementById('locSearch').value = ''
  app.fetchForecast(lat, lng)
}

function getCurrentGeoLocation () {
  toggleLocationDetectorIcon()
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
  } else {
    // Do Something
  }
}

const geoSuccess = position => {
  console.log('<geoSuccess> lat = ', position.coords.latitude, ' longitude = ', position.coords.longitude)
  locator.iconShouldVisible = true
  toggleLocationDetectorIcon()
  locator.icon.blur()
  app.fetchForecast(position.coords.latitude, position.coords.longitude)
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
