// src/pages/api/perfis.js

const Perfil = require('../../models/Perfil');

export default async function handler(req, res) {
  try {
    // Obter todos os perfis do banco de dados
    const perfis = await Perfil.findAll();

    // Responder com os perfis obtidos
    res.status(200).json({ success: true, data: perfis });
  } catch (error) {
    // Se ocorrer algum erro, responder com status de erro e mensagem de erro
    console.error('Erro ao obter perfis:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}

