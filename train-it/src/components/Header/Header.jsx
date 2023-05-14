import React from 'react'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Header.css'
import Logo from './../../../public/Img/TrainIT-Logo.png'
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate(); // Añade esto
  const authToken = localStorage.getItem('authToken'); // Verificamos si el usuario está autenticado

  const logout = () => {
    localStorage.removeItem('authToken'); // Al hacer logout, eliminamos el token
    navigate('/'); // Redirigimos al usuario a la ruta '/'
    window.location.reload(); // Recargamos la página
  }

  return (
    <header>
      <img  className="logo" src={Logo}/>
      <div className="links">
        {authToken ? (
          // Si el usuario está autenticado, mostramos el enlace de Logout
          <button onClick={logout}>Logout</button>
        ) : (
          // Si el usuario no está autenticado, mostramos los enlaces de Login y Register
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}