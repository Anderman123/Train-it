import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './Header.css'
import Logo from './../../../public/Img/TrainIT-Logo.png'
// import Register from './../auth/Register'; // replace './Register' with the correct path
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <img  className="logo" src={Logo}/>
      <div className="links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </header>
  )
}
