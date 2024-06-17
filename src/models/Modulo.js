// models/Modulo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Modulo = sequelize.define('Modulo', {
  id_modulo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_modulo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'modulos',
  timestamps: false,
});

module.exports = Modulo;
