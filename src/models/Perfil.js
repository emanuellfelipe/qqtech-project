// models/Perfil.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Perfil = sequelize.define('Perfil', {
    id_perfil: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome_perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descricao: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'perfil', // Especifica o nome da tabela em minúsculas
    freezeTableName: true // Impede que o Sequelize pluralize o nome da tabela
});

module.exports = Perfil;
;
