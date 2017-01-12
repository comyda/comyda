function getGuarana(subscribers) {
  var numGuarana = Math.ceil(subscribers/8);
  var totalGuarana = numGuarana * 8.00;
  return {numGuarana, total: totalGuarana}
}

module.exports = {
  calcular: (participants, comedoria) => {
    const result = {foods: [], total: 0};

    participants.forEach(participant => {
      const foundFood = result.foods.find(food => food.name === participant.flavor);
      if (foundFood) {
        foundFood.quantity++;
      } else {
        result.foods.push({name: participant.flavor, quantity: 1});
      }

      const foodFromComedoria = comedoria.foods.find(food => food.name === participant.flavor);
      result.total += foodFromComedoria.price;
    });

    const guaranas = getGuarana(participants.length);
    result.total += guaranas.total;
    result.sodaTotal = guaranas.total;
    result.sodaQuantity = guaranas.numGuarana;

    return result;
  }
};
