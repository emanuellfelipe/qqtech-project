const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost', 
    port: 5432, 
    dialect: 'postgres',
    pool: {
        max: 5, 
        min: 0, 
        acquire: 30000, 
        idle: 10000 
    },
    logging: false, 
    define: {
        timestamps: false, 
        underscored: true, 
        freezeTableName: true 
    },
    timezone: '+00:00' 
});

// Testar a conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

module.exports = sequelize;


