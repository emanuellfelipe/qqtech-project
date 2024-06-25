// src/models/PerfilUsuario.js
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario'); // Importe o modelo de Usuario aqui
const Perfil = require('./Perfil'); // Importe o modelo de Perfil aqui

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    id_perfil_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // Referência ao modelo de Usuario
            key: 'id_usuario' // Campo na tabela de Usuario
        },
        onDelete: 'CASCADE', // Define ação de deleção em cascata
        onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Perfil, // Referência ao modelo de Perfil
            key: 'id_perfil' // Campo na tabela de Perfil
        },
        onDelete: 'CASCADE', // Define ação de deleção em cascata
        onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    }
}, {
    tableName: 'perfil_usuario',
    timestamps: false
});

// Função para associar usuários a um perfil
PerfilUsuario.associateUsers = async function (id_perfil, usuarios) {
  try {
    // Remover todos os usuários associados ao perfil
    await PerfilUsuario.destroy({ where: { id_perfil } });

    // Associar os novos usuários ao perfil
    const perfilUsuarios = usuarios.map(id_usuario => ({ id_perfil, id_usuario }));
    await PerfilUsuario.bulkCreate(perfilUsuarios);
  } catch (error) {
    console.error('Erro ao associar usuários ao perfil:', error);
    throw error;
  }
};

module.exports = PerfilUsuario;
