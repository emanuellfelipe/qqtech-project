// PerfilUsuario.js
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'perfil_usuario',
    timestamps: false
});

module.exports = PerfilUsuario;
