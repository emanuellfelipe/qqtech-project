'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Sidebar from '/src/components/Sidebar';
import Footer from '/src/components/Footer';
import "/src/styles/cadastro.css";

export default function CadastroPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [matricula, setMatricula] = useState('');
    const [nome_completo, setNomeCompleto] = useState('');
    const [nome_usuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [perfis, setPerfis] = useState([]);
    const [perfil, setSelectedPerfil] = useState('');

    useEffect(() => {
        async function fetchPerfis() {
            try {
                const response = await axios.get('api/perfis');
                console.log('Resposta da API:', response.data);
                setPerfis(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        }

        fetchPerfis();
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log('Formulário enviado', { matricula, nome_completo, nome_usuario, email, senha, perfil });
        try {
            await axios.post('/api/register', {
                matricula,
                nome_completo,
                nome_usuario,
                email,
                senha,
                perfil: perfil
            });
            // Redirecionar para a página de sucesso ou fazer outra ação necessária
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            
        }
    };

    return (
        <>
            <Sidebar />
            <div id="main-content">
                <div id="formulario">
                    <Image src="/images/logo-forms.png" alt="Forms Logo" width={400} height={75} />
                    <h1 style={{ marginBottom: '8px' }}>Por favor Insira os Dados</h1>
                    <p style={{ marginTop: '0' }}>Realize o cadastro para o colaborador acessar a Plataforma</p>
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
                        <label htmlFor="senha">Senha Padrão</label>
                        <div id="senha-div">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="senha"
                                placeholder="********"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                autoComplete="off"
                            />
                            <button type="button" id="senha-botao" onClick={togglePasswordVisibility}>
                                <Image 
                                src={passwordVisible ? "/images/eye-icon-green.png" : "/images/eye-icon.png"}
                                id="eye-icon" 
                                alt={passwordVisible ? "Ocultar senha" : "Mostrar senha"} 
                                width={20} height={20} />
                            </button>
                        </div>
                        <label htmlFor="perfis">Perfis Associados</label>
                        <select
                            id="perfis"
                            value={perfil}
                            onChange={(e) => setSelectedPerfil(e.target.value)}
                            required
                        >
                            <option value="">Selecione um perfil</option>
                            {Array.isArray(perfis) && perfis.map((perfil) => (
                                <option key={perfil.id_perfil}  value={perfil.id_perfil}>{perfil.nome_perfil}</option>
                            ))}
                        </select>
                        <div id="botoes">
                            <button type="reset" id="botao-cancelar">Cancelar</button>
                            <button type="submit" id="botao-cadastrar">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
