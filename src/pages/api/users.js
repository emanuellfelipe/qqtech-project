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

  // Inserção de usuário
export async function createUser(req, res) {
  try {
    const newUser = await Usuario.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// Exclusão de usuário
export async function deleteUser(req, res) {
  try {
    const { id_usuario } = req.params;
    await Usuario.destroy({ where: { id_usuario } });
    res.status(204).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}