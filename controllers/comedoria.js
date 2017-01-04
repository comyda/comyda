const comedoriaRepository = require('../repositories/comedoria');

module.exports = {
  create: (req, res) => {
    comedoriaRepository.add(req.body, () => res.redirect('/'))
  }
};
