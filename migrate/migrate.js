const { pegarPessoaFlat, pegarTodasPessoasFlat, pegarNotaChave, pegarTodasNotas, pegarTodasNotasServico, pegarNotaServicoChave, pegarTodasAliquotas, pegarTodosTotais, pegarTodosMovimentos, pegarTodosServicos, pegarDominioId } = require('./services');
const pg = require('knex')({
  client: 'pg',
  connection: 'postgres://postgres:123456@localhost/danfy',
  searchPath: ['knex', 'danfy'],
});

const icmsEstados = {
  SC: {
    externo: 0.12,
    interno: 0.12,
  },
  DF: {
    externo: 0.07,
    interno: 0.12,
  },
  MS: {
    externo: 0.07,
    interno: 0.17,
  },
  MT: {
    externo: 0.07,
    interno: 0.17,
  },
  SP: {
    externo: 0.12,
    interno: 0.18,
  },
  RJ: {
    externo: 0.12,
    interno: 0.18,
  },
  GO: {
    externo: 0.07,
    interno: 0.17,
  },
  RO: {
    externo: 0.07,
    interno: 0.175,
  },
  ES: {
    externo: 0.07,
    interno: 0.12,
  },
  AC: {
    externo: 0.07,
    interno: 0.17,
  },
  CE: {
    externo: 0.07,
    interno: 0.17,
  },
  PR: {
    externo: 0.12,
    interno: 0.18,
  },
  PI: {
    externo: 0.07,
    interno: 0.17,
  },
  PE: {
    externo: 0.12,
    interno: 0.18,
  },
  MA: {
    externo: 0.07,
    interno: 0.18,
  },
  PA: {
    externo: 0.07,
    interno: 0.17,
  },
  RN: {
    externo: 0.07,
    interno: 0.18,
  },
  BA: {
    externo: 0.07,
    interno: 0.18,
  },
  RS: {
    externo: 0.12,
    interno: 0.18,
  },
  TO: {
    externo: 0.07,
    interno: 0.18,
  },
};

function getEstado(sigla) {
  return {
    AC: 1,
    AL: 2,
    AM: 3,
    AP: 4,
    BA: 5,
    CE: 6,
    DF: 7,
    ES: 8,
    GO: 9,
    MA: 10,
    MG: 11,
    MS: 12,
    MT: 13,
    PA: 14,
    PB: 15,
    PE: 16,
    PI: 17,
    PR: 18,
    RJ: 19,
    RN: 20,
    RO: 21,
    RR: 22,
    RS: 23,
    SC: 24,
    SE: 25,
    SP: 26,
    TO: 27,
  }[sigla];
}

function round(num) {
  return Math.round(parseFloat(num) * 100) / 100;
}

// pegarTodosServicos().then((dados) => {
//   console.log('começou');
//   dados.forEach((pessoa) => {
//     const { Servicos } = pessoa;

//     Servicos.forEach((serv) => {
//       const servico = {
//         dono_cpfcnpj: pessoa._id,
//         nota_chave: serv.nota,
//         conferido: serv.conferido,
//         data_hora: serv.data,
//         valor: round(serv.valores.servico),
//       };

//       const servico_imposto = {
//         cofins: round(serv.valores.impostos.cofins),
//         csll: round(serv.valores.impostos.csll),
//         irpj: round(serv.valores.impostos.irpj),
//         iss: round(serv.valores.impostos.iss),
//         pis: round(serv.valores.impostos.pis),
//         total: round(serv.valores.impostos.total),
//       };

//       const servico_retencao = {
//         cofins: round(serv.valores.impostos.retencoes.cofins),
//         csll: round(serv.valores.impostos.retencoes.csll),
//         irpj: round(serv.valores.impostos.retencoes.irpj),
//         iss: round(serv.valores.impostos.retencoes.iss),
//         pis: round(serv.valores.impostos.retencoes.pis),
//         total: round(serv.valores.impostos.retencoes.total) || 0,
//       };

