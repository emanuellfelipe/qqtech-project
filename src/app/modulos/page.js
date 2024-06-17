'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch } from 'react-icons/fa'; 
import "/src/styles/modulos.css"; 
import Footer from '/src/components/Footer'; 
import Sidebar from '/src/components/Sidebar'; 

export default function ModulosAdminPage() {
    const [modulos, setModulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newModulo, setNewModulo] = useState({ nome_modulo: '', descricao: '' });

    useEffect(() => {
        // Chamada à API para buscar os módulos
        const fetchModulos = async () => {
            try {
                const response = await axios.get('/api/modulos');
                setModulos(response.data);
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
            }
        };

        fetchModulos();
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
        setNewModulo({ ...newModulo, [name]: value });
    };

    const handleCreateModulo = async () => {
        try {
            const response = await axios.post('/api/modulos', newModulo);
            setModulos([...modulos, response.data]);
            setNewModulo({ nome_modulo: '', descricao: '' }); // Limpa os campos do novo módulo
            closeModal(); // Fecha o modal após criar o módulo
            alert('Módulo criado com sucesso!'); // Exibe mensagem de sucesso
        } catch (error) {
            console.error('Erro ao criar módulo:', error);
        }
    };

    const filteredModulos = modulos.filter(modulo =>
        modulo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modulo.nome_modulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <th>Tag Abreviação</th>
                                <th>Nome do Módulo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModulos.map((modulo) => (
                                <tr key={modulo.id_modulo}>
                                    <td>{modulo.nome_modulo}</td>
                                    <td>{modulo.descricao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button id="criar-modulo" onClick={openModal}>Criar Novo Módulo</button>
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Criar Novo Módulo</h2>
                        <form>
                            <label>
                                Nome do Módulo:
                                <input
                                    type="text"
                                    name="nome_modulo"
                                    value={newModulo.nome_modulo}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Descrição:
                                <input
                                    type="text"
                                    name="descricao"
                                    value={newModulo.descricao}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <div className="modal-buttons">
                                <button type="button" className="cancel" onClick={closeModal}>Cancelar</button>
                                <button type="button" onClick={handleCreateModulo}>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
