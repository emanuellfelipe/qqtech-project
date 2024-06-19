// src/pages/api/perfis.js

const Perfil = require('../../models/Perfil');
const PerfilModulo = require('../../models/PerfilModulo');
const PerfilUsuario = require('../../models/PerfilUsuario'); // Importe o modelo de PerfilUsuario

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getPerfis(req, res);
      break;
    case 'POST':
      await createPerfil(req, res);
      break;
    case 'DELETE':
      await deletePerfil(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getPerfis(req, res) {
  try {
    const perfis = await Perfil.findAll();
    res.status(200).json({ success: true, data: perfis });
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar perfis' });
  }
}

async function createPerfil(req, res) {
  try {
    const { nome_perfil, descricao, modulos } = req.body;
    const perfil = await Perfil.create({ nome_perfil, descricao });

    if (modulos && modulos.length > 0) {
      await PerfilModulo.associateModules(perfil.id, modulos);
    }

    res.status(201).json({ success: true, data: perfil, message: 'Perfil criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar perfil' });
  }
}
async function deletePerfil(req, res) {
  try {
    const { id_perfil } = req.query;

    if (!id_perfil) {
      return res.status(400).json({ error: 'id_perfil é obrigatório' });
    }

    // Verificar se o perfil está associado a algum usuário na tabela perfil_usuario
    const perfilUsuario = await PerfilUsuario.findOne({ where: { id_perfil } });

    if (perfilUsuario) {
      return res.status(400).json({ error: 'Não é possível excluir o perfil pois está associado a um usuário' });
    }

    // Antes de deletar o perfil, deletar os registros associados na tabela perfil_modulo
    await PerfilModulo.destroy({ where: { id_perfil } });

    // Agora podemos deletar o perfil da tabela perfil
    await Perfil.destroy({ where: { id_perfil } });

    res.status(204).end(); // Resposta 204 No Content
  } catch (error) {
    console.error('Erro ao excluir perfil:', error);
    res.status(500).json({ error: 'Erro ao excluir perfil' });
  }
}