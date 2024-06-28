const { Modulo, PerfilModulo, Funcao, Transacao, Perfil } = require('../../models/associations');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getModulos(req, res);
      break;
    case 'POST':
      await createModulo(req, res);
      break;
    case 'PUT':
      await updateModulo(req, res);
      break;
    case 'DELETE':
      await deleteModulo(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getModulos(req, res) {
  try {
    const modulos = await Modulo.findAll({
      include: [
        {
          model: Perfil,
          through: { attributes: [] } // Para excluir os atributos da tabela intermediária
        },
        {
          model: Funcao,
          through: { attributes: [] } // Para excluir os atributos da tabela intermediária ModuloFuncao
        },
        {
          model: Transacao,
          through: { attributes: [] } // Para excluir os atributos da tabela intermediária ModuloTransacao
        }
      ]
    });

    res.status(200).json({ success: true, data: modulos });
  } catch (error) {
    console.error('Erro ao buscar módulos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar módulos' });
  }
}

async function createModulo(req, res) {
  try {
    const { nome_modulo, descricao, perfis, funcoes, transacoes } = req.body;
    const modulo = await Modulo.create({ nome_modulo, descricao });

    // Associar perfis ao módulo
    if (perfis && perfis.length > 0) {
      await PerfilModulo.associateModules(modulo.id_modulo, perfis);
    }

    // Associar funções ao módulo
    if (funcoes && funcoes.length > 0) {
      await Funcao.associateModules(modulo.id_modulo, funcoes);
    }

    // Associar transações ao módulo
    if (transacoes && transacoes.length > 0) {
      await Transacao.associateModules(modulo.id_modulo, transacoes);
    }

    res.status(201).json({ success: true, data: modulo, message: 'Módulo criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar módulo' });
  }
}

async function updateModulo(req, res) {
  try {
    const { id_modulo } = req.query;
    const { nome_modulo, descricao, perfis, funcoes, transacoes } = req.body;

    const modulo = await Modulo.findByPk(id_modulo);
    if (!modulo) {
      return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
    }

    await modulo.update({ nome_modulo, descricao });

    // Atualizar perfis associados ao módulo
    await PerfilModulo.associateModules(modulo.id_modulo, perfis);

    // Atualizar funções associadas ao módulo
    await Funcao.associateModules(modulo.id_modulo, funcoes);

    // Atualizar transações associadas ao módulo
    await Transacao.associateModules(modulo.id_modulo, transacoes);

    res.status(200).json({ success: true, data: modulo, message: 'Módulo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar módulo' });
  }
}

async function deleteModulo(req, res) {
  try {
    const { id_modulo } = req.query;

    if (!id_modulo) {
      return res.status(400).json({ error: 'id_modulo é obrigatório' });
    }

    // Antes de deletar o módulo, deletar os registros associados nas tabelas de associação
    await Promise.all([
      PerfilModulo.destroy({ where: { id_modulo } }),
      Funcao.destroy({ where: { id_modulo } }), // Aqui removemos de Funcao
      Transacao.destroy({ where: { id_modulo } }) // Aqui removemos de Transacao
    ]);

    // Agora podemos deletar o módulo da tabela modulo
    await Modulo.destroy({ where: { id_modulo } });

    res.status(204).end(); // Resposta 204 No Content
  } catch (error) {
    console.error('Erro ao excluir módulo:', error);
    res.status(500).json({ error: 'Erro ao excluir módulo' });
  }
}
