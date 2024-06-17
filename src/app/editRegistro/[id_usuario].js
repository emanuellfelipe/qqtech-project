'use client';
// src/app/editRegistro/[id_usuario].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Sidebar from '/src/components/Sidebar';
import Footer from '/src/components/Footer';
import "/src/styles/cadastro.css";

export default function CadastroPage() {
    const router = useRouter();
    const { id_usuario } = router.query; // Obtém o id_usuario da rota dinâmica

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [matricula, setMatricula] = useState('');
    const [nome_completo, setNomeCompleto] = useState('');
    const [nome_usuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [perfil, setPerfil] = useState('');
    const [perfis, setPerfis] = useState([]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`/api/users/${id_usuario}`);
                const userData = response.data;
                setMatricula(userData.matricula);
                setNomeCompleto(userData.nome_completo);
                setNomeUsuario(userData.nome_usuario);
                setEmail(userData.email);
                setPerfil(userData.perfil.id_perfil);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        }

        if (id_usuario) {
            fetchUserData();
        }
    }, [id_usuario]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const response = await axios.get('/api/perfis');
                setPerfis(response.data);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        }

        fetchProfiles();
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/api/users/${id_usuario}`, {
                matricula,
                nome_completo,
                nome_usuario,
                email,
                senha,
                perfil: { id_perfil: perfil }
            });
            // Redirecionar para a página de sucesso ou fazer outra ação necessária
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        }
    };

    if (!id_usuario) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Sidebar />
            <div id="main-content">
                <div id="formulario">
                    <Image src="/images/logo-forms.png" alt="Forms Logo" width={400} height={75} />
                    <h1 style={{ marginBottom: '8px' }}>Editar Informações do Usuário</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="matricula">Matrícula</label>
                        <input
                            type="number"
                            id="matricula"
                            placeholder="********"
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            required
                        />
                        <label htmlFor="nome-completo">Nome Completo</label>
                        <input
                            type="text"
                            id="nome-completo"
                            placeholder="Nome Completo"
                            value={nome_completo}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                            required
                        />
                        <label htmlFor="nome-usuario">Nome de Usuário</label>
                        <input
                            type="text"
                            id="nome-usuario"
                            placeholder="Nome de Usuário"
                            value={nome_usuario}
                            onChange={(e) => setNomeUsuario(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="exemplo.queroquero@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="senha">Senha Atual</label>
                        <div id="senha-div">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="senha"
                                placeholder="********"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="off"
                                required
                            />
                            <button type="button" id="senha-botao" onClick={togglePasswordVisibility}>
                                <Image 
                                    src={passwordVisible ? "/images/eye-icon-green.png" : "/images/eye-icon.png"}
                                    id="eye-icon" 
                                    alt={passwordVisible ? "Ocultar senha" : "Mostrar senha"} 
                                    width={20} height={20} />
                            </button>
                        </div>
                        <label htmlFor="perfil">Perfil Associado</label>
                        <select
                            id="perfil"
                            value={perfil}
                            onChange={(e) => setPerfil(e.target.value)}
                            required
                        >
                            <option value="">Selecione o Perfil</option>
                            {perfis.map(perfil => (
                                <option key={perfil.id_perfil} value={perfil.id_perfil}>
                                    {perfil.nome_perfil}
                                </option>
                            ))}
                        </select>
                        <div id="botoes">
                            <button type="reset" id="botao-cancelar">Cancelar</button>
                            <button type="submit" id="botao-cadastrar">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
