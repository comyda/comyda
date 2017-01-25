module.exports = {
  createEvent: (restaurant, ownername, name, time) => {
    element(by.tagName('select')).sendKeys(restaurant);
    element(by.id('name')).sendKeys(ownername);
    element(by.id('event')).sendKeys(name);
    element(by.id('time')).sendKeys(time);
    element(by.css('.botao input[type="submit"]')).click();
  }
};
