// models/ModuloTransacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Modulo = require('./Modulo');
const Transacao = require('./Transacao');

const ModuloTransacao = sequelize.define('ModuloTransacao', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Modulo,
            key: 'id_modulo',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_transacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transacao,
            key: 'id_transacao',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    tableName: 'modulo_transacao',
    timestamps: false,
});

module.exports = ModuloTransacao;
