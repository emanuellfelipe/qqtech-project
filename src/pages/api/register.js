// src/api/register.js
const express = require('express');
const User = require('../../models/Usuario');
const Perfil = require('../../models/Perfil'); 

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { matricula, nome_usuario, email, senha, nome_completo, id_perfil } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const perfil = await Perfil.findByPk(id_perfil);
        if (!perfil) {
            return res.status(400).json({ message: 'Perfil não encontrado' });
        }

        const newUser = await User.create({
            matricula,
            nome_usuario,
            email,
            senha,
            nome_completo,
            id_perfil   
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao registrar novo usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default function handler(req, res) {
    router(req, res, (result) => {
        if (result instanceof Error) {
            throw result;
        }
        res.json(result);
    });
}
