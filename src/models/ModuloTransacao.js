const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Transacao = require('./Transacao');
const Modulo = require('./Modulo');

const ModuloTransacao = sequelize.define('ModuloTransacao', {
  id_modulo_transacao: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_transacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Transacao,
      key: 'id_transacao',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' 
    },
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Modulo,
      key: 'id_modulo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
  },
}, {
  tableName: 'modulo_transacao',
  timestamps: false,
});

ModuloTransacao.associateModules = async function (id_transacao, modulos) {
  try {

    await ModuloTransacao.destroy({ where: { id_transacao } });

    const moduloTransacoes = modulos.map(id_modulo => ({ id_transacao, id_modulo }));
    await ModuloTransacao.bulkCreate(moduloTransacoes);
  } catch (error) {
    console.error('Erro ao associar módulos à transação:', error);
    throw error;
  }
};

module.exports = ModuloTransacao;
