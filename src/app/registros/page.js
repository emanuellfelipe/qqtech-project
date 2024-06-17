// app/registros/page.js
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '/src/components/Sidebar';
import Footer from '/src/components/Footer';
import "/src/styles/usuarios.css";

export default function UserAdminPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
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

    const handleEditUser = (id_usuario) => {
        window.location.href = `/editRegistro/${id_usuario}`;
    };

    const handleDeleteUser = async (matricula) => {
        const userToDelete = users.find(user => user.matricula === matricula);

        if (!userToDelete) {
            console.error('Usuário não encontrado para a matrícula:', matricula);
            alert('Usuário não encontrado. A exclusão não pode ser realizada.');
            return;
        }

        const id_usuario = userToDelete.id_usuario;

        if (confirm('Tem certeza de que deseja excluir este usuário?')) {
            try {
                await axios.delete(`/api/users?id_usuario=${id_usuario}`);
                setUsers(users.filter(user => user.id_usuario !== id_usuario));
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário. Tente novamente.');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.nome_usuario && user.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.matricula && user.matricula.toString().includes(searchTerm))
    );

    return (
        <>
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
                <div id="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome de Usuário</th>
                                <th>Matrícula</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id_usuario}>
                                    <td>{user.nome_usuario}</td>
                                    <td>{user.matricula}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditUser(user.id_usuario)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteUser(user.matricula)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button id="criar-usuario" onClick={handleCreateUser}>Criar Novo Usuário</button>
            </div>
            <Footer />
        </>
    );
}
