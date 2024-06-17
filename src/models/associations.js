// models/Associacoes.js
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Perfil = require('./Perfil');
const Modulo = require('./Modulo');
const { DataTypes } = require('sequelize');

const PerfilUsuario = sequelize.define('PerfilUsuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'perfil_usuario',
  timestamps: false,
});

const PerfilModulo = sequelize.define('PerfilModulo', {
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'perfil_modulo',
  timestamps: false,
});

Usuario.belongsToMany(Perfil, {
  through: PerfilUsuario,
  foreignKey: 'id_usuario',
  otherKey: 'id_perfil',
});

Perfil.belongsToMany(Usuario, {
  through: PerfilUsuario,
  foreignKey: 'id_perfil',
  otherKey: 'id_usuario',
});

Perfil.belongsToMany(Modulo, {
  through: PerfilModulo,
  foreignKey: 'id_perfil',
  otherKey: 'id_modulo',
});

Modulo.belongsToMany(Perfil, {
  through: PerfilModulo,
  foreignKey: 'id_modulo',
  otherKey: 'id_perfil',
});

module.exports = {
  sequelize,
  Usuario,
  Perfil,
  Modulo,
  PerfilUsuario,
  PerfilModulo,
};
