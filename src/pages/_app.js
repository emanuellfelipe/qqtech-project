// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '/src/styles/login.css'; // Certifique-se de que o arquivo CSS personalizado seja importado

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
