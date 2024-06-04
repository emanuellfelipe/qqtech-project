"use client";
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import "/src/styles/login.css";
import { toggleIcon } from '/src/utils/toggleIcon'; // Importa a função toggleIcon

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
    toggleIcon(); // Chama a função toggleIcon ao clicar no botão
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login">
        <div className="page-content">
          <div className="queroquerologo-icon">
            <Image
              src="/images/QueroQueroLogo.png"
              alt=""
              width={578}
              height={113}
            />
          </div>
          <div className="sep"></div>
          <div className="sep"></div>
          <div className="section-text">
            <div className="top">
              <b className="secondary-headline">Seja bem Vindo</b>
            </div>
            <div className="paragraph">Por favor faça seu login para acessar</div>
          </div>
          <div className="formulario">
            <form>
              <div className="label-and-field">
                <label htmlFor="nome-usuario" className="label-nome">Nome de Usuário</label>
                <input type="text" id="nome-usuario" placeholder="Nome de Usuário" required />
              </div>
              <div className="label-and-field" id="campo-senha">
                <label htmlFor="senha" className="label-nome">Insira sua Senha</label>
                <div id="senha-div">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="senha"
                    placeholder="********"
                    required
                    autoComplete="off"
                  />
                  <button type="button" id="senha-botao" onClick={togglePasswordVisibility}>
                    <Image
                      src="/images/eye-icon.png"
                      alt="Ícone de olho"
                      width={20}
                      height={20}
                      id="eye-icon" // Adiciona um id ao ícone para ser referenciado na função toggleIcon
                    />
                  </button>
                </div>
              </div>
              <div className="group">
                <div className="controls-with-label">
                  <input type="checkbox" id="lembrar-me" name="lembrar-me" />
                  <label htmlFor="lembrar-me" className="label-nome">Lembre de mim</label>
                </div>
                <div className="esqueceu-senha">Esqueceu a Senha?</div>
              </div>
              <div className="button">
                <div className="text-container">
                  <div className="button-text">Login</div>
                </div>
              </div>
            </form>
          </div>
          <div className="sep2"></div>
        </div>
      </div>
    </>
  );
}
