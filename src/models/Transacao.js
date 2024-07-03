const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transacao = sequelize.define('Transacao', {
  id_transacao: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_transacao: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'transacoes',
  timestamps: false,
});

module.exports = Transacao;
