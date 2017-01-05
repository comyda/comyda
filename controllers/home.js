const eventoRepository = require('../repositories/evento');
const eventoService = require('../services/evento');

module.exports = {
  index: (req, res) => {
    eventoRepository.all(eventos => res.render('index', {eventos: eventoService.format(eventos)}));
  }
};
