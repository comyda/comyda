function getSodaQuantity(participants) {
  return Math.ceil(participants.length/8);
}

function getSodaTotal(participants) {
  return getSodaQuantity(participants) * 8;
}

function generateFoods(participants, comedoria) {
  function extractChooses(participants) {
    const chooses = [];

    participants.forEach(participant => {
      const foundFood = chooses.find(food => food.name === participant.flavor);
      if (foundFood) {
        foundFood.quantity++;
      } else {
        chooses.push({name: participant.flavor, quantity: 1});
      }
    });

    return chooses;
  }

  function extractFoods(chooses, comedoria) {
    const foods = [];
    chooses.forEach((choose, index) => {
      if (choose.quantity >= comedoria.dividedByPerson) {
        const quantity = Math.floor(choose.quantity / comedoria.dividedByPerson);
        foods.push({name: choose.name, quantity: quantity});
        choose.quantity %= comedoria.dividedByPerson;
        if (choose.quantity === 0) chooses.splice(index, 1);
      }
    });

    return foods;
  }

  function insertRemainingFoods(chooses, foods, comedoria, remainingQuantityOfFoods) {
    const remainingFoods = [];

    chooses.forEach(choose => {
      if (remainingQuantityOfFoods === chooses.length) {
        foods.push({name: choose.name, quantity: 1});
      } else if (remainingQuantityOfFoods >= chooses.length * 2) {
        if (remainingFoods.length < remainingQuantityOfFoods * 2) {
          remainingFoods.push({name: choose.name});
        }
      } else {
        remainingFoods.push({name: choose.name});
      }
    });

    for (let i = 0; i < remainingFoods.length; i += 2) {
      if (remainingQuantityOfFoods === 0) break;

      if (i === remainingFoods.length - 1) {
        foods.push({name: remainingFoods[i].name, quantity: 1});
        remainingQuantityOfFoods--;
      } else {
        foods.push({name: `${remainingFoods[i].name} e ${remainingFoods[i+1].name}`, quantity: 1});
        remainingQuantityOfFoods--;
      }
    }

  }

  const chooses = extractChooses(participants);
  if (comedoria.dividedByPerson === 1) {
    return chooses;
  }

  const foods = extractFoods(chooses, comedoria);
  const remainingQuantityOfChooses = chooses.reduce((accumulator, choose) => accumulator + choose.quantity, 0);
  if (remainingQuantityOfChooses === 0) {
    return foods;
  }

  let remainingQuantityOfFoods = Math.ceil(remainingQuantityOfChooses / comedoria.dividedByPerson);
  insertRemainingFoods(chooses, foods, comedoria, remainingQuantityOfFoods);

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
      foods: generateFoods(participants, comedoria),
      total: calculateTotal(participants, comedoria),
      sodaTotal: getSodaTotal(participants),
      sodaQuantity: getSodaQuantity(participants)
    };
  }
};
