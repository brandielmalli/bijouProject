//creating a carousel
var i= 0
var carousel = ['wolves/img1.jpeg','wolves/img1.jpeg','wolves/img2.jpeg','wolves/img3.jpeg','wolves/img4.png']
document.getElementById('previous').onclick =back
document.getElementById('next').onclick =next
function back(){
i--
if(i< 0){
i = carousel.length-1
}
document.getElementsByTagName('img')[0].src =carousel[i]
// console.log(carousel[i])
}
function next(){
i++
if(i == carousel.length){
i = 0
}
  document.getElementsByTagName('img')[0].src =carousel[i]
//console.log(carousel[i])
}
