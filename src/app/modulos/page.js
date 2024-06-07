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

    const handleCreateModulo = async () => {
        const nome_modulo = prompt('Nome do módulo:');
        const descricao = prompt('Descrição do módulo:');
        
        try {
            const response = await axios.post('/api/modulos', { nome_modulo, descricao });
            setModulos([...modulos, response.data]);
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
        <button id="criar-modulo" onClick={handleCreateModulo}>Criar Novo Módulo</button>
    </div>
    <Footer />
</>


    );
}

