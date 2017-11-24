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
  app.alert.style.display = 'none'
  app.geoError.textContent = ''
   // if (window.navigator.online) {
    let place = locator.autocomplete.getPlace() // Get request is being made with new Query from text box
    console.log('place = ', place)
    console.log('place.location = ', place.geometry.location)
    if (place && place.geometry && place.geometry.location) {
      console.log('<fillInAddress> Call to fetchForecast...........')
      let lat = place.geometry.location.lat()
      let lng = place.geometry.location.lng()
      // chkAndInsertInIDB(lat, lng)
      app.fetchForecast(lat, lng)
    }
  //} else {
    //handleNoNetwork()
  //}
  document.getElementById('locSearch').value = ''
  document.getElementById('locSearch').focus()
}

const handleNoNetwork = () => {
  updateNotification(warningStrings.NO_INTERNET, 'warning')
  document.querySelector('.app-loader').setAttribute('hidden', true)
  toggleNoData('No Network')
}
function getCurrentGeoLocation () {
  app.alert.style.display = 'none'
  app.geoError.textContent = ''
  toggleLocationDetectorIcon()
  if ('geolocation' in navigator) {
    console.log('Inside GEOLOC call.............')
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {timeout: 5000})
  } else {
    updateNotification('Unsupported feature')
  }
}

const geoSuccess = position => {
  console.log('<geoSuccess> position = ', position)
  console.log('<geoSuccess> lat = ', position.coords.latitude, ' longitude = ', position.coords.longitude)
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
  if (app.geoError.textContent.length === 0) {
    switch (err.code) {
      case 1: updateNotification(errorStrings.PERMISSION_DENIED, 'error')
        break
      case 2: updateNotification(errorStrings.POSITION_UNAVAILABLE, 'error')
        break
      case 3: updateNotification(errorStrings.TIMEOUT, 'error')
        break
    }
  }
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
