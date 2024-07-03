const { Transacao, ModuloTransacao, Modulo } = require('../../models/associations');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getTransacoes(req, res);
      break;
    case 'POST':
      await createTransacao(req, res);
      break;
    case 'PUT':
      await updateTransacao(req, res);
      break;
    case 'DELETE':
      await deleteTransacao(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getTransacoes(req, res) {
  try {
    const transacoes = await Transacao.findAll({
      include: {
        model: Modulo,
        through: { attributes: [] },
      }
    });
    res.status(200).json({ success: true, data: transacoes });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar transações' });
  }
}

async function createTransacao(req, res) {
  try {
    const { nome_transacao, descricao, modulos } = req.body;
    const transacao = await Transacao.create({ nome_transacao, descricao });

    if (modulos && modulos.length > 0) {
      await ModuloTransacao.associateModules(transacao.id_transacao, modulos);
    }

    res.status(201).json({ success: true, data: transacao, message: 'Transação criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar transação' });
  }
}

async function updateTransacao(req, res) {
  try {
    const { id_transacao } = req.query;
    const { nome_transacao, descricao, modulos } = req.body;

    const transacao = await Transacao.findByPk(id_transacao);
    if (!transacao) {
      return res.status(404).json({ success: false, message: 'Transação não encontrada' });
    }

    await transacao.update({ nome_transacao, descricao });

    await ModuloTransacao.associateModules(transacao.id_transacao, modulos);

    res.status(200).json({ success: true, data: transacao, message: 'Transação atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar transação' });
  }
}

async function deleteTransacao(req, res) {
  try {
    const { id_transacao } = req.query;

    if (!id_transacao) {
      return res.status(400).json({ error: 'id_transacao é obrigatório' });
    }

    await ModuloTransacao.destroy({ where: { id_transacao } });

    await Transacao.destroy({ where: { id_transacao } });

    res.status(204).end(); 
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ error: 'Erro ao excluir transação' });
  }
}
