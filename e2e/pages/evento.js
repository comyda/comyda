module.exports = {
  addParticipant : (firstname, lastname , choose) => {
    element(by.id('firstname')).sendKeys(firstname);
    element(by.id('lastname')).sendKeys(lastname);
    element(by.id('choiceoffood')).sendKeys(choose);
    element(by.css('.botao input[type="submit"]')).click();
  }
}
