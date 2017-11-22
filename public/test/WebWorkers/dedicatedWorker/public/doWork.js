importScripts('foo.js')
onmessage = e => {
  console.log('Message recieved from main script : ', e.data[0], ' ', e.data[1])
  let workerResult = 'Result: ' + (e.data[0] * e.data[1])
  console.log('Posting message back to main script app.a = ', app.a)
  postMessage(workerResult)
}
