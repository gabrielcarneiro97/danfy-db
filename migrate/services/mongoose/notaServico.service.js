const { NotaServico } = require('../../models');

function criarNotaServico(notaServicoParam) {
  return NotaServico
    .findByIdAndUpdate(
      notaServicoParam.emitente + notaServicoParam.geral.numero,
      notaServicoParam,
      { upsert: true, runValidators: true },
    );
}

function pegarNotaServicoChave(chave) {
  return NotaServico.findById(chave);
}

function pegarTodasNotasServico(params) {
  return NotaServico.find({});
}

module.exports = {
  criarNotaServico,
  pegarNotaServicoChave,
  pegarTodasNotasServico,
};
