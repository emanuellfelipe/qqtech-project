'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import '/src/styles/forgotConfirm.css';

export default function ForgotConfirmPage() {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    // Exemplo de como você poderia recuperar o email do localStorage
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get('email');
        if (userEmail) {
            setEmail(userEmail);
        }
    }, []);

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("As senhas não coincidem.");
            return;
        }

        const response = await fetch('http://localhost:5000/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, // Passa o email junto com o código e a nova senha
                code,
                newPassword
            })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Senha redefinida com sucesso.");
            // Redireciona para a página de login após a redefinição da senha
            window.location.href = '/login';
        } else {
            setMessage(data.detail || "Erro ao redefinir senha.");
        }
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Redefinir Senha</title>
            </Head>
            <div className="redefinir-senha">
                <div className="page-content">
                    <div className="section-text">
                        <div className="top">
                            <b className="secondary-headline">Redefinir Senha</b>
                        </div>
                        <div className="paragraph">Por favor, insira o código enviado por e-mail e a nova senha.</div>
                    </div>
                    <div className="form-2-fields-checkbox-b">
                        <div className="label-and-field">
                            <label htmlFor="code" className="label">Código de Verificação</label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="field"
                                required
                            />
                        </div>
                        <div className="label-and-field">
                            <label htmlFor="newPassword" className="label">Nova senha</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="field"
                                required
                            />
                        </div>
                        <div className="label-and-field">
                            <label htmlFor="confirmPassword" className="label">Confirmar nova senha</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="field"
                                required
                            />
                        </div>
                        <button className="button" onClick={handleResetPassword}>
                            <div className="text-container">
                                <div className="button-text">Redefinir Senha</div>
                            </div>
                        </button>
                        {message && <div className="message">{message}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
