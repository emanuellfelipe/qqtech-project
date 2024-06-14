const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario');
const Perfil = require('./Perfil');

const PerfilUsuario = sequelize.define('PerfilUsuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'perfil_usuario',
    timestamps: false
});

Usuario.belongsToMany(Perfil, {
    through: PerfilUsuario,
    foreignKey: 'id_usuario',
    otherKey: 'id_perfil'
});

Perfil.belongsToMany(Usuario, {
    through: PerfilUsuario,
    foreignKey: 'id_perfil',
    otherKey: 'id_usuario'
});

module.exports = {
    sequelize,
    Usuario,
    Perfil,
    PerfilUsuario
};
