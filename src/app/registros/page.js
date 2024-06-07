'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Importe FaSearch do react-icons
import Image from 'next/image';
import Head from 'next/head';
import "/src/styles/usuarios.css"; // Certifique-se de que o caminho esteja correto
import Footer from '/src/components/Footer'; // Ajuste o caminho conforme necessário
import Sidebar from '/src/components/Sidebar'; // Ajuste o caminho conforme necessário

export default function UserAdminPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Chamada à API para buscar os usuários
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users'); // Ajuste a URL conforme necessário
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateUser = () => {
        window.location.href = '/novoRegistro';
    };

    const filteredUsers = users.filter(user =>
        (user.nome_usuario && user.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.matricula && user.matricula.toString().includes(searchTerm))
    );

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Administração de Usuários</title>
            </Head>
            <Sidebar />
            <div id="main-content">
                <h1>Usuários Existentes</h1>
                <div id="search-wrapper">
                    <h2 id="search-title">Usuários</h2>
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
                            <th>Nome de Usuário</th>
                            <th>Matrícula</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.nome_usuario}</td>
                                <td>{user.matricula}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button id="criar-usuario" onClick={handleCreateUser}>Criar Novo Usuário</button>
            </div>
            <Footer />
        </>
    );
}
