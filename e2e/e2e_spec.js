const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const app = require('../app');
const eventoPage = require('./pages/evento');
const homePage = require('./pages/home');
const eventCreationPage = require('./pages/event_creation');
const PORT = 3000;

function getFutureDate() {
  let today = new Date();
  today.setYear(today.getFullYear() + 7);

  return today;
}

function formatDateAsString(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return day + month + year + hours + minutes;
}

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
    console.log(formatDateAsString(getFutureDate()));
    eventCreationPage.createEvent('Brasileirinho', 'Nome do responsavel', 'Evento Teste', '200120901000');

    expect(element(by.css('.nomedoevento')).getText()).toBe('Evento Teste');
    expect(element(by.css('.who')).getText()).toBe('Nome do responsavel está pedindo em Brasileirinho');
    expect(element(by.css('.closes')).getText()).toBe('O pedido encerra em 20/01 às 08:00');
    expect(element(by.css('.delivery')).getText()).toBe('O evento acontecerá em 20/01 às 10:00');
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
