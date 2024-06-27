'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import '/src/styles/forgotPassword.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });;
    
            if (response.ok) {
                setMessage('Email enviado com sucesso!');
            } else {
                const errorData = await response.json();
                setMessage(errorData.detail || 'Erro ao enviar email.');
            }
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            setMessage('Erro ao enviar requisição.');
        }
    };

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Esqueceu a Senha</title>
            </Head>
            <div className="esqueceu-a-senha">
                <div className="page-content">
                    <div className="section-text">
                        <div className="top">
                            <b className="secondary-headline">Esqueceu sua senha?</b>
                        </div>
                        <div className="paragraph">Não há nada com que se preocupar, enviaremos uma mensagem para ajudá-lo a redefinir sua senha.</div>
                    </div>
                    <div className="form-2-fields-checkbox-b">
                        <form onSubmit={handleSubmit}>
                            <div className="text-field">
                                <div className="label-and-field">
                                    <label className="label-nome">
                                        Email do Usuário
                                        <input
                                            className="field"
                                            type="email"
                                            placeholder="Insira aqui seu Email!"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="button">
                                <div className="text-container">
                                    <div className="button-text">Enviar link</div>
                                </div>
                            </button>
                        </form>
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

