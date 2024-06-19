// Página ModulosAdminPage.js

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FaSearch } from 'react-icons/fa';
import "/src/styles/modulos.css";
import Footer from '/src/components/Footer';
import Sidebar from '/src/components/Sidebar';

export default function ModulosAdminPage() {
    const [modulos, setModulos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newElemento, setNewElemento] = useState({ nome: '', descricao: '' });
    const [currentCategory, setCurrentCategory] = useState('modulos');

    useEffect(() => {
        const fetchModulos = async () => {
            try {
                const response = await axios.get('/api/modulos');
                setModulos(response.data);
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
            }
        };

        const fetchTransacoes = async () => {
            try {
                const response = await axios.get('/api/transacoes');
                setTransacoes(response.data);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        };

        const fetchFuncoes = async () => {
            try {
                const response = await axios.get('/api/funcoes');
                setFuncoes(response.data);
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

    const openModal = () => {
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
                    setModulos([...modulos, response.data]);
                    break;
                case 'transacoes':
                    response = await axios.post('/api/transacoes', {
                        nome_transacao: newElemento.nome,
                        descricao: newElemento.descricao,
                    });
                    setTransacoes([...transacoes, response.data]);
                    break;
                case 'funcoes':
                    response = await axios.post('/api/funcoes', newElemento);
                    setFuncoes([...funcoes, response.data]);
                    break;
                default:
                    break;
            }
            setNewElemento({ nome: '', descricao: '' });
            closeModal();
            alert('Elemento criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar elemento:', error);
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
                return 'Transações';
            case 'funcoes':
                return 'Funções';
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems().map((item) => (
                                <tr key={item.id}>
                                    <td>{getNameFieldByCategory(item)}</td>
                                    <td>{item.descricao}</td>
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
                        <h2>Criar Novo Elemento</h2>
                        <form>
                            <label>
                                Nome do Elemento:
                                <input
                                    type="text"
                                    name="nome"
                                    value={newElemento.nome}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Descrição:
                                <input
                                    type="text"
                                    name="descricao"
                                    value={newElemento.descricao}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <div className="modal-buttons">
                                <button type="button" className="cancel" onClick={closeModal}>Cancelar</button>
                                <button type="button" onClick={handleCreateElemento}>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
