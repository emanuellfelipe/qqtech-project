'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import '/src/styles/funcoes.css';
import Footer from '/src/components/Footer';
import Sidebar from '/src/components/Sidebar';
import Select from 'react-select';

export default function FuncoesAdminPage() {
    const [funcoes, setFuncoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFuncao, setNewFuncao] = useState({ nome_funcoes: '', descricao: '', modulos: [] });
    const [modulos, setModulos] = useState([]);
    const [selectedModulos, setSelectedModulos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingFuncaoId, setEditingFuncaoId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFuncoes = async () => {
            try {
                const response = await fetch('/api/funcoes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar funções');
                }
                const data = await response.json();
                setFuncoes(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar funções:', error);
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
                setModulos(data.data || []);
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
            }
        };
    
        fetchFuncoes();
        fetchModulos();
    }, [isEditing]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const redirectToModulos = () => {
        window.location.href = '/modulos';
      };
      
      const redirectToTransacoes = () => {
        window.location.href = '/transacoes';
      };


      const handleCreateOrEditFuncao = async () => {
        const url = isEditing ? `/api/funcoes?id_funcao=${editingFuncaoId}` : '/api/funcoes';
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newFuncao, modulos: selectedModulos.map(modulo => modulo.value) }),
            });
    
            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar função' : 'Erro ao criar função');
            }
    
            const data = await response.json();
            const funcaoAtualizada = data.data;
    
            if (isEditing) {
                setFuncoes(funcoes.map(funcao => (funcao.id_funcao === editingFuncaoId ? funcaoAtualizada : funcao)));
            } else {
                setFuncoes([...funcoes, funcaoAtualizada]);
            }
    
            setIsModalOpen(false);
            setNewFuncao({ nome_funcoes: '', descricao: '', modulos: [] });
            setSelectedModulos([]);
            setIsEditing(false);
            setEditingFuncaoId(null);
            alert(isEditing ? 'Função editada com sucesso!' : 'Função criada com sucesso!');

            window.location.reload();
        } catch (error) {
            console.error(isEditing ? 'Erro ao editar função:' : 'Erro ao criar função:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFuncao({ ...newFuncao, [name]: value });
    };

    const handleEditFuncao = (funcao) => {
        setNewFuncao({
            nome_funcoes: funcao.nome_funcoes,
            descricao: funcao.descricao,
            modulos: funcao.Modulos ? funcao.Modulos.map(modulo => modulo.id_modulo) : [],
        });
        setSelectedModulos(funcao.Modulos ? funcao.Modulos.map(modulo => ({ value: modulo.id_modulo, label: modulo.nome_modulo })) : []);
        setIsEditing(true);
        setEditingFuncaoId(funcao.id_funcao);
        setIsModalOpen(true);
    };

    const handleChangeSelect = (selectedOptions) => {
        setSelectedModulos(selectedOptions);
        setNewFuncao({ ...newFuncao, modulos: selectedOptions.map(option => option.value) });
    };

    const handleDeleteFuncao = async (id_funcao) => {
        if (confirm('Tem certeza de que deseja excluir esta função?')) {
            try {
                await fetch(`/api/funcoes?id_funcao=${id_funcao}`, {
                    method: 'DELETE'
                });
                setFuncoes(funcoes.filter(funcao => funcao.id_funcao !== id_funcao));
            } catch (error) {
                console.error('Erro ao excluir função:', error);
                alert('Erro ao excluir função. Tente novamente.');
            }
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`http://localhost:5000/download/funcoes`);
            if (!response.ok) {
                throw new Error('Erro ao baixar o relatório');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'funcao.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Relatório baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
            alert('Erro ao baixar o relatório. Tente novamente.');
        }
    };

    const filteredFuncoes = funcoes.filter(funcao =>
        funcao &&
        ((funcao.descricao && funcao.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (funcao.nome_funcoes && funcao.nome_funcoes.toLowerCase().includes(searchTerm.toLowerCase())))
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

    const handleOpenNewFuncaoModal = () => {
        setNewFuncao({ nome_funcoes: '', descricao: '', modulos: [] });
        setSelectedModulos([]);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Administração de Funções</title>
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1>Funções Existentes</h1>
                <div id="search-wrapper">                    
                    <h2 className="menu-item" onClick={redirectToModulos}>Módulos</h2>
                    <h2 className="menu-item" onClick={redirectToTransacoes}>Transacoes</h2>
                    <h2 id="search-title">Funções</h2>
                    <div className="mobile-dropdown">
                        <input type="checkbox" id="dropdownCheckbox" className="dropdown-checkbox" />
                        <label htmlFor="dropdownCheckbox" className="dropdown-toggle">Mais +</label>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li onClick={redirectToTransacoes}>Transações</li>
                            <li onClick={redirectToModulos}>Módulos</li>
                        </ul>
                    </div>
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
                                <th>Nome da Função</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFuncoes.map((funcao) => (
                                <tr key={funcao.id_funcao}>
                                    <td>{funcao.nome_funcoes}</td>
                                    <td>{funcao.descricao}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditFuncao(funcao)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteFuncao(funcao.id_funcao)}>
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
                    <button id="criar-funcao" onClick={handleOpenNewFuncaoModal}>Criar Nova Função</button>
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsModalOpen(false); setIsEditing(false); }}>&times;</span>
                        <h2>{isEditing ? 'Editar Função' : 'Criar Função'}</h2>
                        <div className="modal-body">
                            <label htmlFor="nome_funcoes">Nome da Função:</label>
                            <input
                                type="text"
                                id="nome_funcoes"
                                name="nome_funcoes"
                                value={newFuncao.nome_funcoes}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="descricao">Descrição:</label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={newFuncao.descricao}
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
                            <button onClick={handleCreateOrEditFuncao}>{isEditing ? 'Salvar Alterações' : 'Criar Função'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
