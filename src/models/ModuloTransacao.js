const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Modulo = require('./Modulo');
const Transacao = require('./Transacao');

const ModuloTransacao = sequelize.define('ModuloTransacao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Modulo,
      key: 'id_modulo',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  id_transacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Transacao,
      key: 'id_transacao',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'modulo_transacao',
  timestamps: false,
});

ModuloTransacao.associateTransactions = async function (id_modulo, transacoes) {
  try {
    await ModuloTransacao.destroy({ where: { id_modulo } });

    const moduloTransacoes = transacoes.map(id_transacao => ({ id_modulo, id_transacao }));
    await ModuloTransacao.bulkCreate(moduloTransacoes);
  } catch (error) {
    console.error('Erro ao associar transações ao módulo:', error);
    throw error;
  }
};

module.exports = ModuloTransacao;
