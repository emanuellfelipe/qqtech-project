const Perfil = require('../../models/Perfil');
const PerfilModulo = require('../../models/PerfilModulo');
const Modulo = require('../../models/Modulo');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { nome_perfil, descricao, modulos } = req.body;

      // Crie o perfil
      const perfil = await Perfil.create({ nome_perfil, descricao });

      // Se houver módulos selecionados, associe-os ao perfil
      if (modulos && modulos.length > 0) {
        await PerfilModulo.associateModules(perfil.id_perfil, modulos);
      }

      // Responda com o perfil criado
      res.status(201).json({ success: true, data: perfil, message: 'Perfil criado com sucesso' });
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor ao criar perfil' });
    }
  } else if (req.method === 'GET') {
    try {
      // Obter todos os perfis do banco de dados, incluindo os módulos associados
      const perfis = await Perfil.findAll({
        include: {
          model: Modulo,
          through: { attributes: [] }, // Exclui atributos da tabela de junção
        },
      });

      // Responder com os perfis obtidos
      res.status(200).json({ success: true, data: perfis });
    } catch (error) {
      // Se ocorrer algum erro, responder com status de erro e mensagem de erro
      console.error('Erro ao buscar perfis:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor ao buscar perfis' });
    }
  } else {
    // Se a solicitação for de outro tipo, responder com um status de método não permitido
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
