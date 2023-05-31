import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = () => {
  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario
  const [usuario, setUsuario] = useState(null);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/usuario/${userId}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Hubo un error al obtener los datos del usuario', error);
      }
    };

    fetchUsuario();
  }, [userId]);

  const handleBorrarCuenta = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/usuario/${userId}`);
      // Aquí deberías hacer el logout del usuario y redirigir a la página de inicio
    } catch (error) {
      console.error('Hubo un error al borrar la cuenta del usuario', error);
    }
  };

  const toggleShowPassword = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  if (!usuario) {
    return <div>Cargando información del usuario...</div>
  }

  return (
    <div>
      <h2>Perfil de {usuario.name}</h2>
      <p>Email: {usuario.email}</p>
      <p>Contraseña: 
        <input type={mostrarContraseña ? 'text' : 'password'} value={usuario.password} readOnly />
        <button onClick={toggleShowPassword}>
          {mostrarContraseña ? 'Ocultar' : 'Mostrar'}
        </button>
      </p>
      <button onClick={handleBorrarCuenta} style={{color: 'white', backgroundColor: 'red'}}>Borrar cuenta</button>
    </div>
  );
};

export default Perfil;
