'use client';
import { useState } from 'react';
import Image from 'next/image';
import '/src/styles/login.css'; // Importação do estilo

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="login">
      <div className="page-content">
        <Image
          className="queroquerologo-icon"
          alt="QueroQuero Logo"
          src="/images/QueroQueroLogo.png"
          id="queroQueroLogoImage"
          width={578}
          height={113}
        />

        <div className="sep"></div>
        <div className="sep"></div>

        <div className="section-text">
          <div className="top">
            <b className="secondary-headline">Seja bem Vindo</b>
          </div>
          <div className="paragraph">Por favor faça seu login para acessar</div>
        </div>

        <div className="form-2-fields-checkbox-b">
          <div className="text-field">
            <div className="label-and-field">
              <div className="label">Usuário</div>
              <div className="field">
                <input className="text" type="email" placeholder="exemplo.queroquero@gmail.com" />
              </div>
            </div>
          </div>
          <div className="text-field">
            <div className="label-and-field">
              <div className="label">Senha</div>
              <div className="field1">
                <input className="text" type={passwordVisible ? "text" : "password"} placeholder="********" />
                <Image
                  className="icon-jam-icons-outline-l"
                  alt={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
                  src={passwordVisible ? "/images/eye-icon-green.png" : "/images/eye-icon.png"}
                  width={24}
                  height={24}
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
          </div>
          <div className="group">
            <div className="controls-with-label">
              <div className="controls">
                <input type="checkbox" id="rememberMe" />
              </div>
              <div className="label-name">Lembre de mim</div>
            </div>
            <div className="forgot-password" id="forgotPasswordText">
              Esqueceu a Senha?
            </div>
          </div>
          <div className="button" id="buttonContainer">
            <div className="text-container">
              <div className="button-text">Login</div>
            </div>
          </div>
        </div>

        <div className="sep2"></div>
      </div>
    </div>
  );
}
