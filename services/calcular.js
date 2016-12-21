module.exports = {
  getPizzas: function(subscribers) {
    var numPizza = Math.ceil(subscribers/4);
    var totalPizza = numPizza * 27.00;
    return {numPizza, total: totalPizza};
},
  getGuarana: function(subscribers) {
    var numGuarana = Math.ceil(subscribers/8);
    var totalGuarana = numGuarana * 8.00;
    return {numGuarana, total: totalGuarana}
  }
};
