var myworker = new Worker("worker.js"), width=window.innerWidth, height=window.innerHeight, context=document.getElementById('canvas').getContext('2d')
var imagedatatmp=context.createImageData(width,height)
var imageData
myworker.onmessage = function(data){
    imageData = imagedatatmp.from(data)
}

setTimeout(function draw_canvas() {
    context.putImageData(imageData)
    setTimeout(draw_canvas, 1000/60)
},10)

window.onresize = window.reload
