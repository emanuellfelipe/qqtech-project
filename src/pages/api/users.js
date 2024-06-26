const { sequelize, Usuario, PerfilUsuario, Perfil } = require('../../models/associations');


export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      if (req.query.id_usuario) {
        await getUser(req, res);
      } else {
        await getUsers(req, res);
      }
      break;
    case 'POST':
      await createUser(req, res);
      break;
    case 'PUT':
      await updateUser(req, res);
      break;
    case 'DELETE':
      await deleteUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getUsers(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'matricula', 'nome_usuario', 'email', 'nome_completo']
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

async function getUser(req, res) {
  try {
    const { id_usuario } = req.query;
    const usuario = await Usuario.findByPk(id_usuario, {
      include: [{
        model: Perfil,
        through: {
          attributes: [] // Evita trazer colunas extras da tabela de associação
        }
      }]
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

async function createUser(req, res) {
  try {
    const { matricula, nome_completo, nome_usuario, email, senha, perfil } = req.body;
    const newUser = await Usuario.create({ matricula, nome_completo, nome_usuario, email, senha });

    if (perfil && perfil.length > 0) {
      await PerfilUsuario.associateUsers(newUser.id_usuario, perfil);
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}
async function getPerfis(req, res) {
  try {
    const perfis = await Perfil.findAll({
      include: {
        model: Modulo,
        through: { attributes: [] }, // Para excluir os atributos da tabela intermediária
      }
    });
    res.status(200).json({ success: true, data: perfis });
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar perfis' });
  }
}

async function updateUser(req, res) {
  try {
    const { id_usuario } = req.query;
    const { matricula, nome_completo, nome_usuario, email, senha, perfil } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const transaction = await sequelize.transaction();

    try {
      // Atualiza os dados do usuário
      usuario.matricula = matricula;
      usuario.nome_completo = nome_completo;
      usuario.nome_usuario = nome_usuario;
      usuario.email = email;

      // Atualiza a senha apenas se fornecida
      if (senha) {
        usuario.senha = senha;
      }

      await usuario.save({ transaction });

      // Atualiza o perfil do usuário na tabela de associação
      if (perfil && perfil.length > 0) {
        await PerfilUsuario.associateUsers(id_usuario, perfil);
      }

      await transaction.commit();
      res.status(200).json(usuario);
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  } catch (error) {
    console.error('Erro ao iniciar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}


async function deleteUser(req, res) {
  try {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario é obrigatório' });
    }

    if (isNaN(Number(id_usuario))) {
      return res.status(400).json({ error: 'id_usuario deve ser um número' });
    }

    // Antes de deletar o usuário, deletamos os registros associados na tabela perfil_usuario
    await PerfilUsuario.destroy({ where: { id_usuario } });

    // Agora podemos deletar o usuário da tabela usuario
    await Usuario.destroy({ where: { id_usuario } });

    res.status(204).end(); // Resposta 204 No Content
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}
