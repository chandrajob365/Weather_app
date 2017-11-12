const APPKEY = '6d0e3f929541145218c53f14a59c7aa2'
const GPLACEAPPKEY = 'AIzaSyAWc4-9-Dy6nJ_1hDUcQjX1_ZxhwzIsVw4'
const app = {
  availableCards: {},
  container: document.querySelector('.main'),
  weatherTemplate: document.querySelector('.weatherTemplate'),
  isLoading: true,
  spinner: document.querySelector('.app-loader')
}
const initialWeatherForecast = {
  name: 'Bangalore',
  dt: 1510291800,
  weather: [{id: 801, main: 'Cloudy'}],
  main: {
    temp: 23,
    scale: '°F',
    humidity: 55
  },
  wind: {
    speed: 30,
    scale: 'mps',
    deg: '43'
  },
  sys: {
    country: 'IN',
    sunrise: 1510274776,
    sunset: 1510316436
  }
}

const getFormatedDate = epoch => {
  var dt = new Date(epoch * 1000)
  console.log('epoch = ', epoch, ' dt = ', dt)
  return (format) => {
    return converter(dt.toString(), format)
  }
}

const converter = (dt, format) => {
  console.log('dt = ', dt)
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
  console.log('<getIconClass> currentWeatherNature = ', weatherId)
  if (weatherId >= 200 && weatherId <= 232) return 'thunderstorms'
  if (weatherId >= 300 && weatherId <= 321) return 'scattered-showers'
  if (weatherId >= 500 && weatherId <= 531) return 'rain'
  if (weatherId >= 600 && weatherId <= 622) return 'snow'
  if (weatherId >= 700 && weatherId <= 781) return 'fog'
  if (weatherId === 800) return 'clear'
  if (/80[1-4]/.test(weatherId)) return 'cloudy'
}

const populateUpdatedData = (data) => {
  console.log('dataLastUpdated = ', getFormatedDate(data.dt)('lastUpdated'), ' data.dt = ', data.dt)
  let dataLastUpdated = data.dt
  let card = app.availableCards[data.name]
  if (!card) {
    card = app.weatherTemplate.cloneNode(true)
    // card.classList.remove('weatherTemplate')
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
  card.querySelector('.wind ').textContent = windVal + ' ' + windScale + ' ' + Math.round(windDirection) + '°'
  card.querySelector('.sunrise').textContent = sunrise
  card.querySelector('.sunset').textContent = sunset
  document.querySelector('.app-loader').setAttribute('hidden', true)
}

app.fetchForecast = (lat, lng) => {
  console.log('<app.js, fetchForecast> lat = ', lat, ' lng = ', lng)
  const URL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + APPKEY + '&units=metric&units=imperial'
  const request = new XMLHttpRequest()
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      let response = JSON.parse(request.response)
      console.log('<app.js, fetchForecast> response = ', response)
      populateUpdatedData(response)
    } else {
      populateUpdatedData(initialWeatherForecast)
    }
  }
  request.open('GET', URL)
  document.querySelector('.app-loader').removeAttribute('hidden')
  request.send()
}

const fetchData = () => {
  let newLoc = document.getElementById('newLoc')
  console.log('newLoc.length = ', newLoc.value.length)
  if (newLoc.value.length > 0) fetchForecast(newLoc.value)
  newLoc.value = ''
  newLoc.focus()
}

populateUpdatedData(initialWeatherForecast)
