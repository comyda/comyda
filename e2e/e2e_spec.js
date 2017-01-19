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
    element(by.id('time')).sendKeys('200120171000');
    element(by.css('.botao input[type="submit"]')).click();
  });
});
