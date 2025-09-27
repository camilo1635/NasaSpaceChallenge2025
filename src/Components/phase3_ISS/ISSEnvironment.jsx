// src/Components/phase3_ISS/ISSEnvironment.jsx
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

export function ISSEnvironment() {
  const earthRef = useRef()
  const cloudsRef = useRef()
  const issModelRef = useRef()
  
  // Cargar el modelo GLB de la ISS
  const { scene: issModel } = useGLTF('/models/iss_model.glb', true)
  
  // Cargar texturas de la Tierra
  const earthTexture = useLoader(TextureLoader, '/textures/earth_day.jpg', 
    undefined, 
    (error) => console.warn('Textura earth_day.jpg no encontrada, usando fallback', error)
  )
  const cloudsTexture = useLoader(TextureLoader, '/textures/earth_clouds.jpg',
    undefined,
    (error) => console.warn('Textura earth_clouds.jpg no encontrada, usando fallback', error)
  )
  const normalTexture = useLoader(TextureLoader, '/textures/earth_normal.jpg',
    undefined,
    (error) => console.warn('Textura earth_normal.jpg no encontrada, usando fallback', error)
  )

  // Animación de rotación de la Tierra
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.02
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003
    }
    
    // Rotación sutil de la ISS para simular el movimiento orbital
    if (issModelRef.current) {
      issModelRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      {/* ==== MODELO 3D DE LA ISS ==== */}
      <group ref={issModelRef} position={[0, 0, 0]} scale={[10, 10, 10]}>
        <primitive 
          object={issModel.clone()} 
          castShadow 
          receiveShadow
        />
        
        {/* Luces interiores adicionales para iluminar el modelo */}
        <pointLight position={[0, 2, 0]} intensity={1.0} color="#ffffff" distance={15} />
        <pointLight position={[5, 1, 0]} intensity={0.8} color="#f0f8ff" distance={10} />
        <pointLight position={[-5, 1, 0]} intensity={0.8} color="#f0f8ff" distance={10} />
        <pointLight position={[0, 1, 5]} intensity={0.6} color="#fff8f0" distance={8} />
        <pointLight position={[0, 1, -5]} intensity={0.6} color="#fff8f0" distance={8} />
        
        {/* Luz específica para la cúpula */}
        <pointLight position={[0, 6, 0]} intensity={0.8} color="#ffffff" distance={8} />
      </group>

      {/* ==== TIERRA VISIBLE DESDE LA ISS ==== */}
      <group position={[0, -95, -10]} rotation={[0.2, 0, 0.05]}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[80, 64, 32]} />
          <meshStandardMaterial 
            map={earthTexture}
            normalMap={normalTexture}
            color={earthTexture ? "#ffffff" : "#4169e1"}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        <mesh ref={cloudsRef}>
          <sphereGeometry args={[15.2, 64, 32]} />
          <meshStandardMaterial 
            map={cloudsTexture}
            transparent
            opacity={cloudsTexture ? 0.3 : 0.7}
            color={cloudsTexture ? "#ffffff" : "#ffffff"}
            alphaTest={0.1}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[15.5, 32, 16]} />
          <meshStandardMaterial 
            color="#87ceeb"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Continentes fallback si no hay textura */}
        {!earthTexture && (
          <>
            <mesh position={[-4, 3, 14]}>
              <sphereGeometry args={[3.5]} />
              <meshStandardMaterial color="#228b22" />
            </mesh>
            
            <mesh position={[2.5, 5, 14.5]}>
              <sphereGeometry args={[2.8]} />
              <meshStandardMaterial color="#8fbc8f" />
            </mesh>
            
            <mesh position={[5.5, 1, 14]}>
              <sphereGeometry args={[4]} />
              <meshStandardMaterial color="#32cd32" />
            </mesh>
          </>
        )}
      </group>

      {/* ==== ESPACIO ESTRELLADO ==== */}
      <group>
        {Array.from({length: 200}, (_, i) => (
          <mesh 
            key={i}
            position={[
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200
            ]}
          >
            <sphereGeometry args={[Math.random() * 0.1 + 0.05]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={Math.random() * 0.8 + 0.2}
            />
          </mesh>
        ))}
      </group>

      {/* ==== ILUMINACIÓN ESPACIAL MEJORADA ==== */}
      <ambientLight intensity={0.3} color="#f5f8ff" />
      
      {/* Luz solar principal */}
      <directionalLight
        position={[50, 50, 20]}
        intensity={2.5}
        color="#fff5dc"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Luz de relleno desde la Tierra */}
      <pointLight 
        position={[0, -30, 0]} 
        intensity={0.8} 
        color="#4169e1" 
        distance={60}
      />
    </group>
  )
}