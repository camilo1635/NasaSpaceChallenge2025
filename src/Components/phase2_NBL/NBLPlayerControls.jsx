// src/Components/phase2_NBL/NBLPlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function NBLPlayerControls({ children }) {
  const playerRef = useRef()
  const { camera, gl } = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef({ x: 0, y: 0 })
  const thrusterForce = useRef(new THREE.Vector3(0, 0, 0))
  const angularVelocity = useRef({ x: 0, y: 0, z: 0 })

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

  useFrame((state, delta) => {
    if (!playerRef.current) return

    const time = state.clock.getElapsedTime()

    // Parámetros físicos del NBL (más lentos y realistas)
    const thrusterPower = 0.002 // Potencia de los propulsores (reducida)
    const waterResistance = 0.96 // Resistencia del agua (mayor resistencia)
    const buoyancyForce = 0.0002 // Flotabilidad ligera (reducida)
    const angularDamping = 0.58 // Amortiguación angular (mayor damping)
    const maxVelocity = 0.10 // Velocidad máxima (reducida)

    // Direcciones basadas en la rotación del player
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

    // Resetear fuerzas del propulsor
    thrusterForce.current.set(0, 0, 0)

    // Aplicar fuerzas de los propulsores según las teclas presionadas
    if (keys.current['w']) thrusterForce.current.sub(forward.clone().multiplyScalar(thrusterPower))
    if (keys.current['s']) thrusterForce.current.add(forward.clone().multiplyScalar(thrusterPower))
    if (keys.current['a']) thrusterForce.current.sub(right.clone().multiplyScalar(thrusterPower))
    if (keys.current['d']) thrusterForce.current.add(right.clone().multiplyScalar(thrusterPower))
    if (keys.current['space'] || keys.current[' ']) thrusterForce.current.add(up.clone().multiplyScalar(thrusterPower))
    if (keys.current['shift']) thrusterForce.current.sub(up.clone().multiplyScalar(thrusterPower))

    // Aplicar fuerzas a la velocidad
    velocity.current.add(thrusterForce.current)

    // Aplicar flotabilidad sutil
    velocity.current.y += buoyancyForce

    // Aplicar resistencia del agua
    velocity.current.multiplyScalar(waterResistance)

    // Limitar velocidad máxima
    if (velocity.current.length() > maxVelocity) {
      velocity.current.normalize().multiplyScalar(maxVelocity)
    }

    // Aplicar amortiguación angular
    angularVelocity.current.x *= angularDamping
    angularVelocity.current.y *= angularDamping
    angularVelocity.current.z *= angularDamping

    // Actualizar posición
    playerRef.current.position.add(velocity.current)

    // Límites de la piscina NBL (más realistas)
    const pos = playerRef.current.position
    pos.x = Math.max(-15, Math.min(15, pos.x))
    pos.y = Math.max(-9, Math.min(8, pos.y))
    pos.z = Math.max(-15, Math.min(15, pos.z))

    // Aplicar rebote suave en los límites
    if (pos.x <= -14.5 || pos.x >= 14.5) velocity.current.x *= -0.3
    if (pos.y <= -8.5 || pos.y >= 7.5) velocity.current.y *= -0.3
    if (pos.z <= -14.5 || pos.z >= 14.5) velocity.current.z *= -0.3

    // Movimiento de flotación natural del cuerpo (más sutil)
    const floatOffset = new THREE.Vector3(
      Math.sin(time * 0.3) * 0.008,
      Math.sin(time * 0.2) * 0.012,
      Math.cos(time * 0.25) * 0.008
    )
    
    // Aplicar rotación flotante sutil al jugador (más lenta)
    playerRef.current.rotation.x = Math.sin(time * 0.15) * 0.02 + angularVelocity.current.x
    playerRef.current.rotation.z = Math.cos(time * 0.12) * 0.015 + angularVelocity.current.z
    
    // Rotación Y se controla con el ratón y propulsores
    if (Math.abs(angularVelocity.current.y) > 0.001) {
      rotation.current.x += angularVelocity.current.y * delta
    }

    // Configuración de cámara más dinámica
    const cameraDistance = 4 + Math.sin(time * 0.5) * 0.2
    const cameraHeight = 2.5 + Math.sin(time * 0.3) * 0.1
    
    const cameraOffset = new THREE.Vector3(0, cameraHeight, cameraDistance)
    const offsetRotated = cameraOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.x)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation.current.y * 0.5)

    // Posición objetivo de la cámara con flotación
    const targetCameraPos = playerRef.current.position
      .clone()
      .add(offsetRotated)
      .add(floatOffset.clone().multiplyScalar(0.5))
    
    // Interpolación suave de la cámara
    camera.position.lerp(targetCameraPos, 0.08)
    
    // Look at objetivo con ligero offset hacia adelante
    const lookAtTarget = playerRef.current.position
      .clone()
      .add(forward.clone().multiplyScalar(2))
      .add(new THREE.Vector3(0, 1, 0))
      .add(floatOffset.clone().multiplyScalar(0.3))
    
    camera.lookAt(lookAtTarget)

    // Efectos de partículas de burbujas (simulados con rotación)
    if (thrusterForce.current.length() > 0.01) {
      // Agregar ligera vibración cuando se usan propulsores
      const vibration = new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      )
      playerRef.current.position.add(vibration)
    }
  })

  return (
    <group ref={playerRef} position={[0, 1, 0]}>
      {children}
    </group>
  )
}