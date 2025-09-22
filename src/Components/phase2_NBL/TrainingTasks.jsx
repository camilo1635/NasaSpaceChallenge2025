// src/Components/phase2_NBL/TrainingTasks.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameState } from '../Utils/useGameState'
import * as THREE from 'three'
import { Html, useGLTF } from '@react-three/drei'

/* 🔹 SATELLITE PART COMPONENTS */
function SatelliteBody(props) {
  const { scene } = useGLTF('/models/sat01_body_satellite.glb')
  return <primitive object={scene.clone()} {...props} />
}

function Antenna(props) {
  const { scene } = useGLTF('/models/antenna.glb')
  return <primitive object={scene.clone()} {...props} />
}

function DockingRing(props) {
  const { scene } = useGLTF('/models/svrs_1.glb')
  return <primitive object={scene.clone()} {...props} />
}

/* 🔹 NBL BLOCK (satellite piece) */
function NBLBlock({ blockData, onGrab, onRelease, isGrabbed, grabPosition, isConnected, finalPosition }) {
  const blockRef = useRef()
  const { camera } = useThree()
  const [isNearby, setIsNearby] = useState(false)

  useFrame(() => {
    if (!blockRef.current) return

    // If connected, keep it in its final position
    if (isConnected && finalPosition) {
      blockRef.current.position.copy(finalPosition)
      blockRef.current.rotation.set(0, Math.PI / 2, 0) // Consistent orientation
      return
    }

    // If being grabbed
    if (isGrabbed && grabPosition) {
      blockRef.current.position.copy(grabPosition)
    } else if (!isConnected) {
      // Floating animation only if not connected
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
      if (e.code === 'KeyE' && isNearby && !isGrabbed && !isConnected) {
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
  }, [isNearby, isGrabbed, isConnected, blockData.id, onGrab, onRelease])

  /* 🔹 RENDER MODEL BASED ON TYPE */
  const renderBlockGeometry = () => {
    const baseScale = 0.15 // Consistent base scale
    
    switch (blockData.type) {
      case 'base':
        return <SatelliteBody scale={baseScale} rotation={[0, Math.PI / 2, 0]} />
      case 'support':
        return <Antenna scale={baseScale * 0.8} rotation={[0, Math.PI / 2, 0]} />
      case 'connector':
        return <DockingRing scale={baseScale} rotation={[0, Math.PI / 2, 0]} />
      default:
        return <mesh><boxGeometry args={[1, 1, 1]} /></mesh>
    }
  }

  return (
    <group>
      <group ref={blockRef} position={blockData.position}>
        {renderBlockGeometry()}
      </group>

      {isNearby && !isGrabbed && !isConnected && (
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
              Press <span style={{color: '#00ffff'}}>E</span> to grab
            </div>
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.08); opacity: 0.8; }
            }
          `}</style>
        </Html>
      )}

      {isGrabbed && (
        <Html position={[grabPosition?.x || 0, (grabPosition?.y || 0) + 1, grabPosition?.z || 0]} center>
          <div style={{
            background: 'rgba(0,100,50,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            border: '2px solid #00ff00'
          }}>
            Press <span style={{color: '#00ff00'}}>Q</span> to release
          </div>
        </Html>
      )}
    </group>
  )
}

/* 🔹 CONNECTION POINT */
function ConnectionPoint({ position, isActive, onConnect }) {
  const pointRef = useRef()
  useFrame(() => {
    if (!pointRef.current || !isActive) return
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2
    pointRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={pointRef} position={position} onClick={() => onConnect && onConnect()}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial 
        color={isActive ? "#00ff00" : "#666666"}
        emissive={isActive ? "#00ff00" : "#333333"}
        emissiveIntensity={isActive ? 0.8 : 0.1}
        transparent
        opacity={isActive ? 0.6 : 0.3}
        wireframe={isActive}
      />
    </mesh>
  )
}

/* 🔹 MAIN COMPONENT */
export function TrainingTasks() {
  const { dispatch } = useGameState()
  const [grabbedBlock, setGrabbedBlock] = useState(null)
  const [grabbedPosition, setGrabbedPosition] = useState(null)
  const [connectedBlocks, setConnectedBlocks] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [showCompletion, setShowCompletion] = useState(false)
  const { camera, gl } = useThree()

  // Only 3 pieces
  const blocks = [
    { id: 1, type: 'base', position: [-6, 1, -2], name: 'Satellite Main Body' },
    { id: 2, type: 'support', position: [6, 1, -2], name: 'Communication Antenna' },
    { id: 3, type: 'connector', position: [-6, 1, 4], name: 'Docking Ring' }
  ]

  // Final positions adjusted according to the image
  const connectionPoints = [
    { 
      id: 'base-point', 
      position: [0, 1, -3], 
      finalPosition: [0, 1, -3], // Base center
      expectedType: 'base', 
      step: 1 
    },
    { 
      id: 'support-point', 
      position: [0, 2.5, -3], 
      finalPosition: [0, 3.2, -3], // Antenna above the body
      expectedType: 'support', 
      step: 2 
    },
    { 
      id: 'connector-point', 
      position: [0, 1, -1.5], 
      finalPosition: [0, 1, -2], // Front ring
      expectedType: 'connector', 
      step: 3 
    }
  ]

  // UPDATE GLOBAL STATE WHEN VALUES CHANGE
  useEffect(() => {
    dispatch({ 
      type: 'UPDATE_NBL_TRAINING', 
      payload: { 
        currentStep, 
        connectedBlocks, 
        showCompletion 
      } 
    })
  }, [currentStep, connectedBlocks, showCompletion, dispatch])

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
      position.distanceTo(new THREE.Vector3(...point.position)) < 3.5 // Increased detection range
    )

    if (validPoint) {
      setConnectedBlocks(prev => [...prev, { 
        blockId, 
        pointId: validPoint.id,
        finalPosition: new THREE.Vector3(...validPoint.finalPosition)
      }])
      setCurrentStep(prev => prev + 1)

      // Now only 3 steps
      if (currentStep >= 3) {
        setShowCompletion(true)
        setTimeout(() => {
          if(window.startGlobalTransition){
            window.startGlobalTransition('iss')
          }else {
            dispatch({ type: 'SET_PHASE', payload: 'iss'})
          }
        }, 4000)
      }
    } else {
      console.log('❌ Invalid connection, try again')
    }

    setGrabbedBlock(null)
    setGrabbedPosition(null)
  }

  // Find connection information for each block
  const getBlockConnectionInfo = (blockId) => {
    return connectedBlocks.find(conn => conn.blockId === blockId)
  }

  return (
    <group>
      {/* Construction base - more visible platform */}
      <mesh position={[0, 0.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 3]} />
        <meshStandardMaterial color="#404040" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Visual assembly zone */}
      <mesh position={[0, 0.6, -3]}>
        <ringGeometry args={[2.5, 3, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
      </mesh>

      {connectionPoints.map((point) => (
        <ConnectionPoint
          key={point.id}
          position={point.position}
          isActive={point.step === currentStep}
          expectedType={point.expectedType}
        />
      ))}

      {blocks.map((block) => {
        const connectionInfo = getBlockConnectionInfo(block.id)
        return (
          <NBLBlock
            key={block.id}
            blockData={block}
            onGrab={handleGrabBlock}
            onRelease={handleReleaseBlock}
            isGrabbed={grabbedBlock === block.id}
            grabPosition={grabbedBlock === block.id ? grabbedPosition : null}
            isConnected={!!connectionInfo}
            finalPosition={connectionInfo?.finalPosition}
          />
        )
      })}
    </group>
  )
}