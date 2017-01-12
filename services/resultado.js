function getSodaQuantity(participants) {
  return Math.ceil(participants.length/8);
}

function getSodaTotal(participants) {
  return getSodaQuantity(participants) * 8.00;
}

function generateFoods(participants) {
  const foods = [];
  participants.forEach(participant => {
    const foundFood = foods.find(food => food.name === participant.flavor);
    if (foundFood) {
      foundFood.quantity++;
    } else {
      foods.push({name: participant.flavor, quantity: 1});
    }
  });

  return foods;
}

function calculateTotal(participants, comedoria) {
  let total = 0;
  participants.forEach(participant => {
    const foodFromComedoria = comedoria.foods.find(food => food.name === participant.flavor);
    total += foodFromComedoria.price;
  });

  total += getSodaTotal(participants);

  return total;
}

module.exports = {
  calcular: (participants, comedoria) => {
    return {
      foods: generateFoods(participants),
      total: calculateTotal(participants, comedoria),
      sodaTotal: getSodaTotal(participants),
      sodaQuantity: getSodaQuantity(participants)
    };
  }
};
