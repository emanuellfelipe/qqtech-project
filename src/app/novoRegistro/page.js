'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
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
            <div id="menu-lateral">
            <div id="menu-lateral">
        <div id="logo-container">
          <Image src="/images/logo.png" id="logo" alt="Logo" width={181} height={39} />
        </div>
        <div className="menu-icons">
          <Image src="/images/menu-icon.png" className="menu-icon" alt="Menu Icon" width={20} height={20} />
          <Image src="/images/settings-icon.png" className="menu-icon" alt="Settings Icon" width={20} height={20} />
        </div>
        <button className="botao-menu">
          <Image src="/images/home-icon.png" alt="Home" width={20} height={20} /> Home
        </button>
        <button className="botao-menu">
          <Image src="/images/modules-icon.png" alt="Modules" width={20} height={20} /> Módulos
        </button>
        <button className="botao-menu active">
          <Image src="/images/profiles-icon.png" alt="Users" width={20} height={20} /> Usuários
        </button>
        <button className="botao-menu">
          <Image src="/images/perfis-icon.png" alt="Profiles" width={20} height={20} /> Perfis
        </button>
      </div>
            </div>

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
                                <Image src="/images/eye-icon.png" id="eye-icon" alt="Ícone de olho" width={20} height={20} />
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

            <footer>
              <p>Lojas Quero Quero @ 2024. Todos os Direitos Reservados</p>
              <div id="social-icons">
                <Image src="/images/facebook-icon.png" alt="Facebook" width={20} height={20} />
                <Image src="/images/twitter-icon.png" alt="Twitter" width={20} height={20} />
                <Image src="/images/instagram-icon.png" alt="Instagram" width={20} height={20} />
                <Image src="/images/linkedin-icon.png" alt="LinkedIn" width={20} height={20} />
                <Image src="/images/youtube-icon.png" alt="YouTube" width={20} height={20} />
              </div>
            </footer>
        </>
    );
}
