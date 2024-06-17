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
    },
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Modulo,
      key: 'id_modulo',
    },
  },
}, {
  tableName: 'perfil_modulo',
  timestamps: false,
});

// Método estático para associar módulos a um perfil
PerfilModulo.associateModules = async function(perfilId, moduloIds) {
  try {
    await Promise.all(moduloIds.map(async (moduloId) => {
      await PerfilModulo.create({ id_perfil: perfilId, id_modulo: moduloId });
    }));
    console.log('Módulos associados com sucesso ao perfil:', perfilId);
  } catch (error) {
    console.error('Erro ao associar módulos ao perfil:', error);
    throw error;
  }
};

module.exports = PerfilModulo;

// Definindo as associações entre os modelos
Perfil.belongsToMany(Modulo, { through: PerfilModulo, foreignKey: 'id_perfil' });
Modulo.belongsToMany(Perfil, { through: PerfilModulo, foreignKey: 'id_modulo' });