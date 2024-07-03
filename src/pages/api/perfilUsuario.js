const { PerfilUsuario, Perfil } = require('../../models/associations');

async function getPerfilUsuario(req, res) {
    const { id_usuario } = req.query;

    try {
        const perfilUsuario = await PerfilUsuario.findOne({
            where: { id_usuario: id_usuario },
            include: [{ model: Perfil }],
        });

        if (!perfilUsuario) {
            return res.status(404).json({ message: 'Perfil do usuário não encontrado' });
        }

        res.json({ nome_perfil: perfilUsuario.Perfil.nome_perfil });
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
    }
}

export default getPerfilUsuario;
