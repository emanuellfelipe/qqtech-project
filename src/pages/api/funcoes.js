// src/pages/api/funcoes.js
const { Funcao, ModuloFuncao, Modulo } = require('../../models/associations');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getFuncoes(req, res);
      break;
    case 'POST':
      await createFuncao(req, res);
      break;
    case 'PUT':
      await updateFuncao(req, res);
      break;
    case 'DELETE':
      await deleteFuncao(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não permitido`);
  }
}

async function getFuncoes(req, res) {
  try {
    const funcoes = await Funcao.findAll({
      include: {
        model: Modulo,
        through: { attributes: [] },
      }
    });
    res.status(200).json({ success: true, data: funcoes });
  } catch (error) {
    console.error('Erro ao buscar funções:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar funções' });
  }
}

async function createFuncao(req, res) {
  try {
    const { nome_funcoes, descricao, modulos } = req.body;
    const funcao = await Funcao.create({ nome_funcoes, descricao });

    if (modulos && modulos.length > 0) {
      await ModuloFuncao.associateModules(funcao.id_funcao, modulos);
    }

    res.status(201).json({ success: true, data: funcao, message: 'Função criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar função:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar função' });
  }
}

async function updateFuncao(req, res) {
  try {
    const { id_funcao } = req.query;
    const { nome_funcoes, descricao, modulos } = req.body;

    const funcao = await Funcao.findByPk(id_funcao);
    if (!funcao) {
      return res.status(404).json({ success: false, message: 'Função não encontrada' });
    }

    await funcao.update({ nome_funcoes, descricao });

    await ModuloFuncao.associateModules(funcao.id_funcao, modulos);

    res.status(200).json({ success: true, data: funcao, message: 'Função atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar função:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar função' });
  }
}

async function deleteFuncao(req, res) {
  try {
    const { id_funcao } = req.query;

    if (!id_funcao) {
      return res.status(400).json({ error: 'id_funcao é obrigatório' });
    }

    await ModuloFuncao.destroy({ where: { id_funcao } });

    await Funcao.destroy({ where: { id_funcao } });

    res.status(204).end();
  } catch (error) {
    console.error('Erro ao excluir função:', error);
    res.status(500).json({ error: 'Erro ao excluir função' });
  }
}
