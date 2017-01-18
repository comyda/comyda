describe('Oxifood', () => {
  it('deve ter um título', () => {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('oxiFood');
  });
});
