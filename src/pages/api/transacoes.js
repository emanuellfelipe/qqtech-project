// src/pages/api/transacoes.js
import Transacao from '../../models/Transacao';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const transacoes = await Transacao.findAll({
        attributes: ['id_transacao', 'nome_transacao', 'descricao']
      });
      res.status(200).json(transacoes);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({ error: 'Erro ao buscar transações' });
    }
  } else if (req.method === 'POST') {
    const { nome_transacao, descricao } = req.body;
    try {
      const novaTransacao = await Transacao.create({ nome_transacao, descricao });
      res.status(201).json(novaTransacao);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({ error: 'Erro ao criar transação' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
