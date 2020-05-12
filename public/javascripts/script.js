document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);



let waterValue = document.querySelector('#water').innerText  

if (waterValue === 'Only little water') {
  document.querySelector('#water').innerHTML = '<img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'
} else if (waterValue === 'Average amount of water'){
  document.querySelector('#water').innerHTML ='<img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'  ;
}
else if (waterValue === 'Big amount of water'){
  document.querySelector('#water').innerHTML ='<img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg" <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg"> <img height = 20px src ="https://d29fhpw069ctt2.cloudfront.net/icon/image/49039/preview.svg">'  ;
}

