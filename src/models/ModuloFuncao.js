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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
 
  },
  id_funcao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcao,
      key: 'id_funcao',
      onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    },
  },
}, {
  tableName: 'modulo_funcao',
  timestamps: false,
});

ModuloFuncao.associateModules = async function (id_funcao, modulos) {
  try {

    await ModuloFuncao.destroy({ where: { id_funcao } });

    const moduloFuncoes = modulos.map(id_modulo => ({ id_funcao, id_modulo }));
    await ModuloFuncao.bulkCreate(moduloFuncoes);
  } catch (error) {
    console.error('Erro ao associar módulos à função:', error);
    throw error;
  }
};

module.exports = ModuloFuncao;