//       pg.insert(servico_retencao).returning('id').into('tb_retencao').then(([ servico_retencao_id ]) => {
//         servico.retencao_id = servico_retencao_id;
//         pg.insert(servico_imposto).returning('id').into('tb_imposto').then(([ servico_imposto_id ]) => {
//           servico.imposto_id = servico_imposto_id;
//           pg.insert(servico).into('tb_servico').catch(err => console.error(err));
//         });
//       });

//     });
//   });
// });

// async function migrarMovimentos() {
//   console.log('começou');
//   const dados = await pegarTodosMovimentos();

//   console.log('pegou dados');

//   for (let pessoa of dados) {
//     const { Movimentos } = pessoa;

//     if (Movimentos) {
//       for (mov of Movimentos) {
//         if (mov.conferido) {
//           const movimento = {
//             dono_cpfcnpj: pessoa._id,
//             nota_inicial_chave: mov.notaInicial,
//             nota_final_chave: mov.notaFinal,
//             conferido: mov.conferido,
//             data_hora: mov.data,
//             lucro: mov.valores.lucro,
//             valor_saida: mov.valores.valorSaida,
//           };

//           const movimento_imposto = {
//             cofins: round(mov.valores.impostos.cofins),
//             csll: round(mov.valores.impostos.csll),
//             irpj: round(mov.valores.impostos.irpj),
//             pis: round(mov.valores.impostos.pis),
//             total: round(mov.valores.impostos.total),
//           }

//           const movimento_imposto_icms = {
//             base_calculo: round(mov.valores.impostos.icms.baseDeCalculo),
//             proprio: round(mov.valores.impostos.icms.proprio),
//             difal_destino: mov.valores.impostos.icms.difal ? round(mov.valores.impostos.icms.difal.destino) : 0,
//             difal_origem: mov.valores.impostos.icms.difal ? round(mov.valores.impostos.icms.difal.origem) : 0,
//           };

//           const movimento_meta_dados = {
//             email: mov.metaDados ? mov.metaDados.criadoPor : '',
//             md_data_hora: mov.metaDados ? new Date(mov.metaDados.dataCriacao) : new Date(),
//             tipo: mov.metaDados ? mov.metaDados.tipo : 'PRIM',
//             ativo: mov.metaDados ? mov.metaDados.status === 'ATIVO' : true,
//           };

//           const [imposto_icms_id] = await pg.insert(movimento_imposto_icms).returning('id').into('tb_icms');
//           movimento_imposto.icms_id = imposto_icms_id;

//           const [movimento_imposto_id] = await pg.insert(movimento_imposto).returning('id').into('tb_imposto');
//           movimento.imposto_id = movimento_imposto_id;

//           const [movimento_meta_dados_id] = await pg.insert(movimento_meta_dados).returning('md_id').into('tb_meta_dados');
//           movimento.meta_dados_id = movimento_meta_dados_id;

//           await pg.insert(movimento).into('tb_movimento');
//         }
//       }

//       console.log('Acabou pessoa:', pessoa._id);
//     }
//   }
// }
// migrarMovimentos();

// pegarTodosMovimentos().then((dados) => {
//   dados.forEach((pessoa) => {
//     const { Movimentos } = pessoa;
//     Movimentos.forEach((mov) => {

//     });
//   });
// });

// pegarTodosTotais().then((data) => {
//   data.forEach((pessoa) => {
//     const { Totais } = pessoa;

//     if (Totais.length > 0) {
//       Totais.forEach((t) => {
//         const { movimentos, servicos, totais } = t;
//         const total = {
//           dono_cpfcnpj: pessoa._id,
//           anual: false,
//           data_hora: t.competencia,
//         };

//         const movimento = {
//           valor_saida: round(movimentos.totalSaida),
//           lucro: round(movimentos.lucro),
//         };

//         const movimento_imposto = {
//           cofins: round(movimentos.impostos.cofins),
//           csll: round(movimentos.impostos.csll),
//           irpj: round(movimentos.impostos.irpj),
//           pis: round(movimentos.impostos.pis),
//           total: round(movimentos.impostos.total),
//         };

