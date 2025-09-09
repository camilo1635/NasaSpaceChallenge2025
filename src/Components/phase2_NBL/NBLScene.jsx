// src/Components/phase2_NBL/NBLScene.jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { UnderwaterEnvironment } from './UnderwaterEnvironment'
import { FloatingPlayer } from './FloatingPlayer'
import { TrainingTasks } from './TrainingTasks'
import { TrainingHUD } from './UI/TrainingHUD'
import { ParticleSystem } from './ParticleSystem'
import { Player } from '../../Components/phase1_museum/Character/Player'
import { NBLPlayerControls } from './NBLPlayerControls'
export function NBLScene() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas 
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, shadowMap: true }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Iluminación subacuática mejorada */}
          <ambientLight intensity={0.6} color="#4da6ff" />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            color="#87ceeb"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Luces subacuáticas más brillantes */}
          <pointLight position={[0, 10, 0]} intensity={2} color="#00bfff" />
          <pointLight position={[-10, 5, -5]} intensity={1.2} color="#4169e1" />
          <pointLight position={[10, 5, -5]} intensity={1.2} color="#00ced1" />
          <pointLight position={[0, 2, 0]} intensity={1.5} color="#ffffff" />
          
          {/* Ambiente subacuático */}
          <UnderwaterEnvironment />
          
          {/* Sistema de partículas (burbujas) */}
          <ParticleSystem />
          
          {/* Tareas de entrenamiento */}
          <TrainingTasks />
          
          {/* Jugador con controles NBL */}
          <NBLPlayerControls>
            <Player />
          </NBLPlayerControls>
        </Suspense>
      </Canvas>
      
      {/* HUD de entrenamiento */}
      <TrainingHUD />
    </div>
  )
}