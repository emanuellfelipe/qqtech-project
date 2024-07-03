'use client'
import { useState } from 'react';
import Image from 'next/image';
import '/src/styles/login.css';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setError(null); 
        
        window.location.href = '/home';
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erro ao realizar login');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
    }
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
                <input
                  className="text"
                  type="text"
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-field">
            <div className="label-and-field">
              <div className="label">Senha</div>
              <div className="field1">
                <input
                  className="text"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
                  className="icon-jam-icons-outline-l"
                  alt={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  src={passwordVisible ? '/images/eye-icon-green.png' : '/images/eye-icon.png'}
                  width={24}
                  height={24}
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
          </div>
          <div className="group">
            <div className="forgot-password" id="forgotPasswordText">
              <a href="/forgot">Esqueceu a Senha?</a>
            </div>
          </div>
          <div className="button" id="buttonContainer" onClick={handleLogin}>
            <div className="text-container">
              <div className="button-text">Login</div>
            </div>
          </div>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="sep2"></div>
      </div>
    </div>
  );
}
