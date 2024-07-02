import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import "/src/styles/sidebar.css"; // Certifique-se de que o caminho esteja correto

export default function Sidebar() {
    const [currentRoute, setCurrentRoute] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setCurrentRoute(window.location.pathname);
    }, []);

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isModuleActive = currentRoute === '/modulos' || currentRoute === '/transacoes' || currentRoute === '/funcoes';

    const handleLogout = () => {
        window.location.href = '/login';
    };

    return (
        <div className="sidebar">
            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                <FaBars size={24} />
            </button>
            <div id="menu-lateral" className={isMobileMenuOpen ? 'open' : ''}>
                <div id="logo-container">
                    <Image src="/images/logo.png" id="logo" alt="Logo" width={181} height={39} />
                </div>
                <div className="menu-icons">
                    <Image src="/images/menu-icon.png" className="menu-icon" alt="Menu Icon" width={20} height={20} />
                    <FiLogOut className="menu-icon" size={18} onClick={handleLogout} />
                </div>
                <button
                    className={`botao-menu ${currentRoute === '/home' ? 'active' : ''}`}
                    onClick={() => handleNavigation('/home')}
                >
                    <Image src="/images/home-icon.png" alt="Home" width={20} height={20} /> Home
                </button>
                <button
                    className={`botao-menu ${isModuleActive ? 'active' : ''}`}
                    onClick={() => handleNavigation('/modulos')}
                >
                    <Image src="/images/modules-icon.png" alt="Modules" width={20} height={20} /> Módulos
                </button>
                <button
                    className={`botao-menu ${currentRoute === '/registros' ? 'active' : ''}`}
                    onClick={() => handleNavigation('/registros')}
                >
                    <Image src="/images/profiles-icon.png" alt="Users" width={20} height={20} /> Usuários
                </button>
                <button
                    className={`botao-menu ${currentRoute === '/perfis' ? 'active' : ''}`}
                    onClick={() => handleNavigation('/perfis')}
                >
                    <Image src="/images/perfis-icon.png" alt="Profiles" width={20} height={20} /> Perfis
                </button>
            </div>
        </div>
    );
}
