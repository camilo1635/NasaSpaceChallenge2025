// src/Components/phase2_NBL/TrainingTasks.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameState } from '../Utils/useGameState'
import * as THREE from 'three'
import { Html, useGLTF } from '@react-three/drei'

/* 🔹 COMPONENTES PARA PARTES DEL SATÉLITE */
function SatelliteBody(props) {
  const { scene } = useGLTF('/models/sat01_body_satellite.glb')
  return <primitive object={scene.clone()} scale={0.15} rotation={[0, Math.PI / 2, 0]} />
}

function Antenna(props) {
  const { scene } = useGLTF('/models/antenna.glb')
  return <primitive object={scene.clone()} scale={0.1} rotation={[0, Math.PI / 2, 0]} />
}

function DockingRing(props) {
  const { scene } = useGLTF('/models/svrs_1.glb')
  return <primitive object={scene.clone()} scale={0.15} rotation={[0, Math.PI / 2, 0]}/>
}

function SolarPanel(props) {
  const { scene } = useGLTF('/models/solar_panel.glb')
  return <primitive object={scene.clone()} scale={0.03} rotation={[0, Math.PI / 2, 0]} />
}

/* 🔹 BLOQUE NBL (pieza del satélite) */
function NBLBlock({ blockData, onGrab, onRelease, isGrabbed, grabPosition }) {
  const blockRef = useRef()
  const { camera } = useThree()
  const [isNearby, setIsNearby] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)

  useFrame(() => {
    if (!blockRef.current || isPlaced) return

    if (isGrabbed && grabPosition) {
      blockRef.current.position.copy(grabPosition)
    } else {
      blockRef.current.position.y = blockData.position[1] + Math.sin(Date.now() * 0.003 + blockData.id) * 0.1
      blockRef.current.rotation.y += 0.005
    }

    const dx = camera.position.x - blockRef.current.position.x
    const dy = camera.position.y - blockRef.current.position.y
    const dz = camera.position.z - blockRef.current.position.z
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
    setIsNearby(distance < 4)
  })

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyE' && isNearby && !isGrabbed && !isPlaced) {
        e.preventDefault()
        onGrab(blockData.id)
      }
    }

    const handleRelease = (e) => {
      if (e.code === 'KeyQ' && isGrabbed) {
        e.preventDefault()
        onRelease(blockData.id, blockRef.current.position.clone())
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keydown', handleRelease)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keydown', handleRelease)
    }
  }, [isNearby, isGrabbed, blockData.id, onGrab, onRelease])

  if (isPlaced && !isGrabbed) return null

  /* 🔹 RENDERIZADO DEL MODELO SEGÚN EL TIPO */
  const renderBlockGeometry = () => {
    switch (blockData.type) {
      case 'base':
        return <SatelliteBody scale={0.5} />
      case 'support':
        return <Antenna scale={0.6} />
      case 'connector':
        return <DockingRing scale={0.6} />
      case 'panel':
        return <SolarPanel scale={0.4} />
      default:
        return <mesh><boxGeometry args={[1, 1, 1]} /></mesh>
    }
  }

  return (
    <group>
      <group ref={blockRef} position={blockData.position}>
        {renderBlockGeometry()}
      </group>

      {isNearby && !isGrabbed && !isPlaced && (
        <Html position={[blockData.position[0], blockData.position[1] + 2.5, blockData.position[2]]} center>
          <div style={{
            background: 'rgba(0,50,100,0.9)',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '12px',
            fontSize: '13px',
            textAlign: 'center',
            border: '2px solid #00ffff',
            animation: 'pulse 1.5s infinite',
            minWidth: '180px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{blockData.name}</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              Presiona <span style={{color: '#00ffff'}}>E</span> para agarrar
            </div>
            {isGrabbed && (
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                Presiona <span style={{color: '#00ff00'}}>Q</span> para soltar
              </div>
            )}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.08); opacity: 0.8; }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}

/* 🔹 PUNTO DE CONEXIÓN */
function ConnectionPoint({ position, isActive, expectedType, onConnect }) {
  const pointRef = useRef()
  useFrame(() => {
    if (!pointRef.current || !isActive) return
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2
    pointRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={pointRef} position={position} onClick={() => onConnect && onConnect()}>
      <sphereGeometry args={[0.3]} />
      <meshStandardMaterial 
        color={isActive ? "#00ff00" : "#666666"}
        emissive={isActive ? "#00ff00" : "#333333"}
        emissiveIntensity={isActive ? 0.5 : 0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

/* 🔹 COMPONENTE PRINCIPAL */
export function TrainingTasks() {
  const { dispatch } = useGameState()
  const [grabbedBlock, setGrabbedBlock] = useState(null)
  const [grabbedPosition, setGrabbedPosition] = useState(null)
  const [connectedBlocks, setConnectedBlocks] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [showCompletion, setShowCompletion] = useState(false)
  const { camera, gl } = useThree()

  const blocks = [
    { id: 1, type: 'base', position: [-6, 1, -2], name: 'Cuerpo Principal del Satélite' },
    { id: 2, type: 'support', position: [6, 1, -2], name: 'Antena de Comunicación' },
    { id: 3, type: 'connector', position: [-6, 1, 4], name: 'Anillo de Acople' },
    { id: 4, type: 'panel', position: [6, 1, 4], name: 'Panel Solar' }
  ]

  const connectionPoints = [
    { id: 'base-point', position: [0, 1, -3], expectedType: 'base', step: 1 },
    { id: 'support-point', position: [0, 2.5, -3], expectedType: 'support', step: 2 },
    { id: 'connector-point', position: [-1.5, 3.5, -3], expectedType: 'connector', step: 3 },
    { id: 'panel-point', position: [1.5, 4, -3], expectedType: 'panel', step: 4 }
  ]

  useEffect(() => {
    const onMouseMove = (e) => {
      if (grabbedBlock) {
        const mouse = new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        )
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 3)
        const intersectPoint = new THREE.Vector3()
        raycaster.ray.intersectPlane(plane, intersectPoint)
        setGrabbedPosition(intersectPoint)
      }
    }

    if (grabbedBlock) {
      gl.domElement.addEventListener('mousemove', onMouseMove)
      return () => gl.domElement.removeEventListener('mousemove', onMouseMove)
    }
  }, [grabbedBlock, camera, gl])

  const handleGrabBlock = (blockId) => setGrabbedBlock(blockId)

  const handleReleaseBlock = (blockId, position) => {
    const block = blocks.find(b => b.id === blockId)
    const validPoint = connectionPoints.find(point => 
      point.expectedType === block.type && 
      point.step === currentStep &&
      position.distanceTo(new THREE.Vector3(...point.position)) < 2
    )

    if (validPoint) {
      setConnectedBlocks(prev => [...prev, { blockId, pointId: validPoint.id }])
      setCurrentStep(prev => prev + 1)


      if (currentStep >= 4) {
        setShowCompletion(true)
        setTimeout(() => {
          dispatch({ type: 'SET_PHASE', payload: 'iss' })
        }, 4000)
      }
    } else {
      console.log('❌ Conexión inválida, intenta de nuevo')
    }

    setGrabbedBlock(null)
    setGrabbedPosition(null)
  }

  const getStepInstructions = () => {
    const instructions = {
      1: "Coloca el Cuerpo Principal en la base",
      2: "Conecta la Antena encima del cuerpo",
      3: "Instala el Anillo de Acople al lado izquierdo", 
      4: "Monta el Panel Solar en el lado derecho"
    }
    return instructions[currentStep] || "¡Entrenamiento completado!"
  }

  return (
    <group>
      {/* Base de construcción */}
      <mesh position={[0, 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.5, 2]} />
        <meshStandardMaterial color="#708090" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Soporte central */}
      <mesh position={[0, 0.5, -3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 3]} />
        <meshStandardMaterial color="#556B2F" metalness={0.6} roughness={0.4} />
      </mesh>

      {connectionPoints.map((point) => (
        <ConnectionPoint
          key={point.id}
          position={point.position}
          isActive={point.step === currentStep}
          expectedType={point.expectedType}
        />
      ))}

      {blocks.map((block) => (
        <NBLBlock
          key={block.id}
          blockData={block}
          onGrab={handleGrabBlock}
          onRelease={handleReleaseBlock}
          isGrabbed={grabbedBlock === block.id}
          grabPosition={grabbedBlock === block.id ? grabbedPosition : null}
          isConnected={connectedBlocks.some(conn => conn.blockId === block.id)}
        />
      ))}

      {/* HUD */}
      <Html position={[-8, 4, 0]} center>
        <div style={{
          background: 'rgba(0,30,60,0.95)',
          color: '#fff',
          padding: '15px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          border: '2px solid #00ffff',
          minWidth: '280px'
        }}>
          <h3 style={{ margin: '0 0 10px', color: '#00ffff' }}>🛰️ ENSAMBLA EL SATÉLITE</h3>
          <div><strong>Paso {currentStep}/4:</strong></div>
          <div style={{ fontSize: '13px' }}>{getStepInstructions()}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Progreso: {connectedBlocks.length}/4 módulos conectados
          </div>
        </div>
      </Html>

      {showCompletion && (
        <Html position={[0, 6, 0]} center>
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,167,69,0.95), rgba(0,100,0,0.95))',
            color: '#fff',
            padding: '25px',
            borderRadius: '20px',
            textAlign: 'center',
            border: '3px solid #28a745',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2>🎉 ¡SATÉLITE ENSAMBLADO!</h2>
            <p>Estructura completa: ✅ Cuerpo + Antena + Acople + Panel</p>
            <p>Iniciando transferencia a la ISS...</p>
          </div>
        </Html>
      )}
    </group>
  )
}
