const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Modulo = require('./Modulo');
const Funcao = require('./Funcao');

class ModuloFuncao extends Model {}

ModuloFuncao.init({
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
  sequelize,
  modelName: 'ModuloFuncao',
  tableName: 'modulo_funcao',
  timestamps: false,
});

ModuloFuncao.associateFunctions = async function (id_modulo, funcoes) {
  try {
    await ModuloFuncao.destroy({ where: { id_modulo } });

    const moduloFuncoes = funcoes.map(id_funcao => ({ id_modulo, id_funcao }));
    await ModuloFuncao.bulkCreate(moduloFuncoes);
  } catch (error) {
    console.error('Erro ao associar funções ao módulo:', error);
    throw error;
  }
};

module.exports = ModuloFuncao;
