const eventoRepository = require('../repositories/evento');
const eventoService = require('../services/evento');

module.exports = {
  index: (req, res) => {
    eventoRepository.allFormated(eventos => res.render('index', {eventos: eventoService.format(eventos)}));
  }
};
