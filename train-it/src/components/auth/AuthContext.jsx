import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el Contexto
export const AuthContext = createContext();

// Crea un Proveedor del Contexto que almacene el estado de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprueba la autenticación al cargar el proveedor
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Crea el hook de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}