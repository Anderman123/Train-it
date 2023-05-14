import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css'
import Header from './components/Header/Header';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Model } from './components/Modelo3D/humano';

const CameraController = () => {
  const { camera } = useThree();

  // Esto se ejecutará en cada cuadro de la animación
  useFrame((state, delta) => {
    camera.position.x += delta * 2; // Ajusta esto según necesites
  });

  return null;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Agregar aquí más rutas si es necesario */}
        <Route path="/" element={
          <div style={{ width: '100', height: '650px' }}>
            <Canvas camera={{ zoom: 0.9, position: [0, 10, 55] }}>
              <OrbitControls minDistance={10} maxDistance={50} />
              <ambientLight intensity={0.5} />
              <pointLight position={[35, 35, 0]} intensity={0.4} />
              <pointLight position={[-35, 35, 0]} intensity={0.4} />
              <CameraController />
              <Suspense fallback={null}>
                <Model />
              </Suspense>
              <OrbitControls />
            </Canvas>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;






