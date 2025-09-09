// src/Components/phase2_NBL/TrainingTasks.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useGameState } from '../Utils/useGameState'

function SimpleBlock({ position, id, color, name, onConnect }) {
  const blockRef = useRef()
  const { camera } = useThree()
  const [isNearby, setIsNearby] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useFrame(() => {
    if (!blockRef.current || isConnected) return

    // Flotación suave
    blockRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003 + id) * 0.2
    blockRef.current.rotation.y += 0.01

    // Detectar cercanía del jugador
    const dx = camera.position.x - blockRef.current.position.x
    const dy = camera.position.y - blockRef.current.position.y
    const dz = camera.position.z - blockRef.current.position.z
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
    
    setIsNearby(distance < 3)
  })

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && isNearby && !isConnected) {
        e.preventDefault()
        setIsConnected(true)
        onConnect(id)
        console.log(`Bloque ${name} conectado!`)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isNearby, isConnected, id, name, onConnect])

  if (isConnected) return null

  return (
    <group>
      <mesh 
        ref={blockRef} 
        position={position}
        castShadow
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={color}
          emissive={isNearby ? color : '#000000'}
          emissiveIntensity={isNearby ? 0.3 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Indicador cuando está cerca */}
      {isNearby && (
        <Html position={[position[0], position[1] + 2, position[2]]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            border: '2px solid #4da6ff',
            animation: 'pulse 1s infinite'
          }}>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Presiona ESPACIO para conectar
            </div>
          </div>
          
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}

export function TrainingTasks() {
  const { dispatch } = useGameState()
  const [connectedBlocks, setConnectedBlocks] = useState([])
  const [showCompletion, setShowCompletion] = useState(false)

  // Posiciones de los bloques
  const blocks = [
    { id: 1, position: [-5, 2, -3], color: '#ffd700', name: 'Módulo A' },
    { id: 2, position: [5, 1, -3], color: '#4169e1', name: 'Módulo B' }
  ]

  const handleBlockConnect = (blockId) => {
    if (!connectedBlocks.includes(blockId)) {
      const newConnected = [...connectedBlocks, blockId]
      setConnectedBlocks(newConnected)
      
      console.log(`Módulos conectados: ${newConnected.length}/2`)
      
      // Si se conectaron ambos bloques
      if (newConnected.length >= 2) {
        setShowCompletion(true)
        
        // Transición a ISS después de 3 segundos
        setTimeout(() => {
          console.log('🚀 Entrenamiento NBL completado. Dirigiéndose a la ISS...')
          dispatch({ type: 'SET_PHASE', payload: 'iss' })
        }, 3000)
      }
    }
  }

  return (
    <group>
      {/* Estructura central donde se "conectan" los bloques */}
      <mesh position={[0, 2, -3]} castShadow>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Mostrar bloques no conectados */}
      {blocks.map((block) => 
        !connectedBlocks.includes(block.id) && (
          <SimpleBlock
            key={block.id}
            position={block.position}
            id={block.id}
            color={block.color}
            name={block.name}
            onConnect={handleBlockConnect}
          />
        )
      )}

      {/* Indicadores de progreso en la estructura central */}
      {connectedBlocks.map((blockId, index) => (
        <mesh key={blockId} position={[index * 1.5 - 0.75, 2.8, -3]} castShadow>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Mensaje de finalización */}
      {showCompletion && (
        <Html position={[0, 5, 0]} center>
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,167,69,0.95), rgba(0,100,0,0.95))',
            color: '#fff',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            border: '3px solid #28a745',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ margin: '0 0 10px', fontSize: '20px' }}>
              ¡ENTRENAMIENTO NBL COMPLETADO!
            </h2>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Has conectado exitosamente ambos módulos
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>
              Preparándote para la experiencia final en el espacio...
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}