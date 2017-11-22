const imageLoad = url => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.responseType = 'blob'
    request.onload = () => {
      if (request.status === 200) {
        console.log('request = ', request)
        resolve(request.responseURL)
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText))
      }
    }
    request.onerror = () => {
      reject(Error('There was a network error.'))
    }
    request.send()
  })
}

const imagesDiv = document.getElementById('images')
let myImage = new Image()
imageLoad('clear.png').then(response => {
  console.log('response = ', response)
  myImage.src = response
  imagesDiv.appendChild(myImage)
}).catch(err => {
  console.log(err)
})
