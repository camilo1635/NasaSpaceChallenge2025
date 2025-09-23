// src/Components/phase3_ISS/ISSPlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function ISSPlayerControls({ children }) {
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

  // Manejo de ratón para rotación libre COMPLETA
  useEffect(() => {
    const onMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        rotation.current.x -= e.movementX * 0.002
        rotation.current.y -= e.movementY * 0.002
        // ROTACIÓN VERTICAL COMPLETA - Casi 180 grados
        rotation.current.y = Math.max(-Math.PI * 0.95, Math.min(Math.PI * 0.95, rotation.current.y))
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

  useFrame(() => {
    if (!playerRef.current) return

    // Física de microgravedad
    const thrust = 0.02
    const damping = 0.98
    const maxSpeed = 0.15

    // Direcciones basadas en la rotación del jugador (manteniendo sistema original)
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

    // Aplicar fuerzas de propulsión
    const dir = new THREE.Vector3()
    
    if (keys.current['w']) dir.sub(forward) // Adelante
    if (keys.current['s']) dir.add(forward) // Atrás
    if (keys.current['a']) dir.sub(right)   // Izquierda
    if (keys.current['d']) dir.add(right)   // Derecha
    if (keys.current['space'] || keys.current[' ']) dir.add(up) // Subir
    if (keys.current['shift']) dir.sub(up)  // Bajar

    // Normalizar y aplicar impulso
    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(thrust)
      velocity.current.add(dir)
    }

    // Limitar velocidad máxima
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed)
    }

    // Aplicar amortiguación
    velocity.current.multiplyScalar(damping)

    // Actualizar posición
    playerRef.current.position.add(velocity.current)

    // Límites cilíndricos de la ISS
    const pos = playerRef.current.position
    const maxRadius = 3.5
    const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z)
    
    if (distanceFromCenter > maxRadius) {
      const angle = Math.atan2(pos.z, pos.x)
      pos.x = Math.cos(angle) * maxRadius
      pos.z = Math.sin(angle) * maxRadius
      velocity.current.multiplyScalar(0.3)
    }
    
    // LÍMITES VERTICALES AMPLIADOS
    pos.y = Math.max(-6, Math.min(9, pos.y))
    
    if (pos.y <= -6 || pos.y >= 9) {
      velocity.current.y *= -0.3
    }

    // CÁMARA HÍBRIDA: Tercera persona que puede mirar arriba/abajo
    const cameraOffset = new THREE.Vector3(0, 1.5, 3.5)
    
    // Aplicar rotación horizontal al offset
    const offsetRotated = cameraOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.x)
    
    // NUEVO: Aplicar también rotación vertical al offset
    const finalOffset = offsetRotated
      .clone()
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation.current.y * 0.3) // Factor 0.3 para suavizar

    const targetCameraPos = playerRef.current.position.clone().add(finalOffset)
    
    // Aplicar límites a la cámara
    const cameraDistanceFromCenter = Math.sqrt(targetCameraPos.x * targetCameraPos.x + targetCameraPos.z * targetCameraPos.z)
    const maxCameraRadius = 3.8
    
    if (cameraDistanceFromCenter > maxCameraRadius) {
      const cameraAngle = Math.atan2(targetCameraPos.z, targetCameraPos.x)
      targetCameraPos.x = Math.cos(cameraAngle) * maxCameraRadius
      targetCameraPos.z = Math.sin(cameraAngle) * maxCameraRadius
    }
    
    // Límites verticales para la cámara (más generosos)
    targetCameraPos.y = Math.max(-6.8, Math.min(10.5, targetCameraPos.y))
    
    // Interpolación suave
    camera.position.lerp(targetCameraPos, 0.12)
    
    // DIRECCIÓN DE VISTA MEJORADA: Combina seguimiento del jugador + rotación vertical
    const lookAtTarget = playerRef.current.position.clone()
    lookAtTarget.y += 0.5 // Altura base
    
    // Aplicar rotación vertical a la dirección de vista
    const verticalLookOffset = new THREE.Vector3(
      Math.sin(rotation.current.x) * Math.sin(rotation.current.y) * 2,
      -Math.cos(rotation.current.y) * 2 + 0.5,
      Math.cos(rotation.current.x) * Math.sin(rotation.current.y) * 2
    )
    
    lookAtTarget.add(verticalLookOffset)
    camera.lookAt(lookAtTarget)

    // Rotación del jugador basada en el movimiento
    if (dir.lengthSq() > 0) {
      const angle = Math.atan2(dir.x, dir.z)
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y, 
        angle, 
        0.08
      )
    }

    // Flotación sutil para simular microgravedad
    if (velocity.current.length() > 0.01) {
      const time = Date.now() * 0.0005
      playerRef.current.rotation.x = Math.sin(time * 0.7) * 0.03
      playerRef.current.rotation.z = Math.cos(time * 0.5) * 0.02
    } else {
      const time = Date.now() * 0.001
      playerRef.current.rotation.x = Math.sin(time * 0.3) * 0.015
      playerRef.current.rotation.z = Math.cos(time * 0.2) * 0.01
    }
  })

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {children}
    </group>
  )
}