const { Pessoa } = require('../../models');

function criarPessoa(_id, pessoaParam) {
  return Pessoa
    .findByIdAndUpdate(_id, { _id, ...pessoaParam }, { upsert: true, runValidators: true });
}

function pegarPessoaFlat(_id) {
  return Pessoa.findById(_id).select('-Movimentos -Servicos -Aliquotas -Totais');
}

function pegarTodasPessoasFlat() {
  return Pessoa.find({}).select('-Movimentos -Servicos -Aliquotas -Totais');
}

function pegarTodasPessoas() {
  return Pessoa.find({});
}

function pegarTodasAliquotas() {
  return Pessoa.find({}).select('-Movimentos -Servicos -Totais -endereco');;
}

function pegarTodosTotais() {
  return Pessoa.find({}).select('-Movimentos -Servicos -Aliquotas -endereco');
}

function pegarTodosMovimentos() {
  return Pessoa.find({}).select('-endereco -Servicos -Aliquotas -Totais');
}

function pegarTodosServicos() {
  return Pessoa.find({}).select('-Movimentos -endereco -Aliquotas -Totais');
}

module.exports = {
  criarPessoa,
  pegarPessoaFlat,
  pegarTodasPessoas,
  pegarTodasAliquotas,
  pegarTodasPessoasFlat,
  pegarTodosTotais,
  pegarTodosMovimentos,
  pegarTodosServicos,
};
