"use client";
import Image from 'next/image';
import "/src/styles/homeAdmin.css";

export default function HomeAdminPage() {

  const redirectToPage = (page) => {
    window.location.href = page;
  };

  return (
    <>
      <header>
        <div className="logo">
          <Image src="/images/logo.png" alt="Logo" width={181} height={39} />
        </div>
        <nav>
          <ul>
            <li className="menu"><button onClick={() => redirectToPage('/perfis')}>Perfis</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/registros')}>Usuários</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/modulos')}>Módulos</button></li>
          </ul>
        </nav>
        <div id="icons">
          <Image className="icon-profile" src="/images/menu-icon.png" alt="Menu Icon" width={32} height={32} />
          <Image className="icon-settings" src="/images/settings-icon.png" alt="Settings Icon" width={24} height={24} />
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
        <p>Lojas Quero Quero @ 2024. Todos os Direitos Reservados</p>
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
