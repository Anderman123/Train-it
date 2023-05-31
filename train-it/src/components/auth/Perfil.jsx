import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

const Perfil = () => {
  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario
  const [usuario, setUsuario] = useState(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/usuario/${userId}`);
        setUsuario(response.data.data);
      } catch (error) {
        console.error('Hubo un error al obtener los datos del usuario', error);
      }
    };

    fetchUsuario();
  }, [userId]);

  const handleBorrarCuenta = async () => {
    try {
      setConfirmarBorrado(true);
    } catch (error) {
      console.error('Hubo un error al borrar la cuenta del usuario', error);
    }
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/usuario/${userId}`);
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
        localStorage.removeItem('authToken');
        window.location.href = '/'; // Redirige a la página de inicio
      }, 1500);
    } catch (error) {
      console.error('Hubo un error al borrar la cuenta del usuario', error);
    }
  };

  const cancelarEliminacion = () => {
    setConfirmarBorrado(false);
  };

  if (!usuario) {
    return <div>Cargando información del usuario...</div>
  }

  return (
    <div>
      <h2>Perfil de {usuario.name}</h2>
      <p>Email: {usuario.email}</p>

      {!confirmarBorrado ? (
        <button onClick={handleBorrarCuenta} style={{color: 'white', backgroundColor: 'red'}}>Borrar cuenta</button>
      ) : (
        <>
          <p>¿Estás seguro que quieres borrar tu cuenta?</p>
          <button onClick={confirmarEliminacion}>Sí</button>
          <button onClick={cancelarEliminacion}>No</button>
        </>
      )}
      {mostrarMensaje && <p>El usuario ha sido eliminado</p>}
    </div>
  );
};

export default Perfil;
