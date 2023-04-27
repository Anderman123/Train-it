import { Suspense, useState } from 'react'
import './App.css'
import { Canvas } from 'react-three-fiber'
import { Model } from './components/Modelo3D/humano'
import { OrbitControls } from '@react-three/drei'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>hola mundo</h1>
      <div style={{width: "100", height: "550px"}}>
        <Canvas camera={{zoom: 1, position:[0, 0, 35]}}>
          <ambientLight intensity={0.5}/>
          <pointLight position={[35, 35, 0]} intensity={ 0.4 }/>
          <pointLight position={[-35, 35, 0]} intensity={ 0.4 }/>
          <Suspense fallback={null}>
            <Model/>
          </Suspense>
          <OrbitControls/>
        </Canvas>
      </div>

    </>
  )
}

export default App
