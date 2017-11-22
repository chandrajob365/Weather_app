onmessage = e => {
  console.log('<Worker.js> Message recieved from main thread')
  postMessage(e.data + 'line created')
  console.log('<Worker.js> Message sending back to main thread')
}
