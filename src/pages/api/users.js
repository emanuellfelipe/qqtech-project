const { Usuario, Perfil, PerfilUsuario } = require('../../models/associations');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getUsuarios(req, res);
      break;
    case 'POST':
      await createUsuario(req, res);
      break;
    case 'PUT':
      await updateUsuario(req, res);
      break;
    case 'DELETE':
      await deleteUsuario(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: Perfil,
        through: { attributes: [] }, 
      }
    });
    res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
  }
}

async function createUsuario(req, res) {
  try {
    const { nome_usuario, email, senha, nome_completo, matricula, perfil } = req.body;
    const usuario = await Usuario.create({ nome_usuario, email, senha, nome_completo, matricula });

    if (perfil) {
      const perfilId = parseInt(perfil, 10);
      await PerfilUsuario.create({ id_usuario: usuario.id_usuario, id_perfil: perfilId });
    }

    res.status(201).json({ success: true, data: usuario, message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
  }
}

async function updateUsuario(req, res) {
  try {
    const { id_usuario } = req.query;
    const { nome_usuario, email, senha, nome_completo, perfil } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    await usuario.update({ nome_usuario, email, senha, nome_completo });

    if (perfil) {
      const perfilId = parseInt(perfil, 10);
      await PerfilUsuario.update(
        { id_perfil: perfilId },
        { where: { id_usuario: usuario.id_usuario } }
      );
    }

    res.status(200).json({ success: true, data: usuario, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
  }
}

async function deleteUsuario(req, res) {
  try {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario é obrigatório' });
    }

    await PerfilUsuario.destroy({ where: { id_usuario } });
    await Usuario.destroy({ where: { id_usuario } });

    res.status(204).end();
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}
