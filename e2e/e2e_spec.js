describe('Oxifood', () => {
  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:3000');
  });

  it('deve ter um título', () => {
    expect(browser.getTitle()).toEqual('oxiFood');
  });

  xit('deve criar um evento', () => {
    element(by.className('button')).click();
    expect(browser.getTitle()).toEqual('Crie seu evento');

    element(by.tagName('select')).sendKeys('Brasileirinho');
    element(by.id('name')).sendKeys('Nome do responsavel');
    element(by.id('event')).sendKeys('Evento Teste');
    element(by.id('time')).sendKeys('01202017 1200');

    element(by.css('.botao input[type="submit"]')).click();
  });
});
