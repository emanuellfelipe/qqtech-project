const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Perfil = require('./Perfil');
const Modulo = require('./Modulo');
const Funcao = require('./Funcao');
const Transacao = require('./Transacao');
const PerfilUsuario = require('./PerfilUsuario');
const PerfilModulo = require('./PerfilModulo');
const ModuloFuncao = require('./ModuloFuncao');
const ModuloTransacao = require('./ModuloTransacao');

// Definindo os relacionamentos
Usuario.belongsToMany(Perfil, { through: PerfilUsuario, foreignKey: 'id_usuario' });
Perfil.belongsToMany(Usuario, { through: PerfilUsuario, foreignKey: 'id_perfil' });

Perfil.belongsToMany(Modulo, { through: PerfilModulo, foreignKey: 'id_perfil' });
Modulo.belongsToMany(Perfil, { through: PerfilModulo, foreignKey: 'id_modulo' });

Modulo.belongsToMany(Funcao, { through: ModuloFuncao, foreignKey: 'id_modulo' });
Funcao.belongsToMany(Modulo, { through: ModuloFuncao, foreignKey: 'id_funcao' });

Modulo.belongsToMany(Transacao, { through: ModuloTransacao, foreignKey: 'id_modulo' });
Transacao.belongsToMany(Modulo, { through: ModuloTransacao, foreignKey: 'id_transacao' });

// Exportando os modelos e a instância do Sequelize
module.exports = {
    sequelize,
    Usuario,
    Perfil,
    Modulo,
    Funcao,
    Transacao,
    PerfilUsuario,
    PerfilModulo,
    ModuloFuncao,
    ModuloTransacao,
};
