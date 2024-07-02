'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import '/src/styles/modulos.css';
import Footer from '/src/components/Footer';
import Sidebar from '/src/components/Sidebar';
import Select from 'react-select';

export default function ModulosAdminPage() {
    const [modulos, setModulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newModulo, setNewModulo] = useState({ nome_modulo: '', descricao: '', transacoes: [], funcoes: [] });
    const [transacoes, setTransacoes] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [selectedTransacoes, setSelectedTransacoes] = useState([]);
    const [selectedFuncoes, setSelectedFuncoes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingModuloId, setEditingModuloId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModulos = async () => {
            try {
                const response = await fetch('/api/modulos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar módulos');
                }
                const data = await response.json();
                setModulos(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
                setError(error);
                setIsLoading(false);
            }
        };
        
        const fetchTransacoes = async () => {
            try {
                const response = await fetch('/api/transacoes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar transações');
                }
                const data = await response.json();
                setTransacoes(data.data || []);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        };

        const fetchFuncoes = async () => {
            try {
                const response = await fetch('/api/funcoes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar funções');
                }
                const data = await response.json();
                setFuncoes(data.data || []);
            } catch (error) {
                console.error('Erro ao buscar funções:', error);
            }
        };
        
        fetchModulos();
        fetchTransacoes();
        fetchFuncoes();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const redirectToTransacoes = () => {
        window.location.href = '/transacoes';
      };
      
      const redirectToFuncoes = () => {
        window.location.href = '/funcoes';
      };
   
    const handleCreateOrEditModulo = async () => {
        const url = isEditing ? `/api/modulos?id_modulo=${editingModuloId}` : '/api/modulos';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newModulo, transacoes: selectedTransacoes.map(transacao => transacao.value), funcoes: selectedFuncoes.map(funcao => funcao.value) }),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar módulo' : 'Erro ao criar módulo');
            }

            const data = await response.json();
            const moduloAtualizado = data.data;

            if (isEditing) {
                setModulos(modulos.map(modulo => (modulo.id_modulo === editingModuloId ? moduloAtualizado : modulo)));
            } else {
                setModulos([...modulos, moduloAtualizado]);
            }

            setIsModalOpen(false);
            setNewModulo({ nome_modulo: '', descricao: '', transacoes: [], funcoes: [] });
            setSelectedTransacoes([]);
            setSelectedFuncoes([]);
            setIsEditing(false);
            setEditingModuloId(null);
            alert(isEditing ? 'Módulo editado com sucesso!' : 'Módulo criado com sucesso!');
        } catch (error) {
            console.error(isEditing ? 'Erro ao editar módulo:' : 'Erro ao criar módulo:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModulo({ ...newModulo, [name]: value });
    };

    const handleEditModulo = (modulo) => {
        setNewModulo({
            nome_modulo: modulo.nome_modulo,
            descricao: modulo.descricao,
            transacoes: modulo.Transacoes ? modulo.Transacoes.map(transacao => transacao.id_transacao) : [],
            funcoes: modulo.Funcoes ? modulo.Funcoes.map(funcao => funcao.id_funcao) : []
        });
        setSelectedTransacoes(modulo.Transacoes ? modulo.Transacoes.map(transacao => ({ value: transacao.id_transacao, label: transacao.nome_transacao })) : []);
        setSelectedFuncoes(modulo.Funcoes ? modulo.Funcoes.map(funcao => ({ value: funcao.id_funcao, label: funcao.nome_funcoes })) : []);
        setIsEditing(true);
        setEditingModuloId(modulo.id_modulo);
        setIsModalOpen(true);
    };

    const handleChangeSelectTransacoes = (selectedOptions) => {
        setSelectedTransacoes(selectedOptions);
        setNewModulo({ ...newModulo, transacoes: selectedOptions.map(option => option.value) });
    };

    const handleChangeSelectFuncoes = (selectedOptions) => {
        setSelectedFuncoes(selectedOptions);
        setNewModulo({ ...newModulo, funcoes: selectedOptions.map(option => option.value) });
    };

    const handleDeleteModulo = async (id_modulo) => {
        if (confirm('Tem certeza de que deseja excluir este módulo?')) {
            try {
                await fetch(`/api/modulos?id_modulo=${id_modulo}`, {
                    method: 'DELETE'
                });
                setModulos(modulos.filter(modulo => modulo.id_modulo !== id_modulo));
            } catch (error) {
                console.error('Erro ao excluir módulo:', error);
                alert('Erro ao excluir módulo. Tente novamente.');
            }
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`http://localhost:5000/download/modulos`);
            if (!response.ok) {
                throw new Error('Erro ao baixar o relatório');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Modulo.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Relatório baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
            alert('Erro ao baixar o relatório. Tente novamente.');
        }
    };

    const filteredModulos = modulos.filter(modulo =>
        modulo &&
        ((modulo.descricao && modulo.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (modulo.nome_modulo && modulo.nome_modulo.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const optionsTransacoes = transacoes.map(transacao => ({
        value: transacao.id_transacao,
        label: transacao.nome_transacao,
    }));

    const optionsFuncoes = funcoes.map(funcao => ({
        value: funcao.id_funcao,
        label: funcao.nome_funcoes,
    }));

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar dados: {error.message}</div>;
    }

    const handleOpenNewModuloModal = () => {
        setNewModulo({ nome_modulo: '', descricao: '', transacoes: [], funcoes: [] });
        setSelectedTransacoes([]);
        setSelectedFuncoes([]);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Administração de Módulos</title>
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1>Módulos Existentes</h1>
                <div id="search-wrapper">
                    <h2 id="search-title">Módulos</h2>
                    <h2 className="menu-item" onClick={redirectToTransacoes}>Transações</h2>
                    <h2 className="menu-item" onClick={redirectToFuncoes}>Funções</h2>
                    <div className="mobile-dropdown">
                        <input type="checkbox" id="dropdownCheckbox" className="dropdown-checkbox" />
                        <label htmlFor="dropdownCheckbox" className="dropdown-toggle">Mais +</label>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li onClick={redirectToTransacoes}>Transações</li>
                            <li onClick={redirectToFuncoes}>Funções</li>
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
                                <th>Nome do Módulo</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModulos.map((modulo) => (
                                <tr key={modulo.id_modulo}>
                                    <td>{modulo.nome_modulo}</td>
                                    <td>{modulo.descricao}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditModulo(modulo)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteModulo(modulo.id_modulo)}>
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
                    <button id="criar-modulo" onClick={handleOpenNewModuloModal}>Criar Novo Módulo</button>
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsModalOpen(false); setIsEditing(false); }}>&times;</span>
                        <h2>{isEditing ? 'Editar Módulo' : 'Criar Módulo'}</h2>
                        <div className="modal-body">
                            <label htmlFor="nome_modulo">Nome do Módulo:</label>
                            <input
                                type="text"
                                id="nome_modulo"
                                name="nome_modulo"
                                value={newModulo.nome_modulo}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="descricao">Descrição:</label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={newModulo.descricao}
                                onChange={handleInputChange}
                            />

                        </div>
                        <div className="modal-footer">
                            <button onClick={handleCreateOrEditModulo}>{isEditing ? 'Salvar Alterações' : 'Criar Módulo'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
