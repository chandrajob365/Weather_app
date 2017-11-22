const button = document.getElementById('add')
const div = document.getElementById('newVals')
let i = 0
if(window.Worker) {
  let myWorker = new Worker('worker.js')

  button.addEventListener('click', e => {
    myWorker.postMessage(++i)
  })
  myWorker.onmessage = e => {
    console.log('<main.js> Message recieved from worker')
    let innerDiv = document.createElement('div')
    innerDiv.appendChild(document.createTextNode(e.data))
    div.appendChild(innerDiv)
  }
}
