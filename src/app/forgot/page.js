'use client';
import React from 'react';
import Head from 'next/head';
import '/src/styles/forgotPassword.css'; // Certifique-se de que o caminho esteja correto

export default function ForgotPasswordPage() {
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
                        <div className="text-field">
                            <div className="label-and-field">
                                <label className="label-nome">
                                    Email do Usuário
                                    <input className="field" type="email" placeholder="Insira aqui seu Email!" />
                                </label>
                            </div>
                        </div>
                        <button className="button">
                            <div className="text-container">
                                <div className="button-text">Enviar link</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
