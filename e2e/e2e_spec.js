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
      db.collection('eventos').deleteMany();
      db.collection('participar').deleteMany();
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

    expect(element(by.css('.nomedoevento')).getText()).toBe('Evento Teste');
    expect(element(by.css('.who')).getText()).toBe('O evento Evento Teste criado por Nome do responsavel está pedindo em Brasileirinho');
    expect(element(by.css('.closes')).getText()).toBe('O pedido encerra em 20/01 às 08:00');
    expect(element(by.css('.delivery')).getText()).toBe('O evento acontecerá em 20/01 às 10:00');
  });

  it('deve ordenar os eventos corretamente', () => {
    homePage.goToCreationEventPage();
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento 1', '010120001000');
    homePage.goToCreationEventPage();
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento 2', '010120951000');
    homePage.goToCreationEventPage();
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento 3', '010120901000');

    const eventNames = element.all(by.css('.nomedoevento'));
    expect(eventNames.get(0).getText()).toBe('Evento 3');
    expect(eventNames.get(1).getText()).toBe('Evento 2');
    expect(eventNames.get(2).getText()).toBe('Evento 1');
  });

  it('deve cancelar um evento', () => {
    homePage.goToCreationEventPage();
    expect(browser.getTitle()).toEqual('Crie seu evento');
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
    homePage.goToEventPage();
    element(by.id('cancelar')).click();
    const alertDialog = browser.switchTo().alert();
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

  describe('quando cadastra dois usuários com mesmo nome e sobrenome', () => {
    it('deve exibir uma mensagem de informação', () => {
      homePage.goToCreationEventPage();
      eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');
      homePage.goToEventPage();
      eventoPage.addParticipant('Rayana','Goncalves','Arroz a grega');
      eventoPage.addParticipant('Rayana','Goncalves','Arroz carreteiro');

      const alertDialog = browser.switchTo().alert();
      expect(alertDialog.getText()).toBe('Nome e Sobrenome já cadastrado no evento');
      alertDialog.accept();

      element.all(by.css('.content table tbody tr td:first-child')).then(participantNames => {
        expect(participantNames.length).toBe(2);
        expect(participantNames[0].getText()).toBe('Rayana Goncalves');
      });
    });
  });
});
