var mac = {
  comedoriaName: "Mc Donald's",
  comedoriaNumber: "(81)34853732",
  comedoriaProduct: "Hamburguer"
};

var contacts = [mc];

function printComedoria (comedoria) {
  console.log(comedoria.comedoriaName);
};

function list() {
	var contactsLength = contacts.length;
	for (var i = 0; i < contactsLength; i++) {
		printComedoria(contacts[i]);
	};
};

function add (comedoriaName, comedoriaNumber, comedoriaProduct) {
  contacts[contacts.length] = {
    comedoriaName: comedoriaName,
    comedoriaNumber: comedoriaNumber,
    comedoriaProduct: comedoriaProduct
  };
};
add("lanchonete", "(81)83295834", "coxinha");
list();
