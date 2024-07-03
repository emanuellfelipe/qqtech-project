const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Perfil = require('./Perfil');
const Modulo = require('./Modulo');

const PerfilModulo = sequelize.define('PerfilModulo', {
  id_perfil_modulo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Perfil,
      key: 'id_perfil',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE' 
    },
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Modulo,
      key: 'id_modulo',
      onDelete: 'CASCADE', // Define ação de deleção em cascata
      onUpdate: 'CASCADE' // Define ação de atualização em cascata, se necessário
    },
  },
}, {
  tableName: 'perfil_modulo',
  timestamps: false,
});


PerfilModulo.associateModules = async function (id_perfil, modulos) {
  try {

    await PerfilModulo.destroy({ where: { id_perfil } });

    const perfilModulos = modulos.map(id_modulo => ({ id_perfil, id_modulo }));
    await PerfilModulo.bulkCreate(perfilModulos);
  } catch (error) {
    console.error('Erro ao associar módulos ao perfil:', error);
    throw error;
  }
};

module.exports = PerfilModulo;
