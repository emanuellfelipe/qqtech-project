'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import '/src/styles/usuarios.css';
import Footer from '/src/components/Footer';
import Sidebar from '/src/components/Sidebar';
import Select from 'react-select';

export default function UsuariosAdminPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUsuario, setNewUsuario] = useState({ matricula: '', nome_usuario: '', email: '', nome_completo: '', perfil: null });
    const [perfis, setPerfis] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const [usuariosComPerfil, setUsuariosComPerfil] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUsuarioId, setEditingUsuarioId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                const data = await response.json();
                const usuariosData = data.data || [];
                const usuariosComPerfilData = await Promise.all(usuariosData.map(async (usuario) => {
                    const nomePerfil = await fetchPerfilUsuario(usuario.id_usuario);
                    return { ...usuario, nome_perfil: nomePerfil };
                }));

                setUsuariosComPerfil(usuariosComPerfilData);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                setError(error);
                setIsLoading(false);
            }
        };

        const fetchPerfis = async () => {
            try {
                const response = await fetch('/api/perfis');
                if (!response.ok) {
                    throw new Error('Erro ao buscar perfis');
                }
                const data = await response.json();
                setPerfis(data.data || []);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        };

        fetchUsuarios();
        fetchPerfis();
    }, []);

    const fetchPerfilUsuario = async (idUsuario) => {
        try {
            const response = await fetch(`/api/perfilUsuario?id_usuario=${idUsuario}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar perfil do usuário');
            }
            const data = await response.json();
            return data.nome_perfil;
        } catch (error) {
            console.error('Erro ao buscar perfil do usuário:', error);
            return '-';
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateOrEditUsuario = async () => {
        const url = isEditing ? `/api/users?id_usuario=${editingUsuarioId}` : '/api/users';
        const method = isEditing ? 'PUT' : 'POST';
      
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newUsuario, perfil: selectedPerfil ? selectedPerfil.value : null }),
            });
      
            if (!response.ok) {
                throw new Error(isEditing ? 'Erro ao editar usuário' : 'Erro ao criar usuário');
            }
      
            const data = await response.json();
            const usuarioAtualizado = data.data;
      
            if (isEditing) {
                setUsuarios(usuarios.map(usuario => (usuario.id_usuario === editingUsuarioId ? usuarioAtualizado : usuario)));
            } else {
                setUsuarios([...usuarios, usuarioAtualizado]);
            }
      
            setIsModalOpen(false);
            setNewUsuario({ matricula: '', nome_usuario: '', email: '', nome_completo: '', perfil: null });
            setSelectedPerfil(null);
            setIsEditing(false);
            setEditingUsuarioId(null);
            alert(isEditing ? 'Usuário editado com sucesso!' : 'Usuário criado com sucesso!');
        } catch (error) {
            console.error(isEditing ? 'Erro ao editar usuário:' : 'Erro ao criar usuário:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario({ ...newUsuario, [name]: value });
    };

    const handleEditUsuario = (usuario) => {
        setNewUsuario({
            matricula: usuario.matricula,
            nome_usuario: usuario.nome_usuario,
            email: usuario.email,
            nome_completo: usuario.nome_completo,
            perfil: usuario.Perfis && usuario.Perfis.length > 0 ? usuario.Perfis[0].id_perfil : null
        });
        setSelectedPerfil(usuario.Perfis && usuario.Perfis.length > 0 ? { value: usuario.Perfis[0].id_perfil, label: usuario.Perfis[0].nome_perfil } : null);
        setIsEditing(true);
        setEditingUsuarioId(usuario.id_usuario);
        setIsModalOpen(true);
    };

    const handleChangeSelect = (selectedOption) => {
        setSelectedPerfil(selectedOption);
        setNewUsuario({ ...newUsuario, perfil: selectedOption ? selectedOption.value : null });
    };

    const handleDeleteUsuario = async (id_usuario) => {
        if (confirm('Tem certeza de que deseja excluir este usuário?')) {
            try {
                await fetch(`/api/users?id_usuario=${id_usuario}`, {
                    method: 'DELETE'
                });
                setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id_usuario));
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário. Tente novamente.');
            }
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch(`http://localhost:5000/download/usuario`);
            if (!response.ok) {
                throw new Error('Erro ao baixar o relatório');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'usuario.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Relatório baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
            alert('Erro ao baixar o relatório. Tente novamente.');
        }
    };

    const filteredUsuarios = usuariosComPerfil.filter(usuario =>
        usuario &&
        ((usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.nome_completo && usuario.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.nome_usuario && usuario.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const options = perfis.map(perfil => ({
        value: perfil.id_perfil,
        label: perfil.nome_perfil,
    }));

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar dados: {error.message}</div>;
    }

    const handleNewUsuario = () => {
        window.location.href = '/novoRegistro'; 
    };

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
                <div id="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome Completo</th>
                                <th>Matrícula</th>
                                <th>Perfil</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((usuario) => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.nome_completo}</td>
                                    <td>{usuario.matricula}</td>
                                    <td>{usuario.nome_perfil || '-'}</td>
                                    <td>
                                        <button className="action-button" onClick={() => handleEditUsuario(usuario)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button" onClick={() => handleDeleteUsuario(usuario.id_usuario)}>
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
                    <button id="criar-usuario" onClick={handleNewUsuario}>Criar Novo Usuário</button>
                </div>
            </div>
            {isModalOpen && (
                <div id="modal" className="modal">
                    <div id="modal-content" className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>{isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2>
                        <form id="form-usuario">
                            <label>Nome Completo:</label>
                            <input
                                type="text"
                                name="nome_completo"
                                value={newUsuario.nome_completo}
                                onChange={handleInputChange}
                            />
                            <label>Nome de Usuário:</label>
                            <input
                                type="text"
                                name="nome_usuario"
                                value={newUsuario.nome_usuario}
                                onChange={handleInputChange}
                            />
                            <label>Matrícula:</label>
                            <input
                                type="text"
                                name="matricula"
                                value={newUsuario.matricula}
                                onChange={handleInputChange}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={newUsuario.email}
                                onChange={handleInputChange}
                            />
                            <label>Perfil:</label>
                            <Select
                                options={options}
                                value={selectedPerfil}
                                onChange={handleChangeSelect}
                                placeholder="Selecione o perfil..."
                            />
                            <div className='modal-footer'>
                                <button type="button" onClick={handleCreateOrEditUsuario}>
                                    {isEditing ? 'Editar Usuário' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}
