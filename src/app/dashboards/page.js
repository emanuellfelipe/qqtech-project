"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import "/src/styles/dashboardPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Quantidade de Elementos',
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#E7E9ED',
          '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#E7E9ED',
          '#4BC0C0'
        ]
      }
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/chart-data');
        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              label: 'Quantidade de Elementos',
              data: response.data.values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#E7E9ED',
                '#4BC0C0'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#E7E9ED',
                '#4BC0C0'
              ]
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const redirectToPage = (page) => {
    window.location.href = page;
  };

  const handleDownload = async (option) => {
    try {
      const response = await fetch(`http://localhost:5000/download/${option}`);
      if (!response.ok) {
        throw new Error(`Erro ao baixar ${option}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${option}.xlsx`; 
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert(`${option} baixado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao baixar ${option}:`, error);
      alert(`Erro ao baixar ${option}. Tente novamente.`);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          <Image src="/images/logo.png" alt="Logo" width={181} height={39} />
        </div>
        <nav>
          <ul>
            <li className="menu"><button onClick={() => redirectToPage('/home')}>Home</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/perfis')}>Perfis</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/registros')}>Usuários</button></li>
            <li className="menu"><button onClick={() => redirectToPage('/modulos')}>Módulos</button></li>
          </ul>
        </nav>
        <div id="icons">
          <FiLogOut className="menu-icon" size={18} onClick={handleLogout} />
        </div>
      </header>

      <main>
        <div className="dashboard-container">
          <h1>Dados Gerais do Sistema</h1>
          <div className='chart-container'>
            <Doughnut data={chartData} />
          </div>
          <div className="download-buttons">
            <label htmlFor="download-options">Selecione um relatório:</label>
            <select id="download-options">
              <option value="modulos">Módulos</option>
              <option value="funcoes">Funções</option>
              <option value="transacoes">Transações</option>
              <option value="usuario">Usuário</option>
              <option value="perfil">Perfil</option>
            </select>
            <button onClick={() => handleDownload(document.getElementById('download-options').value)}>Baixar Relatório</button>
          </div>
        </div>
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


