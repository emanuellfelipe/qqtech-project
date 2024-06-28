const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Modulo = require('./Modulo');
const Funcao = require('./Funcao');

const ModuloFuncao = sequelize.define('ModuloFuncao', {
  id_modulo_funcao: {
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
  id_funcao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcao,
      key: 'id_funcao',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'modulo_funcao',
  timestamps: false,
});

ModuloFuncao.associateModules = async function (id_funcao, modulos) {
  try {
    // Remover todos os módulos associados à função
    await ModuloFuncao.destroy({ where: { id_funcao } });

    // Associar os novos módulos à função
    const funcaoModulos = modulos.map(id_modulo => ({ id_funcao, id_modulo }));
    await ModuloFuncao.bulkCreate(funcaoModulos);
  } catch (error) {
    console.error('Erro ao associar módulos à função:', error);
    throw error;
  }
};

module.exports = ModuloFuncao;
