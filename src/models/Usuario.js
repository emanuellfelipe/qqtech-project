// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário
const Perfil = require('./Perfil'); // Importe o modelo Perfil

const Usuario = sequelize.define('Usuario', {
    // Atributos do modelo
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
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Perfil,
            key: 'id_perfil'
        }
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

// Defina o relacionamento
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil' });

module.exports = Usuario;