//         const movimento_imposto_icms = {
//           base_calculo: round(movimentos.impostos.icms.baseDeCalculo),
//           proprio: round(movimentos.impostos.icms.proprio),
//           difal_destino: movimentos.impostos.icms.difal ? round(movimentos.impostos.icms.difal.destino) : 0,
//           difal_origem: movimentos.impostos.icms.difal ? round(movimentos.impostos.icms.difal.origem) : 0,
//         };

//         // console.log(movimento, movimento_imposto, movimento_imposto_icms);

//         const pMov = new Promise((resolve) => {
//           pg.insert(movimento_imposto_icms).returning('id').into('tb_icms').then(([movimento_icms_id]) => {
//             movimento_imposto.icms_id = movimento_icms_id;
//             pg.insert(movimento_imposto).returning('id').into('tb_imposto').then(([movimento_imposto_id]) => {
//               movimento.imposto_id = movimento_imposto_id;
//               pg.insert(movimento).returning('id').into('tb_total_movimento').then(([mov_id]) => {
//                 total.total_movimento_id = mov_id;
//                 resolve();
//               });
//             });
//           });
//         });

//         const servico = {
//           total: round(servicos.total),
//         };

//         const servico_imposto = {
//           cofins: round(servicos.impostos.cofins),
//           csll: round(servicos.impostos.csll),
//           irpj: round(servicos.impostos.irpj),
//           iss: round(servicos.impostos.iss),
//           pis: round(servicos.impostos.pis),
//           total: round(servicos.impostos.total),
//         };

//         const servico_retencao = {
//           cofins: round(servicos.impostos.retencoes.cofins),
//           csll: round(servicos.impostos.retencoes.csll),
//           irpj: round(servicos.impostos.retencoes.irpj),
//           iss: round(servicos.impostos.retencoes.iss),
//           pis: round(servicos.impostos.retencoes.pis),
//           total: round(servicos.impostos.retencoes.total),
//         };

//         // console.log(servico, servico_imposto, servico_retencao);

//         const pServ = new Promise((resolve) => {
//           pg.insert(servico_retencao).returning('id').into('tb_retencao').then(([servico_retencao_id]) => {
//             servico.retencao_id = servico_retencao_id;
//             pg.insert(servico_imposto).returning('id').into('tb_imposto').then(([servico_imposto_id]) => {
//               servico.imposto_id = servico_imposto_id;
//               pg.insert(servico).returning('id').into('tb_total_servico').then(([serv_id]) => {
//                 total.total_servico_id = serv_id;
//                 resolve();
//               });
//             });
//           });
//         });

//         const soma = {
//           valor_movimento: round(totais.lucro),
//           valor_servico: round(totais.servicos),
//         };

//         const soma_imposto = {
//           cofins: round(totais.impostos.cofins),
//           csll: round(totais.impostos.csll),
//           irpj: round(totais.impostos.irpj),
//           iss: round(totais.impostos.iss),
//           pis: round(totais.impostos.pis),
//           total: round(totais.impostos.total),
//         };

//         const soma_imposto_icms = {
//           base_calculo: round(totais.impostos.icms.baseDeCalculo),
//           proprio: round(totais.impostos.icms.proprio),
//           difal_destino: totais.impostos.icms.difal ? round(totais.impostos.icms.difal.destino) : 0,
//           difal_origem: totais.impostos.icms.difal ? round(totais.impostos.icms.difal.origem) : 0,
//         };

//         const soma_retencao = {
//           cofins: round(totais.impostos.retencoes.cofins),
//           csll: round(totais.impostos.retencoes.csll),
//           irpj: round(totais.impostos.retencoes.irpj),
//           iss: round(totais.impostos.retencoes.iss),
//           pis: round(totais.impostos.retencoes.pis),
//           total: round(totais.impostos.retencoes.total),
//         };

//         const soma_acumulado = {
//           cofins: round(totais.impostos.acumulado.cofins),
//           pis: round(totais.impostos.acumulado.pis),
//         };

//         // console.log(soma, soma_imposto, soma_imposto_icms, soma_retencao, soma_acumulado);

