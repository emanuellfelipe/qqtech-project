const { Perfil, PerfilModulo, PerfilUsuario, Modulo } = require('../../models/associations');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getPerfis(req, res);
      break;
    case 'POST':
      await createPerfil(req, res);
      break;
    case 'PUT':
      await updatePerfil(req, res);
      break;
    case 'DELETE':
      await deletePerfil(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getPerfis(req, res) {
  try {
    const perfis = await Perfil.findAll({
      include: {
        model: Modulo,
        through: { attributes: [] }, 
      }
    });
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
      await PerfilModulo.associateModules(perfil.id_perfil, modulos);
    }

    res.status(201).json({ success: true, data: perfil, message: 'Perfil criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar perfil' });
  }
}

async function updatePerfil(req, res) {
  try {
    const { id_perfil } = req.query;
    const { nome_perfil, descricao, modulos } = req.body;

    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil) {
      return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
    }

    await perfil.update({ nome_perfil, descricao });

    await PerfilModulo.associateModules(perfil.id_perfil, modulos);

    res.status(200).json({ success: true, data: perfil, message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar perfil' });
  }
}

async function deletePerfil(req, res) {
  try {
    const { id_perfil } = req.query;

    if (!id_perfil) {
      return res.status(400).json({ error: 'id_perfil é obrigatório' });
    }

    const perfilUsuario = await PerfilUsuario.findOne({ where: { id_perfil } });

    if (perfilUsuario) {
      return res.status(400).json({ error: 'Não é possível excluir o perfil pois está associado a um usuário' });
    }

    await PerfilModulo.destroy({ where: { id_perfil } });

    await Perfil.destroy({ where: { id_perfil } });

    res.status(204).end(); 
  } catch (error) {
    console.error('Erro ao excluir perfil:', error);
    res.status(500).json({ error: 'Erro ao excluir perfil' });
  }
}
