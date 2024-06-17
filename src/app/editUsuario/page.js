'use client';
import React, { useState } from 'react'; // Importe useState do React
import Image from 'next/image';
import Sidebar from '/src/components/Sidebar';
import Footer from '/src/components/Footer';
import Input from '/src/components/Input'; // Importe o componente Input.js
import '/src/styles/editUsuario.css';

export default function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    return (
        <div className="config-page">
            <Sidebar />
            <div id="main-content">
                <h1 className="title">Configurações</h1>
                <div className="config-container">
                    {/* Seção de Foto de Perfil */}
                    <div className="config-box">
                        <h2 className="user-info-title">Foto de Perfil</h2>
                        <div className="profile-photo-section">
                            <div className="user-thumb">
                                <Image
                                    className="icon-jam-icons-outline-l"
                                    alt="User Icon"
                                    src="/icon/jam-icons/outline_and_logos/user.svg"
                                    width={96}
                                    height={96}
                                />
                            </div>
                            <div className="button-group">
                                <button className="insert-button">Inserir Foto</button>
                                <button className="remove-button">Remover</button>
                            </div>
                            <div className="image-requirements">
                                <div className="description-top">Requisitos da Imagem:</div>
                                <div className="description-top2">
                                    <ol className="min-400-x-400px-max-2mb">
                                        <li className="min-400">Min. 400 x 400px</li>
                                        <li>Max. 2MB</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Seção de Informações do Usuário */}
                    <div className="config-box">
                        <div className="user-info-title">Informações do Usuário</div>
                        <div className="form-5-fields-checkbox-b">
                            <div className="fields-group">
                                <div className="label-and-field">
                                    <label className="label">Nome Completo</label>
                                    <div className="field">
                                        <Input type="text" placeholder="Placeholder" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="fields-group">
                                <div className="label-and-field">
                                    <label className="label">Email</label>
                                    <div className="field">
                                        <Input type="email" placeholder="exemplo.queroquero@gmail.com" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="fields-group">
                                <div className="label-and-field">
                                    <label className="label">Senha</label>
                                    <div className="field1">
                                        <input
                                            className="text"
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder="********"
                                        />
                                        <button type="button" id="senha-botao" onClick={togglePasswordVisibility}>
                                            <Image
                                                className="icon-jam-icons-outline-l"
                                                alt={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
                                                src={passwordVisible ? "/images/eye-icon-green.png" : "/images/eye-icon.png"}
                                                width={24}
                                                height={24}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="botoes">
                            <button className="botao-sair">Sair da Sessão</button>
                            <button className="botao-salvar">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