//         const pSoma = new Promise((resolve) => {
//           pg.insert(soma_acumulado).returning('id').into('tb_acumulado').then(([soma_acumulado_id]) => {
//             soma.acumulado_id = soma_acumulado_id;
//             pg.insert(soma_retencao).returning('id').into('tb_retencao').then(([soma_retencao_id]) => {
//               soma.retencao_id = soma_retencao_id;
//               pg.insert(soma_imposto_icms).returning('id').into('tb_icms').then(([soma_imposto_icms_id]) => {
//                 soma_imposto.icms_id = soma_imposto_icms_id;
//                 pg.insert(soma_imposto).returning('id').into('tb_imposto').then(([soma_imposto_id]) => {
//                   soma.imposto_id = soma_imposto_id;
//                   pg.insert(soma).returning('id').into('tb_total_soma').then(([soma_id]) => {
//                     total.total_soma_id = soma_id;
//                     resolve();
//                   });
//                 });
//               });
//             });
//           });
//         });

//         Promise.all([pMov, pServ, pSoma]).then(() => {
//           pg.insert(total).into('tb_total').catch((err) => {
//             console.error(err);
//           });
//         });
//       });
//     }

//   });
// });

// pegarTodasAliquotas().then((dados) => {
//   dados.forEach((pessoa) => {
//     const { Aliquotas } = pessoa;
//     if (Aliquotas.length > 0) {
//       Aliquotas.forEach((aliq) => {
//         const aliquota = {
//           dono_cpfcnpj: pessoa._id,
//           cofins: parseFloat(aliq.cofins),
//           csll: parseFloat(aliq.csll),
//           forma_pagamento: aliq.formaPagamentoTrimestrais,
//           icms_aliquota: parseFloat(aliq.icms.aliquota),
//           icms_reducao: parseFloat(aliq.icms.reducao),
//           irpj: parseFloat(aliq.irpj),
//           iss: parseFloat(aliq.iss),
//           pis: parseFloat(aliq.pis),
//           tributacao: aliq.tributacao,
//           ativo: aliq.ativo,
//           validade: aliq.validade.fim || null,
//         }
//         pg.insert(aliquota).into('tb_aliquota').then((d) => {
//           console.log(pessoa._id);
//         }).catch(err => console.log(err));
//       });
//     }
//   });
// });

// async function migrarNotasServico() {
//   try {
//     const notas = await pegarTodasNotasServico();

//     for (let mongoNota of notas) {
//       const { valor } = mongoNota;
//       const { retencoes } = valor;

//       const notaServico = {
//         chave: mongoNota._id,
//         destinatario_cpfcnpj: mongoNota.destinatario,
//         emitente_cpfcnpj: mongoNota.emitente,
//         data_hora: mongoNota.geral.dataHora,
//         numero: mongoNota.geral.numero,
//         status: mongoNota.geral.status,
//         valor: round(valor.servico),
//         iss: valor.iss ? round(valor.iss.valor) : 0,
//       };

//       const retencao = {
//         iss: round(retencoes.iss),
//         pis: round(retencoes.pis),
//         cofins: round(retencoes.cofins),
//         irpj: round(retencoes.irpj),
//         csll: round(retencoes.csll),
//         inss: round(retencoes.inss),
//       };

//       const [retencao_id] = await pg.insert(retencao).returning('id').into('tb_retencao');
//       notaServico.retencao_id = retencao_id;

//       await pg.insert(notaServico).into('tb_nota_servico');

//       console.log('Fim:', notaServico.chave);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
// migrarNotasServico();

// async function migrarNotas() {
//   try {
//     console.log('iniciou');
//     const notas = await pegarTodasNotas();
//     console.log('notas carregadas');

//     for (let mongoNota of notas) {
//       const { geral, informacoesEstaduais } = mongoNota;
//       const nota = {
//         chave: mongoNota._id,
//         destinatario_cpfcnpj: mongoNota.destinatario || 0,
//         emitente_cpfcnpj: mongoNota.emitente || 0,
//         estado_destino_id: getEstado(informacoesEstaduais.estadoDestino),
//         estado_gerador_id: getEstado(informacoesEstaduais.estadoGerador),
//         destinatario_contribuinte: informacoesEstaduais.destinatarioContribuinte,
//         valor: round(mongoNota.valor.total),
//         data_hora: geral.dataHora,
//         numero: geral.numero,
//         status: geral.status,
//         cfop: geral.cfop,
//         tipo: geral.tipo,
//         texto_complementar: mongoNota.complementar.textoComplementar,
//       };

