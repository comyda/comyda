var calculateButton = document.getElementById('calcular');
var resultadoBox = document.querySelector('.resultado');
var header = document.querySelector('header');
var wrapper = document.querySelector('.wrapper');

calculateButton.addEventListener('click', function(){
  resultadoBox.style.display = "table";

  header.classList.add('desfocado');
  wrapper.classList.add('desfocado');
});

resultadoBox.addEventListener('click', function(){
  resultadoBox.style.display = 'none';

  header.classList.remove('desfocado');
  wrapper.classList.remove('desfocado');
});
