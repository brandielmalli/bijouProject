var minus = document.getElementById("btn-minus");
var plus = document.getElementById("btn-plus");
var count = document.getElementById("count");

var trash = document.getElementsByClassName("fa-trash");


  minus.addEventListener('click', function(){
    console.log(count.value)
    console.log("skrrr")
    let newCount = parseInt(count.value) - 1;
    console.log(newCount)
    count.value = newCount
    // fetch('table', {
    //   method: 'put',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     'capacity': newCount,
    //   })
    // })
    // .then(response => {
    //   if (response.ok) return response.json()
    // })
    // .then(data => {
    //   console.log(data)
    //   // window.location.reload(true)
    // })
  });

  plus.addEventListener('click', function(){
    console.log(count.value)
    console.log("skrrr")
    let newCount = parseInt(count.value) + 1;
    console.log(newCount)
    count.value = newCount
    // fetch('table', {
    //   method: 'put',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     'capacity': newCount,
    //   })
    // })
    // .then(response => {
    //   if (response.ok) return response.json()
    // })
    // .then(data => {
    //   console.log(data)
    //   // window.location.reload(true)
    // })
  });




//
// Array.from(plus).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const capacity = this.parentNode.parentNode.childNodes[3].innerText
//         const plus = parseint(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('table', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'capacity': capacity,
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('trash', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
            // 'email': email
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
