import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Limpiar el mensaje anterior

    if (!name || !email || !password) {
      setMessage('Por favor, completa todos los campos.');
      setMessageColor('red');
      return;
    }

    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      setMessageColor('red');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setMessage('Registro exitoso');
        setMessageColor('green');
      } else {
        // Aquí asumiremos que el servidor nos proporciona un mensaje de error adecuado
        setMessage('Error en el registro: ' + response.data.message);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Hubo un error al registrarse', error);
      setMessage('Hubo un error al registrarse');
      setMessageColor('red');
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input className="login-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <br/>
          <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <input className="register-submit" type="submit" value="Registrarse" />
      </form>
      <p className="login-message" style={{ color: messageColor }}>{message}</p>
    </>
  );
}

export default Register;