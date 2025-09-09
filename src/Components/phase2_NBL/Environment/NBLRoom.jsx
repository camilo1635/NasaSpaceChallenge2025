// src/Components/phase2_nbl/NBLScene.jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text, Sparkles, Caustics } from '@react-three/drei'
import * as THREE from 'three'

import { Player } from '../phase1_museum/Character/Player'
import { PlayerControls } from '../phase1_museum/Character/PlayerControls'

export function NBLScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 20], fov: 60 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={['#002233']} /> {/* Agua oscura estilo piscina */}

      {/* 💡 Iluminación artificial (luces del techo del NBL) */}
      <ambientLight intensity={0.6} color={'#88bbff'} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        color={'#aaddff'}
        castShadow
      />

      {/* ✨ Burbujas */}
      <Sparkles count={150} scale={[25, 10, 25]} size={2.5} speed={0.4} color="#bbf" />

      {/* 🌊 Suelo del tanque */}
      <Caustics
        backfaces
        color="skyblue"
        lightSource={[0, 20, 0]}
        worldRadius={0.2}
        ior={1.1}
        intensity={0.08}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#003355" />
        </mesh>
      </Caustics>

      {/* 🧱 Paredes de la piscina */}
      <mesh position={[0, 5, -25]} receiveShadow>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#002244" />
      </mesh>
      <mesh position={[0, 5, 25]} receiveShadow>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#002244" />
      </mesh>
      <mesh position={[-25, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial color="#002244" />
      </mesh>
      <mesh position={[25, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <meshStandardMaterial color="#002244" />
      </mesh>

      {/* 🔩 Estructuras metálicas dentro de la piscina (simulando módulos ISS) */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-10, 2, -5]} castShadow>
        <cylinderGeometry args={[2, 2, 6, 32]} />
        <meshStandardMaterial color="#999" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[8, 2, 10]} castShadow>
        <boxGeometry args={[6, 3, 3]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 👨‍🚀 Player con controles */}
      <Suspense fallback={null}>
        <PlayerControls>
          <Player />
        </PlayerControls>
      </Suspense>

      {/* Texto flotante dentro del agua */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text
          position={[0, 7, -10]}
          fontSize={1}
          color="#88e"
          anchorX="center"
          anchorY="middle"
        >
          Neutral Buoyancy Lab
        </Text>
      </Float>

      {/* 👀 Cámara libre para explorar */}
      <OrbitControls enablePan={false} maxDistance={40} minDistance={5} />
    </Canvas>
  )
}
