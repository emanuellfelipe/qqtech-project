export const toggleIcon = () => {
  const eyeIcon = document.getElementById('eye-icon');
  const senhaInput = document.getElementById('senha');

  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    eyeIcon.src = '/images/eye-icon-green.png'; 
  } else {
    senhaInput.type = 'password';
    eyeIcon.src = '/images/eye-icon.png'; 
  }
};
