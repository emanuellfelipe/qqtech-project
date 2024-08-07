"use client";
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import "/src/styles/homeAdmin.css";

export default function HomeAdminPage() {

  const redirectToPage = (page) => {
    window.location.href = page;
  };
  const handleLogout = () => {
    window.location.href = '/login';
};

  return (
    <>
      <header>
        <div className="logo">
          <Image src="/images/logo.png" alt="Logo" width={181} height={39} />
        </div>
        <nav>
          <ul>
            <li className="menu"><button onClick={() => redirectToPage('/dashboards')}>Dashboards</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/perfis')}>Perfis</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/registros')}>Usuários</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/modulos')}>Módulos</button></li>
          </ul>
        </nav>
        <div className="mobile-dropdown">
          <input type="checkbox" id="dropdownCheckbox" className="dropdown-checkbox" />
          <label htmlFor="dropdownCheckbox" className="dropdown-toggle">Menu</label>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li onClick={() => redirectToPage('/dashboards')}>Dashboards</li>
            <li onClick={() => redirectToPage('/modulos')}>Módulos</li>
            <li onClick={() => redirectToPage('/perfis')}>Perfis</li>
            <li onClick={() => redirectToPage('/usuarios')}>Usuários</li>
          </ul>
        </div>
        <div id="icons">
          <FiLogOut className="menu-icon" size={18} onClick={handleLogout} />
        </div>
      </header>

      <main>
        <h5 className="titulo-desc">QUERO QUERO SYSTEM</h5>
        <h1 className="titulo">Seja Bem Vindo, Administrador!<br />O que você vai realizar hoje?!</h1>
        <section className="options">
          <div className="option">
            <Image src="/images/usuario-logo.png" alt="Usuários" width={154} height={110} />
            <h2>Editar e Criar Usuários</h2>
            <p>Crie novos usuários ou edite existentes</p>
            <button onClick={() => redirectToPage('/registros')} className="button-link">Ir Para <Image src="/images/arrow-white.png" className="icon" alt="Arrow Icon" width={20} height={20} /></button>
          </div>
          <div className="option">
            <Image src="/images/modulos-main.png" alt="Módulos" width={154} height={110} />
            <h2>Criar e Editar Módulos</h2>
            <p>Crie funções, módulos e transações</p>
            <button onClick={() => redirectToPage('/modulos')} className="button-link">Ir Para <Image src="/images/arrow-white.png" className="icon" alt="Arrow Icon" width={20} height={20} /></button>
          </div>
          <div className="option">
            <Image src="/images/perfis-main.png" alt="Perfis" width={154} height={110} />
            <h2>Criar e Editar <span className="block">Perfis</span></h2>
            <p>Crie novos perfis ou edite existentes</p>
            <button onClick={() => redirectToPage('/perfis')} className="button-link">Ir Para <Image src="/images/arrow-white.png" className="icon" alt="Arrow Icon" width={20} height={20} /></button>
          </div>
        </section>
      </main>

      <footer>
        <p>Lojas Quero Quero @ 2024</p>
        <div id="social-icons">
          <Image src="/images/facebook-icon.png" alt="Facebook" width={20} height={20} />
          <Image src="/images/twitter-icon.png" alt="Twitter" width={20} height={20} />
          <Image src="/images/instagram-icon.png" alt="Instagram" width={20} height={20} />
          <Image src="/images/linkedin-icon.png" alt="LinkedIn" width={20} height={20} />
          <Image src="/images/youtube-icon.png" alt="YouTube" width={20} height={20} />
        </div>
      </footer>
    </>
  );
}
