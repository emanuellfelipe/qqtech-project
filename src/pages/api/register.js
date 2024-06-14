// api/register.js
const { sequelize, Usuario, Perfil, PerfilUsuario } = require('../../models/associations');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { matricula, nome_usuario, email, senha, nome_completo, perfil } = req.body;

            console.log('Dados recebidos:', req.body);

            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }

            const transaction = await sequelize.transaction();

            try {
                // Criação do usuário
                const newUser = await Usuario.create({
                    matricula,
                    nome_usuario,
                    email,
                    senha,
                    nome_completo
                }, { transaction });

                console.log('Usuário criado:', newUser);

                // Associação do usuário ao perfil
                const perfilId = parseInt(perfil, 10); // Certifique-se de usar base 10
                await PerfilUsuario.create({
                    id_usuario: newUser.id_usuario,
                    id_perfil: perfilId
                }, { transaction });

                await transaction.commit();
                res.status(201).json(newUser);
            } catch (error) {
                await transaction.rollback();
                console.error('Erro ao registrar novo usuário:', error);
                res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
            }
        } catch (error) {
            console.error('Erro ao iniciar transação:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
