import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Limpiar el mensaje anterior

    if (!email || !password) {
      setMessage('Por favor, completa todos los campos.');
      setMessageColor('red');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      if (response.data.success) {
        setMessage('Inicio de sesión exitoso');
        setMessageColor('green');
        // Aquí puedes hacer algo con los datos del usuario,
        // como guardarlos en el estado de la aplicación o en el almacenamiento local.
      } else {
        // Aquí asumiremos que el servidor nos proporciona un mensaje de error adecuado
        setMessage('Error en el inicio de sesión: ' + response.data.message);
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
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <input type="submit" value="Iniciar sesión" />
      </form>
      <p style={{ color: messageColor }}>{message}</p>
    </>
  );
}

export default Login;