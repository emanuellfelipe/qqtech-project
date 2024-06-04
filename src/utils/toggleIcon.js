// src/utils/toggleIcon.js
export const toggleIcon = () => {
  const eyeIcon = document.getElementById('eye-icon');
  const senhaInput = document.getElementById('senha');

  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    eyeIcon.src = '/images/eye-icon-green.png'; // Altera o caminho para a imagem verde
  } else {
    senhaInput.type = 'password';
    eyeIcon.src = '/images/eye-icon.png'; // Altera o caminho para a imagem cinza
  }
};
