if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {scope: '/'})
   .then(reg => {
     console.log('Registration succeeded. Scope is: ' + reg.scope)
   }).catch(err => {
     console.log('Registration failed with ' + err)
   })
}
const imageLoad = imgJSON => {
  return new Promise ((resolve, reject) => {
    let request = new XMLHttpRequest()
    request.open('GET', imgJSON.url)
    request.responseType = 'blob'
    request.onload = () => {
      if (request.status === 200) {
        let arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse)
      } else {
        reject(Error('Image didn\'t load successfully error code:' + request.statusText))
      }
    }
    request.onerror = () => {
      reject(Error('There was a network error'))
    }
    request.send()
  })
}

const imgSection = document.querySelector('section')
window.onload = () => {
  console.log('Inside window load event')
  Gallery.images.forEach(imgJSON => {
    console.log('imgJSON = ', imgJSON)
    imageLoad(imgJSON)
      .then(arrayResponse => {
        console.log('arrayResponse = ', arrayResponse)
        var myImage = document.createElement('img')
        var myFigure = document.createElement('figure')
        var myCaption = document.createElement('caption')
        var imageURL = window.URL.createObjectURL(arrayResponse[0])
        myImage.src = imageURL
        myImage.setAttribute('alt', arrayResponse[1].alt)
        myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit

        imgSection.appendChild(myFigure)
        myFigure.appendChild(myImage)
        myFigure.appendChild(myCaption)
      }).catch(err => {
        console.log(err)
      })
  })
}
