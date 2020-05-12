document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);



let waterValue = document.querySelector('#water').innerText  

if (waterValue === 'Only little water') {
  document.querySelector('#water').innerHTML = '<img height = 30px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'
} else if (waterValue === 'Average amount of water'){
  document.querySelector('#water').innerHTML ='<img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'  ;
}
else if (waterValue === 'Big amount of water'){
  document.querySelector('#water').innerHTML ='<img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg" <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'  ;
}

let position = document.querySelector('#position').innerText

if (position === 'Sun'){
  document.querySelector('#position').innerHTML = '<img height = 30px src="https://image.flaticon.com/icons/svg/169/169367.svg">'
} else if (position === 'Shadow'){
  document.querySelector('#position').innerHTML = '<img height = 30px src = "https://image.flaticon.com/icons/svg/117/117995.svg">'
}