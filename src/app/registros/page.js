'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
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
    const [editedMatricula, setEditedMatricula] = useState('');
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchPerfisDisponiveis();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            alert('Erro ao buscar usuários. Tente novamente.');
        }
    };

    const fetchPerfisDisponiveis = async () => {
        try {
            const response = await axios.get('/api/perfis');
    
            if (response.data.success && Array.isArray(response.data.data)) {
                const perfis = response.data.data.map(perfil => ({
                    value: perfil.id_perfil,
                    label: perfil.nome_perfil,
                }));
                setPerfisDisponiveis(perfis);
            } else {
                throw new Error("Formato de dados inesperado");
            }
        } catch (error) {
            console.error('Erro ao buscar perfis disponíveis:', error);
            alert('Erro ao buscar perfis disponíveis. Tente novamente.');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEditUser = async (id_usuario) => {
        try {
            const response = await axios.get(`/api/users?id_usuario=${id_usuario}`);
            const userToEdit = response.data;
    
            if (!userToEdit) {
                console.error(`Usuário com id ${id_usuario} não encontrado.`);
                return;
            }
    
            setEditingUser(userToEdit);
            setEditedNomeUsuario(userToEdit.nome_usuario);
            setEditedEmail(userToEdit.email);
            setEditedNomeCompleto(userToEdit.nome_completo);
            setEditedMatricula(userToEdit.matricula);
    
            // Verifique se o usuário tem perfis associados e configure o estado do perfil selecionado
            if (userToEdit.Perfis && userToEdit.Perfis.length > 0) {
                const perfilAssociado = userToEdit.Perfis[0];
                setSelectedPerfil({ value: perfilAssociado.id_perfil, label: perfilAssociado.nome_perfil });
            } else {
                setSelectedPerfil(null); // Caso não haja perfil associado, limpe a seleção
            }
    
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar dados para edição:', error);
            alert('Erro ao buscar dados para edição. Tente novamente.');
        }
    };
    
    

    const handleSaveChanges = async () => {
        try {
            const updatedUser = {
                id_usuario: editingUser.id_usuario,
                nome_usuario: editedNomeUsuario,
                email: editedEmail,
                nome_completo: editedNomeCompleto,
                matricula: editedMatricula,
                id_perfil: selectedPerfil ? selectedPerfil.value : null // Corrigido para id_perfil
            };
    
            const response = await axios.put(`/api/users?id_usuario=${updatedUser.id_usuario}`, updatedUser);
    
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

        if (window.confirm('Tem certeza de que deseja excluir este usuário?')) {
            try {
                await axios.delete(`/api/users?id_usuario=${id_usuario}`);
                setUsers(users.filter(user => user.id_usuario !== id_usuario));
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário. Tente novamente.');
            }
        }
    };

 const handleDownloadReport = async () => {
        try {
            // Substitua "http://localhost:5000" pelo endereço do seu servidor FastAPI
            const response = await fetch(`http://localhost:5000/download/usuario`);
            if (!response.ok) {
                throw new Error('Erro ao baixar o relatório');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // O nome do arquivo pode ser dinâmico baseado no nome da tabela
            a.download = 'Usuários.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Relatório baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
            alert('Erro ao baixar o relatório. Tente novamente.');
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
                <div id="button-container">
                    <button id="baixar-relatorio" onClick={handleDownloadReport}>Baixar Relatório</button>
                    <button id="criar-usuario" onClick={() => window.location.href = '/novoRegistro'}>Criar Novo Usuário</button>
                </div>
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
                        <div className="input-container">
                            <label htmlFor="editedPerfil">Perfil:</label>
                            <Select
    id="editedPerfil"
    value={selectedPerfil} // Aqui é onde o perfil selecionado será exibido
    onChange={(selectedOption) => setSelectedPerfil(selectedOption)}
    options={perfisDisponiveis}
    isMulti={false}
    isClearable
/>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleSaveChanges}>Salvar Alterações</button>
                            
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
