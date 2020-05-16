document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);



let waterValue = document.querySelector('#water').innerText  

if (waterValue === 'Only little water') {
  document.querySelector('#water').innerHTML = '<img height = 30px src ="/images/water-drop.png">'
} else if (waterValue === 'Average amount of water'){
  document.querySelector('#water').innerHTML = '<img height = 30px src ="/images/water-drop.png"> <img height = 30px src ="/images/water-drop.png">'  ;
}
else if (waterValue === 'Big amount of water'){
  document.querySelector('#water').innerHTML ='<img height = 30px src ="/images/water-drop.png"> <img height = 30px src ="/images/water-drop.png"> <img height = 30px src ="/images/water-drop.png">' ;
}

let position = document.querySelector('#position').innerText 

if (position === 'Full Sun') {
  document.querySelector('#position').innerHTML = '<img height = 30px src ="/images/sun.png">'
} else if (position === 'Shade'){
  document.querySelector('#position').innerHTML = '<img height = 30px src ="/images/cloud.png">'
} else if (position === 'Partial Shade') {
  document.querySelector('#position').innerHTML = '<img height = 40px src ="/images/partial-shade.png">'
}