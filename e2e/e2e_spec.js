const MongoClient = require('mongodb').MongoClient;


describe('Oxifood', () => {
  beforeEach(() => {
    const url = 'mongodb://localhost:27017/oxifood';

    MongoClient.connect(url, (err, db) => {
      db.collection('eventos').deleteMany()
      db.close();
    });
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:3000');
  });

  it('deve ter um título', () => {
    expect(browser.getTitle()).toEqual('oxiFood');
  });

  it('deve criar um evento', () => {
    element(by.className('button')).click();
    expect(browser.getTitle()).toEqual('Crie seu evento');

    element(by.tagName('select')).sendKeys('Brasileirinho');
    element(by.id('name')).sendKeys('Nome do responsavel');
    element(by.id('event')).sendKeys('Evento Teste');
    element(by.id('time')).sendKeys('200120901000');
    element(by.css('.botao input[type="submit"]')).click();
    let list = element.all(by.css('tr td'));
    expect(list.get(0).getText()).toBe('Evento Teste');
    expect(list.get(1).getText()).toBe('Nome do responsavel');
    expect(list.get(2).getText()).toBe('Brasileirinho');
    expect(list.get(3).getText()).toBe('20/01 às 10:00');
    expect(list.get(4).getText()).toBe('20/01 às 08:00');





  });


});
