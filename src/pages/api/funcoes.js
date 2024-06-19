// src/pages/api/funcoes.js
import Funcao from '../../models/Funcao';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const funcoes = await Funcao.findAll({
        attributes: ['id_funcao', 'nome_funcoes', 'descricao']
      });
      res.status(200).json(funcoes);
    } catch (error) {
      console.error('Erro ao buscar funções:', error);
      res.status(500).json({ error: 'Erro ao buscar funções' });
    }
  } else if (req.method === 'POST') {
    const { nome_funcoes, descricao } = req.body;
    try {
      const novaFuncao = await Funcao.create({ nome_funcoes, descricao });
      res.status(201).json(novaFuncao);
    } catch (error) {
      console.error('Erro ao criar função:', error);
      res.status(500).json({ error: 'Erro ao criar função' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
