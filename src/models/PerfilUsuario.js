// PerfilUsuario.js
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario'); // Importe o modelo de Usuario aqui

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
        // Aqui você pode adicionar referências a outros modelos, se necessário
    }
}, {
    tableName: 'perfil_usuario',
    timestamps: false
});

module.exports = PerfilUsuario;
