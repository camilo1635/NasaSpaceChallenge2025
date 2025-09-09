// src/Components/phase2_NBL/FloatingPlayer.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function FloatingPlayer() {
  const playerRef = useRef()
  const { camera, gl } = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef({ x: 0, y: 0 })

  // Manejo de teclado
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true)
    const up = (e) => (keys.current[e.key.toLowerCase()] = false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // Manejo de ratón para rotación
  useEffect(() => {
    const onMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        rotation.current.x -= e.movementX * 0.002
        rotation.current.y -= e.movementY * 0.002
        rotation.current.y = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rotation.current.y)
        )
      }
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [gl])

  // Click activa pointer lock
  useEffect(() => {
    const onClick = () => gl.domElement.requestPointerLock()
    gl.domElement.addEventListener('click', onClick)
    return () => gl.domElement.removeEventListener('click', onClick)
  }, [gl])

  // Animación de flotación
  useFrame(() => {
    if (!playerRef.current) return

    // Velocidad reducida para simular resistencia del agua
    const speed = 0.03
    const resistance = 0.95 // Resistencia del agua

    // Direcciones basadas en la rotación de la cámara
    const forward = new THREE.Vector3(
      Math.sin(rotation.current.x),
      0,
      Math.cos(rotation.current.x)
    )
    const right = new THREE.Vector3(
      Math.cos(rotation.current.x),
      0,
      -Math.sin(rotation.current.x)
    )
    const up = new THREE.Vector3(0, 1, 0)

    // Fuerzas de movimiento
    const force = new THREE.Vector3()
    
    if (keys.current['w']) force.sub(forward) // Adelante
    if (keys.current['s']) force.add(forward) // Atrás
    if (keys.current['a']) force.sub(right)   // Izquierda
    if (keys.current['d']) force.add(right)   // Derecha
    if (keys.current['space'] || keys.current[' ']) force.add(up) // Subir
    if (keys.current['shift']) force.sub(up)  // Bajar

    // Aplicar fuerza a la velocidad
    force.multiplyScalar(speed)
    velocity.current.add(force)

    // Aplicar resistencia del agua
    velocity.current.multiplyScalar(resistance)

    // Aplicar flotabilidad (tendencia a subir ligeramente)
    velocity.current.y += 0.001

    // Actualizar posición
    playerRef.current.position.add(velocity.current)

    // Límites de la piscina
    const pos = playerRef.current.position
    pos.x = Math.max(-14, Math.min(14, pos.x))
    pos.y = Math.max(-8, Math.min(7, pos.y))
    pos.z = Math.max(-14, Math.min(14, pos.z))

    // Cámara flotante (más suave)
    const cameraOffset = new THREE.Vector3(0, 1, 3)
    const offsetRotated = cameraOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.x)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation.current.y)

    const targetCameraPos = playerRef.current.position.clone().add(offsetRotated)
    
    // Interpolación suave de la cámara
    camera.position.lerp(targetCameraPos, 0.1)
    
    // Rotación de la cámara
    const lookAtTarget = playerRef.current.position.clone()
    lookAtTarget.y += 0.5
    camera.lookAt(lookAtTarget)

    // Movimiento ondulante del jugador para simular flotación
    const time = Date.now() * 0.001
    playerRef.current.rotation.x = Math.sin(time * 0.5) * 0.05
    playerRef.current.rotation.z = Math.cos(time * 0.3) * 0.03
  })

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {/* Cuerpo del astronauta flotante */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.6, 0.4]} />
        <meshStandardMaterial color="#ff6b4d" />
      </mesh>
      
      {/* Casco/cabeza */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.8}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      
      {/* Equipo de respiración */}
      <mesh position={[0, 0.5, -0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} />
      </mesh>
      
      {/* Burbujas que salen del equipo */}
      {Array.from({length: 3}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 0.2,
            0.8 + i * 0.3,
            -0.2
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}