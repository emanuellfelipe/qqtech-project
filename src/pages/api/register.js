// src/api/register.js
const Usuario = require('../../models/Usuario');
const Perfil = require('../../models/Perfil');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { matricula, nome_usuario, email, senha, nome_completo, perfis } = req.body;

            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }

            // Criação do usuário
            const newUser = await Usuario.create({
                matricula,
                nome_usuario,
                email,
                senha,
                nome_completo
            });

            // Associação do usuário aos perfis
            if (perfis && perfis.length > 0) {
                await newUser.setPerfils(perfis);
            }

            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro ao registrar novo usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
