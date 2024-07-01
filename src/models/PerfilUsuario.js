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
}, {
  tableName: 'perfil_usuario',
  timestamps: false,
});

// Função para associar um único perfil a um usuário
PerfilUsuario.associateUsers = async function (id_perfil, id_usuario) {
  try {
    // Verificar se o usuário já possui um perfil associado
    const existingAssoc = await PerfilUsuario.findOne({ where: { id_usuario } });
    if (existingAssoc) {
      // Atualizar o perfil existente
      await existingAssoc.update({ id_perfil });
    } else {
      // Criar uma nova associação de perfil para o usuário
      await PerfilUsuario.create({ id_perfil, id_usuario });
    }
  } catch (error) {
    console.error('Erro ao associar usuário ao perfil:', error);
    throw error;
  }
};

module.exports = PerfilUsuario;
