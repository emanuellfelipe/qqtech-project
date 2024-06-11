// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Perfil = require('./Perfil');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matricula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nome_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome_completo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

// Associação Muitos-Para-Muitos com a tabela 'perfil'
Usuario.belongsToMany(Perfil, {
    through: 'perfil_usuario',
    foreignKey: 'id_usuario',
    otherKey: 'id_perfil'
});

module.exports = Usuario;
