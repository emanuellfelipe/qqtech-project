'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
import "/src/styles/modulos.css"; 
import Footer from '/src/components/Footer'; 
import Sidebar from '/src/components/Sidebar'; 

export default function ModulosAdminPage() {
    const [modulos, setModulos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newElemento, setNewElemento] = useState({ nome: '', descricao: '', modulos: [] }); // Adicionando o estado de modulos
    const [currentCategory, setCurrentCategory] = useState('modulos');
    const [isEditing, setIsEditing] = useState(false);
    const [editingElementId, setEditingElementId] = useState(null);
    const [editElement, setEditElement] = useState({ nome: '', descricao: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseModulos = await axios.get('/api/modulos');
                console.log('Dados recebidos de /api/modulos:', responseModulos.data);
                setModulos(responseModulos.data.data || []);
    
                const responseTransacoes = await axios.get('/api/transacoes');
                console.log('Dados recebidos de /api/transacoes:', responseTransacoes.data);
                setTransacoes(responseTransacoes.data.data || []);
    
                const responseFuncoes = await axios.get('/api/funcoes');
                console.log('Dados recebidos de /api/funcoes:', responseFuncoes.data);
                setFuncoes(responseFuncoes.data.data || []);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const openModal = () => {
        setIsEditing(false); 
        setNewElemento({ nome: '', descricao: '', modulos: [] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewElemento({ ...newElemento, [name]: value });
    };

    const handleCreateElemento = async () => {
        try {
            let response;
            switch (currentCategory) {
                case 'modulos':
                    response = await axios.post('/api/modulos', {
                        nome_modulo: newElemento.nome,
                        descricao: newElemento.descricao,
                    });
                    setModulos([...modulos, response.data.data]);
                    break;
                case 'transacoes':
                    response = await axios.post('/api/transacoes', {
                        nome_transacao: newElemento.nome,
                        descricao: newElemento.descricao,
                    });
                    setTransacoes([...transacoes, response.data.data]);
                    break;
                case 'funcoes':
                    response = await axios.post('/api/funcoes', newElemento);
                    setFuncoes([...funcoes, response.data.data]);
                    break;
                default:
                    break;
            }
            setNewElemento({ nome: '', descricao: '', modulos: [] });
            closeModal();
            alert('Elemento criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar elemento:', error);
        }
    };

    const handleEditElemento = (elemento) => {
        setEditingElementId(elemento.id);
        // Configurar o nome com base na categoria atual
        switch (currentCategory) {
            case 'modulos':
                setEditElement({ nome: elemento.nome_modulo, descricao: elemento.descricao });
                break;
            case 'transacoes':
                setEditElement({ nome: elemento.nome_transacao, descricao: elemento.descricao });
                break;
            case 'funcoes':
                setEditElement({ nome: elemento.nome_funcoes, descricao: elemento.descricao });
                break;
            default:
                break;
        }
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleUpdateElemento = async () => {
        try {
            let response;
            switch (currentCategory) {
                case 'modulos':
                    response = await axios.put(`/api/modulos/${editingElementId}`, {
                        nome_modulo: editElement.nome,
                        descricao: editElement.descricao,
                    });
                    setModulos(modulos.map(modulo => (modulo.id_modulo === editingElementId ? response.data.data : modulo)));
                    break;
                case 'transacoes':
                    response = await axios.put(`/api/transacoes/${editingElementId}`, {
                        nome_transacao: editElement.nome,
                        descricao: editElement.descricao,
                    });
                    setTransacoes(transacoes.map(transacao => (transacao.id_transacao === editingElementId ? response.data.data : transacao)));
                    break;
                case 'funcoes':
                    response = await axios.put(`/api/funcoes/${editingElementId}`, {
                        nome_funcoes: editElement.nome,
                        descricao: editElement.descricao,
                    });
                    setFuncoes(funcoes.map(funcao => (funcao.id_funcoes === editingElementId ? response.data.data : funcao)));
                    break;
                default:
                    break;
            }
            setEditElement({ nome: '', descricao: '' });
            setIsEditing(false);
            setIsModalOpen(false);
            alert('Elemento atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar elemento:', error);
        }
    };
    

    const handleDeleteElemento = async (id) => {
        if (confirm('Tem certeza de que deseja excluir este elemento?')) {
            try {
                switch (currentCategory) {
                    case 'modulos':
                        await axios.delete(`/api/modulos/${id}`);
                        setModulos(modulos.filter(modulo => modulo.id_modulo !== id));
                        break;
                    case 'transacoes':
                        await axios.delete(`/api/transacoes/${id}`);
                        setTransacoes(transacoes.filter(transacao => transacao.id_transacao !== id));
                        break;
                    case 'funcoes':
                        await axios.delete(`/api/funcoes/${id}`);
                        setFuncoes(funcoes.filter(funcao => funcao.id_funcao !== id));
                        break;
                    default:
                        break;
                }
                alert('Elemento excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir elemento:', error);
            }
        }
    };
    
    
    const filteredItems = () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        switch (currentCategory) {
            case 'modulos':
                return modulos.filter(modulo =>
                    modulo.nome_modulo.toLowerCase().includes(lowerCaseSearchTerm) ||
                    modulo.descricao.toLowerCase().includes(lowerCaseSearchTerm)
                );
            case 'transacoes':
                return transacoes.filter(transacao =>
                    transacao.nome_transacao.toLowerCase().includes(lowerCaseSearchTerm) ||
                    transacao.descricao.toLowerCase().includes(lowerCaseSearchTerm)
                );
            case 'funcoes':
                return funcoes.filter(funcao =>
                    funcao.nome_funcoes.toLowerCase().includes(lowerCaseSearchTerm) ||
                    funcao.descricao.toLowerCase().includes(lowerCaseSearchTerm)
                );
            default:
                return [];
        }
    };

    const handleToggleCategory = (category) => {
        setCurrentCategory(category);
    };

    const getTitleByCategory = () => {
        switch (currentCategory) {
            case 'modulos':
                return 'Módulos';
            case 'transacoes':
                return 'Módulos - Transações';
            case 'funcoes':
                return 'Módulos - Funções';
            default:
                return 'Administração de Elementos';
        }
    };

    const getNameFieldByCategory = (item) => {
        switch (currentCategory) {
            case 'modulos':
                return item.nome_modulo;
            case 'transacoes':
                return item.nome_transacao;
            case 'funcoes':
                return item.nome_funcoes;
            default:
                return '';
        }
    };

    const getModalTitleByCategory = () => {
        switch (currentCategory) {
            case 'modulos':
                return isEditing ? 'Módulo' : 'Módulo';
            case 'transacoes':
                return isEditing ? 'Transação' : 'Transação';
            case 'funcoes':
                return isEditing ? 'Função' : 'Função';
            default:
                return 'Elemento';
        }
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>{getTitleByCategory()}</title> 
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1 id="search-title">{getTitleByCategory()}</h1>
                <div id="search-wrapper">
                    <div>
                        <button
                            className={`category-button ${currentCategory === 'modulos' ? 'selected' : ''}`}
                            onClick={() => handleToggleCategory('modulos')}
                        >
                            Módulos
                        </button>
                        <button
                            className={`category-button ${currentCategory === 'transacoes' ? 'selected' : ''}`}
                            onClick={() => handleToggleCategory('transacoes')}
                        >
                            Transações
                        </button>
                        <button
                            className={`category-button ${currentCategory === 'funcoes' ? 'selected' : ''}`}
                            onClick={() => handleToggleCategory('funcoes')}
                        >
                            Funções
                        </button>
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
                                <th>TAG de Abreviação</th>
                                <th>Descrição</th>
                                <th>Ações</th> {/* Adicionando coluna para ações */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems().map((item) => (
                                <tr key={item.id}>
                                    <td>{getNameFieldByCategory(item)}</td>
                                    <td>{item.descricao}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditElemento(item)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteElemento(item.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button id="criar-elemento" onClick={openModal}>Criar Novo Elemento</button>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{isEditing ? `Editar ${getModalTitleByCategory()}` : `Criar ${getModalTitleByCategory()}`}</h2>
                        <form>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="nome"
                                    value={isEditing ? editElement.nome : newElemento.nome}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Descrição:
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={isEditing ? editElement.descricao : newElemento.descricao}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {currentCategory !== 'modulos' && (
                                <Select
                                    id="modulos"
                                    name="modulos"
                                    isMulti
                                    value={newElemento.modulos} // Valor selecionado
                                    onChange={(selectedOptions) => handleInputChange({ target: { name: 'modulos', value: selectedOptions.map(option => option.value) } })}
                                    options={modulos.map(modulo => ({ value: modulo.id_modulo, label: modulo.nome_modulo }))}
                                />
                            )}
                            <div className="modal-footer">
                                <button type="button" onClick={isEditing ? handleUpdateElemento : handleCreateElemento}>
                                    {isEditing ? 'Salvar Alterações' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
