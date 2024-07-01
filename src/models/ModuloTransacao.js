// src/models/ModuloTransacao.js

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
      onDelete: 'CASCADE', // Define ação de deleção em cascata
      onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Modulo,
      key: 'id_modulo',
      onDelete: 'CASCADE', // Define ação de deleção em cascata
      onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
  },
}, {
  tableName: 'modulo_transacao',
  timestamps: false,
});

// Função para associar módulos a uma transação
ModuloTransacao.associateTransactions = async function (id_transacao, modulos) {
  try {
    // Remover todos os módulos associados à transação
    await ModuloTransacao.destroy({ where: { id_transacao } });

    // Associar os novos módulos à transação
    const moduloTransacoes = modulos.map(id_modulo => ({ id_transacao, id_modulo }));
    await ModuloTransacao.bulkCreate(moduloTransacoes);
  } catch (error) {
    console.error('Erro ao associar módulos à transação:', error);
    throw error;
  }
};

module.exports = ModuloTransacao;
