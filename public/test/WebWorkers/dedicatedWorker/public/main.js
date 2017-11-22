const first = document.querySelector('#number1')
const second = document.querySelector('#number2')
let result = document.querySelector('.result')
console.log('From main.js........')
if(window.Worker) {
  let worker = new Worker('doWork.js')
  first.onchange = () => {
    worker.postMessage([first.value, second.value])
    console.log('Message posted to worker from first')
  }
  second.onchange = () => {
    worker.postMessage([first.value, second.value])
    console.log('Message posted to worker from second')
  }
  worker.onmessage = e => {
    result.textContent = e.data
    console.log('result = ', result)
    console.log('Message recived from worker e.data = ', e.data)
  }
}
