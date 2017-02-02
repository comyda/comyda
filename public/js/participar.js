var calculateButton = document.getElementById('calcular');
var resultadoBox = document.querySelector('.resultado');
var header = document.querySelector('header');
var wrapper = document.querySelector('.wrapper');

new Vue({
  el: 'form',
  data: {
    firstname: '',
    lastname: '',
    choiceOfFood:''
  },
  mounted: function() {
    this.eventId = location.pathname.split('/')[2];
  },
  methods: {
    validateBeforeSending: function(event) {
      event.preventDefault();

      var url = '/eventos/' + this.eventId + '/participants';
      var params = {firstname: this.firstname, lastname: this.lastname};
      this.$http.get(url, {params: params}).then((response) => {
        if (response.body.length > 0) {
          alert('Nome e Sobrenome já cadastrado no evento');
        }
        else if (this.firstname.trim().length === 0 ||
          this.lastname.trim().length === 0 ||
          this.choiceOfFood.trim().length === 0) {
            alert('Preencha todos os campos');
        }
        else {
          document.querySelector('form').submit();
        }
      });
    }
  }
});

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
