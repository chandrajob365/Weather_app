onconnect = function(e) {
  var port = e.ports[0];
  console.log('e = ', e)
  port.onmessage = e => {
    console.log('Entry to worker')
    let result = 'Result: ' + (e.data[0] * e.data[1])
    console.log('Posting result back to main thread result = ', result)
    port.postMessage(result)
  }
}
