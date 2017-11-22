var first = document.querySelector('#number1')
var second = document.querySelector('#number2')
var result1 = document.querySelector('.result1')

if(window.SharedWorker) {
  let myWorker = new SharedWorker('worker.js')
  console.log('myWorker : ', myWorker)
  first.onchange = () => {
    myWorker.port.postMessage([first.value, second.value])
    console.log('Message posted to worker')
  }
  second.onchange = () => {
    myWorker.port.postMessage([first.value, second.value])
    console.log('Message posted to worker')
  }
  myWorker.port.onmessage = e => {
    result1.textContent = e.data
    console.log('Message received from worker')
    console.log(e.lastEventId)
  }
}
