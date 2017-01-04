const eventoRepository = require('../repositories/evento');

module.exports = {
  index: (req, res) => {
    eventoRepository.all(docs => res.render('index', {eventos:docs}));
  }
};
