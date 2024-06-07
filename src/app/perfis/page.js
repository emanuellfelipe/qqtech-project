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

        fetchPerfis();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreatePerfil = async () => {
        const nome_perfil = prompt('Nome do Perfil:');
        const descricao = prompt('Descrição do Perfil:');
        
        try {
            const response = await fetch('/api/perfis', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nome_perfil, descricao }),
            });

            if (!response.ok) {
              throw new Error('Erro ao criar perfil');
            }

            const data = await response.json();
            setPerfis([...perfis, data.data]);
        } catch (error) {
            console.error('Erro ao criar perfil:', error);
        }
    };

    const filteredPerfis = perfis.filter(perfil =>
        perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfil.nome_perfil.toLowerCase().includes(searchTerm.toLowerCase())
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
        <button id="criar-perfil" onClick={handleCreatePerfil}>Criar Novo Perfil</button>
    </div>
    <Footer />
</>


    );
}
