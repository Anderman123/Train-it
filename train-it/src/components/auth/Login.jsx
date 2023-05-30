import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';  // Importa el Hook de autenticación

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const navigate = useNavigate();  // Obtén el objeto "navigate" para poder redirigir al usuario
  const { setIsAuthenticated } = useAuth(); // Usa el Hook de autenticación

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Limpiar el mensaje anterior

    if (!email || !password) {
      setMessage('Por favor, completa todos los campos.');
      setMessageColor('red');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });

      if (response.data.success) {
        setMessage('Inicio de sesión exitoso');
        setMessageColor('green');

        // Guarda el token de autenticación en el almacenamiento local
        localStorage.setItem('authToken', response.data.authToken);
        localStorage.setItem('userId', response.data.user.id);

        // Actualiza el estado de autenticación
        setIsAuthenticated(true);

        // Redirige al usuario a la página principal
        navigate('/');

        window.location.reload();
      } else {
        setMessage(`Error en el inicio de sesión: ${response.data.message}`);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Hubo un error al iniciar sesión', error);
      setMessage('Hubo un error al iniciar sesión');
      setMessageColor('red');
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <br/>
          <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <input className="login-submit" type="submit" value="Iniciar sesión" />
      </form>
      <p className="login-message" style={{ color: messageColor }}>{message}</p>
    </>
  );
}

export default Login;