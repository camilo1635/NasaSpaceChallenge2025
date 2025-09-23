// src/Components/phase3_ISS/ISSPlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function ISSPlayerControls({ children }) {
  const playerRef = useRef()
  const { camera } = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef({ x: 0, y: 0 })
  
  // Estados para la vista rápida a la cúpula
  const cupolaViewActive = useRef(false)
  
  // Posición y rotación inicial para reset
  const initialPosition = useRef(new THREE.Vector3(0, 0, 0))
  const initialRotation = useRef({ x: 0, y: 0 })

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

  
  // Manejo de vista rápida a cúpula con tecla V y reset con tecla U
  useEffect(() => {
    const handleViewControls = (e) => {
      if (e.code === 'KeyV') {
        e.preventDefault()
        
        if (!cupolaViewActive.current) {
          // Activar vista a cúpula
          cupolaViewActive.current = true
          
          // Ajustar INSTANTÁNEAMENTE la rotación hacia la cúpula
          rotation.current.y = Math.PI * 0.75 // Mirar hacia arriba inmediatamente
          
        } else {
          // Desactivar vista a cúpula
          cupolaViewActive.current = false
          // La rotación se queda donde está, sin volver automáticamente
        }
      }
      
      if (e.code === 'KeyU') {
        e.preventDefault()
        
        // Resetear a posición y rotación inicial
        if (playerRef.current) {
          playerRef.current.position.copy(initialPosition.current)
        }
        rotation.current.x = initialRotation.current.x
        rotation.current.y = initialRotation.current.y
        velocity.current.set(0, 0, 0) // Detener todo movimiento
        cupolaViewActive.current = false // Desactivar vista cúpula si estaba activa
      }
    }

    window.addEventListener('keydown', handleViewControls)
    return () => window.removeEventListener('keydown', handleViewControls)
  }, [])

  // Removido: Click para pointer lock ya no se usa

  useFrame(() => {
    if (!playerRef.current) return

    // Física de microgravedad (BLOQUEADA durante vista cúpula)
    if (!cupolaViewActive.current) {
      const thrust = 0.02
      const damping = 0.98
      const maxSpeed = 0.15

      // Direcciones basadas en la rotación del jugador
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
    } else {
      // En vista cúpula: aplicar amortiguación para detener gradualmente el movimiento
      velocity.current.multiplyScalar(0.95)
      // Actualizar posición solo con la inercia restante
      playerRef.current.position.add(velocity.current)
    }

    // CÁMARA HÍBRIDA: Tercera persona que puede mirar arriba/abajo
    const cameraOffset = new THREE.Vector3(0, 1.5, 3.5)
    
    // En vista cúpula, cámara más cerca y centrada
    if (cupolaViewActive.current) {
      cameraOffset.set(0, 1.8, 2.5)
    }
    
    // Aplicar rotación horizontal al offset
    const offsetRotated = cameraOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.x)
    
    // Aplicar rotación vertical al offset
    const finalOffset = offsetRotated
      .clone()
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation.current.y * 0.3)

    const targetCameraPos = playerRef.current.position.clone().add(finalOffset)
    
    // Aplicar límites a la cámara
    const cameraDistanceFromCenter = Math.sqrt(targetCameraPos.x * targetCameraPos.x + targetCameraPos.z * targetCameraPos.z)
    const maxCameraRadius = 3.8
    
    if (cameraDistanceFromCenter > maxCameraRadius) {
      const cameraAngle = Math.atan2(targetCameraPos.z, targetCameraPos.x)
      targetCameraPos.x = Math.cos(cameraAngle) * maxCameraRadius
      targetCameraPos.z = Math.sin(cameraAngle) * maxCameraRadius
    }
    
    // Límites verticales para la cámara
    targetCameraPos.y = Math.max(-6.8, Math.min(10.5, targetCameraPos.y))
    
    // Interpolación suave (más rápida en vista cúpula)
    const lerpSpeed = cupolaViewActive.current ? 0.2 : 0.12
    camera.position.lerp(targetCameraPos, lerpSpeed)
    
    // DIRECCIÓN DE VISTA MEJORADA
    const lookAtTarget = playerRef.current.position.clone()
    lookAtTarget.y += 0.5
    
    // Aplicar rotación vertical a la dirección de vista
    const verticalLookOffset = new THREE.Vector3(
      Math.sin(rotation.current.x) * Math.sin(rotation.current.y) * 2,
      -Math.cos(rotation.current.y) * 2 + 0.5,
      Math.cos(rotation.current.x) * Math.sin(rotation.current.y) * 2
    )
    
    lookAtTarget.add(verticalLookOffset)
    camera.lookAt(lookAtTarget)

    // Rotación del jugador basada en el movimiento (solo si no está en vista cúpula)
    if (!cupolaViewActive.current) {
      const movementDir = new THREE.Vector3()
      if (keys.current['w']) movementDir.sub(new THREE.Vector3(Math.sin(rotation.current.x), 0, Math.cos(rotation.current.x)))
      if (keys.current['s']) movementDir.add(new THREE.Vector3(Math.sin(rotation.current.x), 0, Math.cos(rotation.current.x)))
      if (keys.current['a']) movementDir.sub(new THREE.Vector3(Math.cos(rotation.current.x), 0, -Math.sin(rotation.current.x)))
      if (keys.current['d']) movementDir.add(new THREE.Vector3(Math.cos(rotation.current.x), 0, -Math.sin(rotation.current.x)))
      
      if (movementDir.lengthSq() > 0) {
        const angle = Math.atan2(movementDir.x, movementDir.z)
        playerRef.current.rotation.y = THREE.MathUtils.lerp(
          playerRef.current.rotation.y, 
          angle, 
          0.08
        )
      }
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