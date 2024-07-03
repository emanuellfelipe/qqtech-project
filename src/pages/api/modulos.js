const { Modulo, ModuloFuncao, ModuloTransacao, Funcao, Transacao } = require('../../models/associations');

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
          model: Funcao,
          through: { attributes: [] }, 
        },
        {
          model: Transacao,
          through: { attributes: [] }, 
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
    const { nome_modulo, descricao, funcoes, transacoes } = req.body;
    const modulo = await Modulo.create({ nome_modulo, descricao });

    if (funcoes && funcoes.length > 0) {
      await ModuloFuncao.associateFunctions(modulo.id_modulo, funcoes);
    }

    if (transacoes && transacoes.length > 0) {
      await ModuloTransacao.associateTransactions(modulo.id_modulo, transacoes);
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
    const { nome_modulo, descricao, funcoes, transacoes } = req.body;

    const modulo = await Modulo.findByPk(id_modulo);
    if (!modulo) {
      return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
    }

    await modulo.update({ nome_modulo, descricao });

    await ModuloFuncao.associateFunctions(modulo.id_modulo, funcoes);
    await ModuloTransacao.associateTransactions(modulo.id_modulo, transacoes);

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

    const moduloFuncao = await ModuloFuncao.findOne({ where: { id_modulo } });
    const moduloTransacao = await ModuloTransacao.findOne({ where: { id_modulo } });

    if (moduloFuncao || moduloTransacao) {
      return res.status(400).json({ error: 'Não é possível excluir o módulo pois está associado a uma função ou transação' });
    }

    await ModuloFuncao.destroy({ where: { id_modulo } });
    await ModuloTransacao.destroy({ where: { id_modulo } });

    await Modulo.destroy({ where: { id_modulo } });

    res.status(204).end(); 
  } catch (error) {
    console.error('Erro ao excluir módulo:', error);
    res.status(500).json({ error: 'Erro ao excluir módulo' });
  }
}
