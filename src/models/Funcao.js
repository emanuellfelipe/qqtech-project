const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Funcao = sequelize.define('Funcao', {
  id_funcao: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_funcoes: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'funcoes',
  timestamps: false,
});

module.exports = Funcao;
