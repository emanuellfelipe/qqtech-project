const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Perfil = require('./Perfil');
const Usuario = require('./Usuario'); // Renomeado de Modulo para Usuario

const PerfilUsuario = sequelize.define('PerfilUsuario', {
  id_perfil_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: { // Alterado de id_modulo para id_usuario
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, // Alterado de Modulo para Usuario
      key: 'id_usuario',
      onDelete: 'CASCADE', // Define ação de deleção em cascata
      onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perfil,
      key: 'id_perfil',
      onDelete: 'CASCADE', // Define ação de deleção em cascata
      onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
  },
}, {
  tableName: 'perfil_usuario',
  timestamps: false,
});

PerfilUsuario.associateSingleUser = async function (id_usuario, id_perfil) {
  try {
    // Remover o perfil atualmente associado ao usuário, se houver
    await PerfilUsuario.destroy({ where: { id_usuario } });

    // Associar o novo perfil ao usuário
    await PerfilUsuario.create({ id_usuario, id_perfil });
  } catch (error) {
    console.error('Erro ao associar o perfil ao usuário:', error);
    throw error;
  }
};

module.exports = PerfilUsuario;
