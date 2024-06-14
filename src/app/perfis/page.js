'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch } from 'react-icons/fa'; 
import "/src/styles/perfis.css"; 
import Footer from '/src/components/Footer'; 
import Sidebar from '/src/components/Sidebar'; 

export default function PerfisAdminPage() {
    const [perfis, setPerfis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPerfil, setNewPerfil] = useState({ nome_perfil: '', descricao: '', modulos: [] });
    const [modulos, setModulos] = useState([]);

    useEffect(() => {
        // Chamada à API para buscar os perfis
        const fetchPerfis = async () => {
            try {
                const response = await fetch('/api/perfis');
                const data = await response.json();
                setPerfis(data.data);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        };

        // Chamada à API para buscar os módulos
        const fetchModulos = async () => {
            try {
                const response = await fetch('/api/modulos');
                const data = await response.json();
                setModulos(data);
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
            }
        };

        fetchPerfis();
        fetchModulos();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleCreatePerfil = async () => {
        try {
            const response = await fetch('/api/perfis', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newPerfil),
            });
    
            if (!response.ok) {
              throw new Error('Erro ao criar perfil');
            }
    
            const data = await response.json();
            const perfilCriado = data.data;
    
            // Associar os módulos selecionados ao perfil recém-criado
            if (newPerfil.modulos && newPerfil.modulos.length > 0) {
              await fetch(`/api/perfis/${perfilCriado.id}/modulos`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modulos: newPerfil.modulos }),
              });
            }
    
            setPerfis([...perfis, perfilCriado]);
            setIsModalOpen(false); // Fecha o modal após criar o perfil
            setNewPerfil({ nome_perfil: '', descricao: '', modulos: [] }); // Limpa os campos do novo perfil
            alert('Perfil criado com sucesso!'); // Exibe uma mensagem de sucesso
        } catch (error) {
            console.error('Erro ao criar perfil:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPerfil({ ...newPerfil, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setNewPerfil((prevState) => ({ ...prevState, modulos: [...prevState.modulos, value] }));
        } else {
            setNewPerfil((prevState) => ({ ...prevState, modulos: prevState.modulos.filter(mod => mod !== value) }));
        }
    };

    const filteredPerfis = perfis.filter(perfil =>
        perfil &&
        perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfil.nome_perfil && perfil.nome_perfil.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Administração de Perfis</title>
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1>Perfis Existentes</h1>
                <div id="search-wrapper">
                    <h2 id="search-title">Perfis</h2>
                    <div id="search-container">
                        <FaSearch id="search-icon" />
                        <input 
                            type="search" 
                            placeholder="Digite aqui..." 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Perfil</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPerfis.map((perfil) => (
                            <tr key={perfil.id_perfil}>
                                <td>{perfil.nome_perfil}</td>
                                <td>{perfil.descricao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button id="criar-perfil" onClick={() => setIsModalOpen(true)}>Criar Novo Perfil</button>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Criar Novo Perfil</h2>
                        <form>
                            <label>
                                Nome do Perfil:
                                <input 
                                    type="text" 
                                    name="nome_perfil" 
                                    value={newPerfil.nome_perfil} 
                                    onChange={handleInputChange} 
                                    style={{ backgroundColor: '#f2f4f8', borderBottom: '1px solid #D0D5DD' }}
                                />
                            </label>
                            <label>
                                Descrição:
                                <input 
                                    type="text" 
                                    name="descricao" 
                                    value={newPerfil.descricao} 
                                    onChange={handleInputChange} 
                                    style={{ backgroundColor: '#f2f4f8', borderBottom: '1px solid #D0D5DD' }}
                                />
                            </label>
                            <label>
                                Módulos:
                                {modulos.map(modulo => (
                                    <div key={modulo.id_modulo}>
                                        <input 
                                            type="checkbox" 
                                            value={modulo.id_modulo} 
                                            onChange={handleCheckboxChange} 
                                        />
                                        {modulo.nome_modulo}
                                    </div>
                                ))}
                            </label>
                            <div className="modal-buttons">
                                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="button" onClick={handleCreatePerfil}>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
