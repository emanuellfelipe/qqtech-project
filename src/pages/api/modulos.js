import Modulo from '../../models/Modulo'; 

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const modulos = await Modulo.findAll({
                attributes: ['id_modulo', 'nome_modulo', 'descricao']
            });
            res.status(200).json(modulos);
        } catch (error) {
            console.error('Erro ao buscar módulos:', error);
            res.status(500).json({ error: 'Erro ao buscar módulos' });
        }
    } else if (req.method === 'POST') {
        const { nome_modulo, descricao } = req.body;
        try {
            const novoModulo = await Modulo.create({ nome_modulo, descricao });
            res.status(201).json(novoModulo);
        } catch (error) {
            console.error('Erro ao criar módulo:', error);
            res.status(500).json({ error: 'Erro ao criar módulo' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
