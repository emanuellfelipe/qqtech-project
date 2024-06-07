const Usuario = require('../../models/Usuario');

export default async function handler(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'matricula', 'nome_usuario', 'email', 'senha', 'nome_completo']
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}
