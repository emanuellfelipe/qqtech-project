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
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedNomeUsuario, setEditedNomeUsuario] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedNomeCompleto, setEditedNomeCompleto] = useState('');
    const [editedMatricula, setEditedMatricula] = useState(''); // Novo estado para matrícula
    const [passwordVisible, setPasswordVisible] = useState(false);

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

    const handleEditUser = (id_usuario) => {
        const userToEdit = users.find(user => user.id_usuario === id_usuario);
        setEditingUser(userToEdit);
        setEditedNomeUsuario(userToEdit.nome_usuario);
        setEditedEmail(userToEdit.email);
        setEditedNomeCompleto(userToEdit.nome_completo);
        setEditedMatricula(userToEdit.matricula); // Carregar matrícula para o estado
        setIsModalOpen(true);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedUser = {
                ...editingUser,
                nome_usuario: editedNomeUsuario,
                email: editedEmail,
                nome_completo: editedNomeCompleto,
                matricula: editedMatricula // Incluir matrícula nas alterações
            };

            const response = await axios.put(`/api/users/${updatedUser.id_usuario}`, updatedUser);

            if (response.status === 200) {
                setUsers(users.map(user => (user.id_usuario === updatedUser.id_usuario ? updatedUser : user)));
                setIsModalOpen(false);
                alert('Usuário editado com sucesso!');
            } else {
                alert('Erro ao editar usuário. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            alert('Erro ao editar usuário. Tente novamente.');
        }
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
                <button id="criar-usuario" onClick={() => setIsModalOpen(true)}>Criar Novo Usuário</button>
            </div>
            <Footer />

            {isModalOpen && editingUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Editar Usuário</h2>
                        <div className="input-container">
                            <label htmlFor="editedMatricula">Matrícula:</label>
                            <input 
                                type="text" 
                                id="editedMatricula" 
                                value={editedMatricula}
                                onChange={(e) => setEditedMatricula(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="editedNomeCompleto">Nome Completo:</label>
                            <input 
                                type="text" 
                                id="editedNomeCompleto" 
                                value={editedNomeCompleto}
                                onChange={(e) => setEditedNomeCompleto(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="editedNomeUsuario">Nome de Usuário:</label>
                            <input 
                                type="text" 
                                id="editedNomeUsuario" 
                                value={editedNomeUsuario}
                                onChange={(e) => setEditedNomeUsuario(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="editedEmail">Email:</label>
                            <input 
                                type="email" 
                                id="editedEmail" 
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleSaveChanges}>Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
