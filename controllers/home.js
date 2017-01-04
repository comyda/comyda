const eventoRepository = require('../repositories/evento');
const eventoService = require('../services/evento');

module.exports = {
  index: (req, res) => {
    eventoRepository.all(docs => res.render('index', {eventos: eventoService.format(docs)}));
  }
};
