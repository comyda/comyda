const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const app = require('../app');
const eventoPage = require('./pages/evento');
const homePage = require('./pages/home');
const eventCreationPage = require('./pages/event_creation');
const PORT = 3000;

describe('Oxifood', () => {
  let server;

  beforeAll(() => server = http.createServer(app));

  afterAll(() => server.close());

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
    homePage.goToCreationEventPage();
    expect(browser.getTitle()).toEqual('Crie seu evento');
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
    let list = element.all(by.css('tr td'));
    expect(list.get(0).getText()).toBe('Evento Teste');
    expect(list.get(1).getText()).toBe('Nome do responsavel');
    expect(list.get(2).getText()).toBe('Brasileirinho');
    expect(list.get(3).getText()).toBe('20/01 às 10:00');
    expect(list.get(4).getText()).toBe('20/01 às 08:00');
  });

  it('deve cancelar um evento', () => {
    homePage.goToCreationEventPage();
    expect(browser.getTitle()).toEqual('Crie seu evento');
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
    homePage.goToEventPage();
    element(by.id('cancelar')).click();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    alertDialog.accept();
  });

  it('deve participar de um evento', () => {
    homePage.goToCreationEventPage();
    expect(browser.getTitle()).toEqual('Crie seu evento');
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
    homePage.goToEventPage();
    eventoPage.addParticipant('Rayana','Goncalves','Arroz a grega');
    let list = element.all(by.css('tr td'));
    expect(list.get(0).getText()).toBe('Rayana Goncalves');
    expect(list.get(1).getText()).toBe('Arroz a grega');
  });

  it('deve calcular o resultado', () => {
    homePage.goToCreationEventPage();
    expect(browser.getTitle()).toEqual('Crie seu evento');
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
    homePage.goToEventPage();
    eventoPage.addParticipant('Rayana','Goncalves','Arroz a grega');
    eventoPage.addParticipant('Leonardo','Bezerra','Arroz carreteiro');
    element(by.id('calcular')).click();
  });

  describe('quando acessa eventos inexistentes', () => {
    it('deve voltar para home', () => {
      browser.get('http://localhost:3000/eventos/idnãoexistente');
      expect(browser.getTitle()).toEqual('oxiFood');
    });
  });

  xdescribe('quando cadastra dois usuários com mesmo nome e sobrenome',() => {
    it('deve exibir uma mensagem de informação', () => {

    });
  });
});