//       console.log('Iniciou nota:', nota.chave);

//       const prodsKeys = mongoNota.produtos ? Object.keys(mongoNota.produtos) : null;

//       const produtos = prodsKeys ? prodsKeys.map(
//         (prodNome) => {
//           const prod = mongoNota.produtos[prodNome];
//           if (prod) {
//             return {
//               nota_chave: mongoNota._id,
//               nome: prodNome,
//               descricao: prod.descricao,
//               valor: round(prod.valor.total),
//               quantidade: parseInt(prod.quantidade.numero, 10),
//             };
//           }
//         },
//       ) : [];

//       console.log(produtos.length, 'na nota:', nota.chave);

//       const [emitSel, destSel] = await Promise.all([
//         pg.select().from('tb_pessoa').where('cpfcnpj', '=', nota.emitente_cpfcnpj),
//         pg.select().from('tb_pessoa').where('cpfcnpj', '=', nota.destinatario_cpfcnpj),
//       ]);

//       console.log('Conferiu emitente destinatario:', nota.chave);

//       if (emitSel.length === 0)
//         await pg.insert({ cpfcnpj: nota.emitente_cpfcnpj, nome: 'desconhecido' }).into('tb_pessoa');

//       if (destSel.length === 0)
//         await pg.insert({ cpfcnpj: nota.destinatario_cpfcnpj, nome: 'desconhecido' }).into('tb_pessoa');

//       console.log('Inserindo nota:', nota.chave);

//       await pg.insert(nota).into('tb_nota');

//       console.log('Inserindo produtos:', nota.chave);
//       if (produtos.length > 0) {
//         await Promise.all(produtos.map(async (produto) => pg.insert(produto).into('tb_produto')));
//       }

//       console.log('Fim:', nota.chave);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
// migrarNotas();


// pegarDominioId('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855').then((dados) => {
//   const codigo = dados._id;
//   const { empresas } = dados;

//   Object.keys(empresas).forEach((numero) => {
//     const cnpj = empresas[numero];

//     console.log(numero, cnpj);

//     const dominio = {
//       codigo,
//       cnpj,
//       numero,
//     };

//     pg.insert(dominio).into('tb_dominio').returning('id').then((d) => console.log(d));
//   });
// });


// pegarTodasPessoasFlat().then((pessoas) => {
//   pessoas.forEach((mongoPessoa) => {
//     const pessoa = {
//       cpfcnpj: mongoPessoa._id,
//       nome: mongoPessoa.nome,
//     }

//     const endereco = {
//       ...mongoPessoa.endereco._doc,
//       municipio_id: parseInt(mongoPessoa.endereco.municipio.codigo, 10),
//       estado_id: getEstado(mongoPessoa.endereco.estado),
//       pais_id: 1,
//     }

//     delete endereco.municipio;
//     delete endereco.estado;
//     delete endereco.pais;
//     delete endereco._id;

//     pg.insert(endereco).returning('id').into('tb_endereco').then(([endereco_id]) => {
//       pessoa.endereco_id = endereco_id;
//       pg.insert(pessoa).into('tb_pessoa').catch(err => console.error(err)).then(() => console.log(pessoa.id));
//     }).catch(err => console.error(err));
//   });
// });

// pg.insert({ cpfcnpj: 'INTERNO', nome: 'INTERNO' }).into('tb_pessoa').catch(e => console.error(e));

// Object.keys(icmsEstados).forEach((sigla) => {
//   pg.insert({
//     estado_id: getEstado(sigla),
//     interno: icmsEstados[sigla].interno,
//     externo: icmsEstados[sigla].externo,
//   }).into('tb_difal_aliquota').catch(e => console.log(e));
// });
