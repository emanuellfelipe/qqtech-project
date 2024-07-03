const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Perfil = require('./Perfil');
const Usuario = require('./Usuario'); 

const PerfilUsuario = sequelize.define('PerfilUsuario', {
  id_perfil_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, 
      key: 'id_usuario',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' 
    },
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perfil,
      key: 'id_perfil',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' 
    },
  },
}, {
  tableName: 'perfil_usuario',
  timestamps: false,
});

PerfilUsuario.associateSingleUser = async function (id_usuario, id_perfil) {
  try {

    await PerfilUsuario.destroy({ where: { id_usuario } });

    await PerfilUsuario.create({ id_usuario, id_perfil });
  } catch (error) {
    console.error('Erro ao associar o perfil ao usuário:', error);
    throw error;
  }
};

module.exports = PerfilUsuario;
