'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa'; 
import '/src/styles/transacoes.css'; 
import Footer from '/src/components/Footer'; 
import Sidebar from '/src/components/Sidebar'; 
import Select from 'react-select';

export default function TransacoesAdminPage() {
    const [transacoes, setTransacoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransacao, setNewTransacao] = useState({ nome_transacao: '', descricao: '', modulos: [] });
    const [modulos, setModulos] = useState([]);
    const [selectedModulos, setSelectedModulos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTransacaoId, setEditingTransacaoId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                const response = await fetch('/api/transacoes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar transacoes');
                }
                const data = await response.json();
                setTransacoes(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar transacoes:', error);
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

        fetchTransacoes();
        fetchModulos();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const redirectToModulos = () => {
        window.location.href = '/modulos';
      };
      
      const redirectToFuncoes = () => {
        window.location.href = '/funcoes';
      };
    
    const handleCreateOrEditTransacao = async () => {
        const url = isEditing ? `/api/transacoes?id_transacao=${editingTransacaoId}` : '/api/transacoes';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newTransacao, modulos: selectedModulos.map(modulo => modulo.value) }),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar transacao' : 'Erro ao criar transacao');
            }

            const data = await response.json();
            const transacaoAtualizada = data.data;

            if (isEditing) {
                setTransacoes(transacoes.map(transacao => (transacao.id_transacao === editingTransacaoId ? transacaoAtualizada : transacao)));
            } else {
                setTransacoes([...transacoes, transacaoAtualizada]);
            }

            setIsModalOpen(false);
            setNewTransacao({ nome_transacao: '', descricao: '', modulos: [] });
            setSelectedModulos([]);
            setIsEditing(false);
            setEditingTransacaoId(null);
            alert(isEditing ? 'Transação editada com sucesso!' : 'Transação criada com sucesso!');
        } catch (error) {
            console.error(isEditing ? 'Erro ao editar transacao:' : 'Erro ao criar transacao:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransacao({ ...newTransacao, [name]: value });
    };

    const handleEditTransacao = (transacao) => {
        setNewTransacao({ 
            nome_transacao: transacao.nome_transacao, 
            descricao: transacao.descricao, 
            modulos: transacao.Modulos ? transacao.Modulos.map(modulo => modulo.id_modulo) : [] 
        });
        setSelectedModulos(transacao.Modulos ? transacao.Modulos.map(modulo => ({ value: modulo.id_modulo, label: modulo.nome_modulo })) : []);
        setIsEditing(true);
        setEditingTransacaoId(transacao.id_transacao);
        setIsModalOpen(true);
    };

    const handleChangeSelect = (selectedOptions) => {
        setSelectedModulos(selectedOptions);
        setNewTransacao({ ...newTransacao, modulos: selectedOptions.map(option => option.value) });
    };

    const handleDeleteTransacao = async (id_transacao) => {
        if (confirm('Tem certeza de que deseja excluir esta transação?')) {
            try {
                await fetch(`/api/transacoes?id_transacao=${id_transacao}`, {
                    method: 'DELETE'
                });
                setTransacoes(transacoes.filter(transacao => transacao.id_transacao !== id_transacao));
            } catch (error) {
                console.error('Erro ao excluir transacao:', error);
                alert('Erro ao excluir transacao. Tente novamente.');
            }
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`http://localhost:5000/download/transacoes`);
            if (!response.ok) {
                throw new Error('Erro ao baixar o relatório');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'transacao.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Relatório baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
            alert('Erro ao baixar o relatório. Tente novamente.');
        }
    };

    const filteredTransacoes = transacoes.filter(transacao =>
        transacao &&
        ((transacao.descricao && transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transacao.nome_transacao && transacao.nome_transacao.toLowerCase().includes(searchTerm.toLowerCase())))
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

    const handleOpenNewTransacaoModal = () => {
        setNewTransacao({ nome_transacao: '', descricao: '', modulos: [] });
        setSelectedModulos([]);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Administração de Transações</title>
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1>Transações Existentes</h1>
                <div id="search-wrapper">
                    <h2 className="menu-item" onClick={redirectToModulos}>Módulos</h2>
                    <h2 id="search-title">Transações</h2>                    
                    <h2 className="menu-item" onClick={redirectToFuncoes}>Funções</h2>
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
                                <th>Nome da Transação</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransacoes.map((transacao) => (
                                <tr key={transacao.id_transacao}>
                                    <td>{transacao.nome_transacao}</td>
                                    <td>{transacao.descricao}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditTransacao(transacao)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteTransacao(transacao.id_transacao)}>
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
                    <button id="criar-transacao" onClick={handleOpenNewTransacaoModal}>Criar Nova Transação</button>
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsModalOpen(false); setIsEditing(false); }}>&times;</span>
                        <h2>{isEditing ? 'Editar Transação' : 'Criar Transação'}</h2>
                        <div className="modal-body">
                            <label htmlFor="nome_transacao">Nome da Transação:</label>
                            <input 
                                type="text" 
                                id="nome_transacao" 
                                name="nome_transacao" 
                                value={newTransacao.nome_transacao}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="descricao">Descrição:</label>
                            <textarea 
                                id="descricao" 
                                name="descricao" 
                                value={newTransacao.descricao}
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
                            <button onClick={handleCreateOrEditTransacao}>{isEditing ? 'Salvar Alterações' : 'Criar Transação'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
