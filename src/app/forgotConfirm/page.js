'use client';
import React from 'react';
import Head from 'next/head';
import '/src/styles/forgotConfirm.css'; 

export default function ForgotConfirmPage() {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Link Enviado!</title>
            </Head>
            <div className="esqueceu-a-senha">
                <div className="page-content">
                    <div className="section-text">
                        <div className="top">
                            <b className="secondary-headline">Link enviado!</b>
                        </div>
                        <div className="paragraph">Email enviado com sucesso, por favor, siga as instruções enviadas.</div>
                    </div>
                    <div className="form-2-fields-checkbox-b">
                        <button className="button" onClick={() => window.location.href='/login'}>
                            <div className="text-container">
                                <div className="button-text">Autenticar novamente</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
