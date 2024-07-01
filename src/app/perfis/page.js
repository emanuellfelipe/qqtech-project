'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa'; 
import '/src/styles/perfis.css'; 
import Footer from '/src/components/Footer'; 
import Sidebar from '/src/components/Sidebar'; 
import Select from 'react-select';

export default function PerfisAdminPage() {
    const [perfis, setPerfis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPerfil, setNewPerfil] = useState({ nome_perfil: '', descricao: '', modulos: [] });
    const [modulos, setModulos] = useState([]);
    const [selectedModulos, setSelectedModulos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerfilId, setEditingPerfilId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerfis = async () => {
            try {
                const response = await fetch('/api/perfis');
                if (!response.ok) {
                    throw new Error('Erro ao buscar perfis');
                }
                const data = await response.json();
                setPerfis(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
                setError(error);
                setIsLoading(false);
            }
        };

        const fetchModulos = async () => {
            try {
                const response = await fetch('/api/modulos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar módulos');
                }
                const data = await response.json();
                setModulos(data.data || []); // Ensure data is set correctly
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

    const handleCreateOrEditPerfil = async () => {
        const url = isEditing ? `/api/perfis?id_perfil=${editingPerfilId}` : '/api/perfis';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newPerfil, modulos: selectedModulos.map(modulo => modulo.value) }),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar perfil' : 'Erro ao criar perfil');
            }

            const data = await response.json();
            const perfilAtualizado = data.data;

            if (isEditing) {
                setPerfis(perfis.map(perfil => (perfil.id_perfil === editingPerfilId ? perfilAtualizado : perfil)));
            } else {
                setPerfis([...perfis, perfilAtualizado]);
            }

            setIsModalOpen(false);
            setNewPerfil({ nome_perfil: '', descricao: '', modulos: [] });
            setSelectedModulos([]);
            setIsEditing(false);
            setEditingPerfilId(null);
            alert(isEditing ? 'Perfil editado com sucesso!' : 'Perfil criado com sucesso!');
        } catch (error) {
            console.error(isEditing ? 'Erro ao editar perfil:' : 'Erro ao criar perfil:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPerfil({ ...newPerfil, [name]: value });
    };

    const handleEditPerfil = (perfil) => {
        setNewPerfil({ 
            nome_perfil: perfil.nome_perfil, 
            descricao: perfil.descricao, 
            modulos: perfil.Modulos ? perfil.Modulos.map(modulo => modulo.id_modulo) : [] 
        });
        setSelectedModulos(perfil.Modulos ? perfil.Modulos.map(modulo => ({ value: modulo.id_modulo, label: modulo.nome_modulo })) : []);
        setIsEditing(true);
        setEditingPerfilId(perfil.id_perfil);
        setIsModalOpen(true);
    };

    const handleChangeSelect = (selectedOptions) => {
        setSelectedModulos(selectedOptions);
        setNewPerfil({ ...newPerfil, modulos: selectedOptions.map(option => option.value) });
    };

    const handleDeletePerfil = async (id_perfil) => {
        if (confirm('Tem certeza de que deseja excluir este perfil?')) {
            try {
                await fetch(`/api/perfis?id_perfil=${id_perfil}`, {
                    method: 'DELETE'
                });
                setPerfis(perfis.filter(perfil => perfil.id_perfil !== id_perfil));
            } catch (error) {
                console.error('Erro ao excluir perfil:', error);
                alert('Erro ao excluir perfil. Tente novamente.');
            }
        }
    };

    const handleDownloadReport = async () => {
    try {
        const response = await fetch(`http://localhost:5000/download/perfil`);
        if (!response.ok) {
            throw new Error('Erro ao baixar o relatório');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'perfil.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Relatório baixado com sucesso!');
    } catch (error) {
        console.error('Erro ao baixar o relatório:', error);
        alert('Erro ao baixar o relatório. Tente novamente.');
    }
};


    const filteredPerfis = perfis.filter(perfil =>
        perfil &&
        ((perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (perfil.nome_perfil && perfil.nome_perfil.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const options = modulos.map(modulo => ({
        value: modulo.id_modulo,
        label: modulo.nome_modulo,
    }));

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar dados: {error.message}</div>;
    }

    const handleOpenNewPerfilModal = () => {
        setNewPerfil({ nome_perfil: '', descricao: '', modulos: [] });
        setSelectedModulos([]);
        setIsEditing(false);
        setIsModalOpen(true);
    };

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
                <div id="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome do Perfil</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPerfis.map((perfil) => (
                                <tr key={perfil.id_perfil}>
                                    <td>{perfil.nome_perfil}</td>
                                    <td>{perfil.descricao}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditPerfil(perfil)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeletePerfil(perfil.id_perfil)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div id="button-container">
                    <button id="baixar-relatorio" onClick={handleDownloadReport}>Baixar Relatório</button>
                    <button id="criar-perfil" onClick={handleOpenNewPerfilModal}>Criar Novo Perfil</button>
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsModalOpen(false); setIsEditing(false); }}>&times;</span>
                        <h2>{isEditing ? 'Editar Perfil' : 'Criar Perfil'}</h2>
                        <div className="modal-body">
                            <label htmlFor="nome_perfil">Nome do Perfil:</label>
                            <input 
                                type="text" 
                                id="nome_perfil" 
                                name="nome_perfil" 
                                value={newPerfil.nome_perfil}
                                onChange={handleInputChange}
                                />
                                <label htmlFor="descricao">Descrição:</label>
                                <textarea 
                                    id="descricao" 
                                    name="descricao" 
                                    value={newPerfil.descricao}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="modulos">Módulos:</label>
                                <Select
                                    id="modulos"
                                    name="modulos"
                                    isMulti
                                    value={selectedModulos}
                                    onChange={handleChangeSelect}
                                    options={options}
                                />
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleCreateOrEditPerfil}>{isEditing ? 'Salvar Alterações' : 'Criar Perfil'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
