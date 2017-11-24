window.onload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(reg => {
        console.log('Service worker Registered sw scope = ', reg.scope)
      })
      .catch(err => console.log('SW Registration error : ', err))
  }
}
