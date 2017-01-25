function getSodaQuantity(participants) {
  return Math.ceil(participants.length/8);
}

function getSodaTotal(participants) {
  return getSodaQuantity(participants) * 8;
}

function extractChooses(participants, comedoria) {
  const chooses = [];

  participants.forEach(participant => {
    const foundFood = chooses.find(food => food.name === participant.flavor);
    const foundFoodFromComedoria = comedoria.foods.find(food => food.name === participant.flavor);
    if (foundFood) {
      foundFood.quantity++;
    } else {
      chooses.push({name: participant.flavor, quantity: 1, price: foundFoodFromComedoria.price});
    }
  });

  return chooses;
}

function extractFoods(chooses, comedoria) {
  const foods = [];
  chooses.forEach((choose, index) => {
    if (choose.quantity >= comedoria.dividedByPerson) {
      const quantity = Math.floor(choose.quantity / comedoria.dividedByPerson);
      foods.push({name: choose.name, quantity: quantity, price: choose.price});
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
      foods.push({name: choose.name, quantity: 1, price: choose.price});
    } else if (remainingQuantityOfFoods >= chooses.length * 2) {
      if (remainingFoods.length < remainingQuantityOfFoods * 2) {
        remainingFoods.push({name: choose.name, price: choose.price});
      }
    } else {
      remainingFoods.push({name: choose.name, price: choose.price});
    }
  });

  for (let i = 0; i < remainingFoods.length; i += 2) {
    if (remainingQuantityOfFoods === 0) break;

    if (i === remainingFoods.length - 1) {
      foods.push({name: remainingFoods[i].name, quantity: 1, price: choose.price});
      remainingQuantityOfFoods--;
    } else {
      let price = undefined;
      if (remainingFoods[i].price > remainingFoods[i+1].price) price = remainingFoods[i].price;
      else price = remainingFoods[i+1].price;

      foods.push({name: `${remainingFoods[i].name} e ${remainingFoods[i+1].name}`, quantity: 1, price});
      remainingQuantityOfFoods--;
    }
  }
}

function generateFoods(participants, comedoria) {
  const chooses = extractChooses(participants, comedoria);
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

function calculateTotal(foods, participants, comedoria) {
  const totalFoods = foods.reduce((accumulator, food) => {
    return accumulator + food.quantity * food.price;
  }, 0);

  return totalFoods + getSodaTotal(participants) + comedoria.deliveryRate;
}

module.exports = {
  calcular: (participants, comedoria) => {
    const foods = generateFoods(participants, comedoria);
    return {
      foods: foods,
      total: Math.ceil(calculateTotal(foods, participants, comedoria)),
      sodaTotal: getSodaTotal(participants),
      sodaQuantity: getSodaQuantity(participants)
    };
  }
};
