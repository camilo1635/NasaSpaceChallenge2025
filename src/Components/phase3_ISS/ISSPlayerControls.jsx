// src/Components/phase3_ISS/ISSPlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function ISSPlayerControls({ children }) {
  const playerRef = useRef()
  const { camera } = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const mouseRotation = useRef({ x: 0, y: 0 })
  
  // Estados de vista
  const externalViewActive = useRef(false)
  const cupolaViewActive = useRef(false)
  const isPointerLocked = useRef(false)
  
  // Configuración de vista externa
  const externalCameraDistance = useRef(85)
  const externalCameraAngle = useRef(0)
  const externalCameraHeight = useRef(30)
  
  // Posiciones guardadas para vista externa
  const savedPlayerPosition = useRef(new THREE.Vector3(0, 0, 0))
  const savedMouseRotation = useRef({ x: 0, y: 0 })
  
  // Posición inicial para reset
  const initialPosition = useRef(new THREE.Vector3(0, 0, 0))

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

  // Sistema de mouse look con pointer lock
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isPointerLocked.current || externalViewActive.current) return
      
      const sensitivity = 0.002
      mouseRotation.current.x -= e.movementX * sensitivity
      mouseRotation.current.y -= e.movementY * sensitivity
      
      // Limitar rotación vertical
      mouseRotation.current.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, mouseRotation.current.y))
    }

    const handleClick = () => {
      if (!externalViewActive.current && document.pointerLockElement !== document.body) {
        document.body.requestPointerLock()
      }
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === document.body
    }

    const handleKeyDown = (e) => {
      if (e.code === 'Escape' && isPointerLocked.current) {
        document.exitPointerLock()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Sistema de colisiones para navegación interna
  const checkInternalCollisions = (newPosition) => {
    const pos = newPosition.clone()
    
    // Límites verticales estrictos
    pos.y = Math.max(-7.5, Math.min(7.5, pos.y))
    
    // Definir módulos cilíndricos de la ISS
    const modules = [
      {
        // Módulo central (eje principal Z)
        center: [0, pos.y, 0], 
        axis: 'z', 
        radius: 1.8,
        zMin: -8, 
        zMax: 8
      },
      {
        // Módulo laboratorio (eje X)
        center: [0, pos.y, -10], 
        axis: 'x', 
        radius: 1.6,
        xMin: -4, 
        xMax: 4
      },
      {
        // Módulo habitación (eje X)
        center: [0, pos.y, 10], 
        axis: 'x', 
        radius: 1.4,
        xMin: -3.5, 
        xMax: 3.5
      }
    ]

    let isInValidSpace = false
    let constrainedPos = pos.clone()

    for (const module of modules) {
      if (module.axis === 'z') {
        // Módulo central - cilindro a lo largo del eje Z
        if (pos.z >= module.zMin && pos.z <= module.zMax) {
          const radialDistance = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
          if (radialDistance <= module.radius) {
            isInValidSpace = true
          } else {
            // Empujar hacia adentro del cilindro
            const angle = Math.atan2(pos.y, pos.x)
            constrainedPos.x = Math.cos(angle) * module.radius
            constrainedPos.y = Math.sin(angle) * module.radius
            isInValidSpace = true
          }
        }
      } else if (module.axis === 'x') {
        // Módulos perpendiculares - cilindros a lo largo del eje X
        const moduleZCenter = module.center[2]
        if (pos.z >= moduleZCenter - 0.5 && pos.z <= moduleZCenter + 0.5) {
          if (pos.x >= module.xMin && pos.x <= module.xMax) {
            const radialDistance = Math.sqrt(pos.y * pos.y + (pos.z - moduleZCenter) * (pos.z - moduleZCenter))
            if (radialDistance <= module.radius) {
              isInValidSpace = true
            } else {
              const angle = Math.atan2(pos.z - moduleZCenter, pos.y)
              constrainedPos.y = Math.cos(angle) * module.radius
              constrainedPos.z = moduleZCenter + Math.sin(angle) * module.radius
              isInValidSpace = true
            }
          }
        }
      }
    }

    // Verificar conexiones entre módulos (escotillas)
    const connections = [
      { z1: -8, z2: -6, radius: 1.7 },
      { z1: 6, z2: 8, radius: 1.7 }
    ]

    for (const conn of connections) {
      if (pos.z >= conn.z1 && pos.z <= conn.z2) {
        const radialDistance = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
        if (radialDistance <= conn.radius) {
          isInValidSpace = true
        } else {
          const angle = Math.atan2(pos.y, pos.x)
          constrainedPos.x = Math.cos(angle) * conn.radius
          constrainedPos.y = Math.sin(angle) * conn.radius
          isInValidSpace = true
        }
      }
    }

    if (!isInValidSpace) {
      return playerRef.current ? playerRef.current.position.clone() : initialPosition.current
    }

    return constrainedPos
  }

  // Controles de vista (P para externa, O para interna, S para cúpula, U para reset)
  useEffect(() => {
    const handleViewControls = (e) => {
      // Vista externa con P
      if (e.code === 'KeyP') {
        e.preventDefault()
        
        if (!externalViewActive.current) {
          // Activar vista externa
          externalViewActive.current = true
          cupolaViewActive.current = false
          
          // Guardar posición y rotación actual del jugador
          if (playerRef.current) {
            savedPlayerPosition.current.copy(playerRef.current.position)
            savedMouseRotation.current = { ...mouseRotation.current }
          }
          
          // Salir de pointer lock
          if (document.pointerLockElement) {
            document.exitPointerLock()
          }
        }
      }
      
      // Vista interna con O
      if (e.code === 'KeyO') {
        e.preventDefault()
        
        if (externalViewActive.current) {
          // Volver a vista interna
          externalViewActive.current = false
          
          // Restaurar posición y rotación del jugador
          if (playerRef.current) {
            playerRef.current.position.copy(savedPlayerPosition.current)
            mouseRotation.current = { ...savedMouseRotation.current }
          }
        }
      }
      
      // Vista rápida a cúpula con V (solo en modo interno)
      if (e.code === 'KeyV' && !externalViewActive.current) {
        e.preventDefault()
        
        if (!cupolaViewActive.current) {
          cupolaViewActive.current = true
          
          if (playerRef.current) {
            // Posicionar en la cúpula
            playerRef.current.position.set(0, 8, 0)
            velocity.current.set(0, 0, 0)
          }
          
          mouseRotation.current.x = 0
          mouseRotation.current.y = Math.PI * 0.7
          
        } else {
          cupolaViewActive.current = false
        }
      }
      
      // Reset con U
      if (e.code === 'KeyU') {
        e.preventDefault()
        
        if (playerRef.current) {
          playerRef.current.position.copy(initialPosition.current)
        }
        mouseRotation.current.x = 0
        mouseRotation.current.y = 0
        velocity.current.set(0, 0, 0)
        cupolaViewActive.current = false
        externalViewActive.current = false
        
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
      }
    }

    window.addEventListener('keydown', handleViewControls)
    return () => window.removeEventListener('keydown', handleViewControls)
  }, [])

  useFrame(() => {
    if (!playerRef.current) return

    if (externalViewActive.current) {
      // === MODO VISTA EXTERNA ===
      
      // Rotación automática de la cámara orbital
      externalCameraAngle.current += 0.005
      
      // Controles opcionales de cámara externa (WASD para ajustar)
      const adjustSpeed = 0.02
      if (keys.current['a']) externalCameraAngle.current -= adjustSpeed
      if (keys.current['d']) externalCameraAngle.current += adjustSpeed
      if (keys.current['w']) externalCameraDistance.current = Math.max(15, externalCameraDistance.current - 0.5)
      if (keys.current['s']) externalCameraDistance.current = Math.min(50, externalCameraDistance.current + 0.5)
      if (keys.current['space'] || keys.current[' ']) externalCameraHeight.current += 0.3
      if (keys.current['shift']) externalCameraHeight.current -= 0.3
      
      // Posicionar cámara orbitando alrededor de la ISS
      const targetX = Math.cos(externalCameraAngle.current) * externalCameraDistance.current
      const targetZ = Math.sin(externalCameraAngle.current) * externalCameraDistance.current
      const targetY = externalCameraHeight.current
      
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1)
      camera.lookAt(0, 0, 0) // Mirar siempre al centro de la ISS
      
    } else {
      // === MODO VISTA INTERNA ===
      
      // Física de microgravedad
      if (!cupolaViewActive.current) {
        const thrust = 0.016
        const damping = 0.98
        const maxSpeed = 0.11

        // Direcciones basadas en la rotación del mouse
        const forward = new THREE.Vector3(
          Math.sin(mouseRotation.current.x),
          0,
          Math.cos(mouseRotation.current.x)
        )
        const right = new THREE.Vector3(
          Math.cos(mouseRotation.current.x),
          0,
          -Math.sin(mouseRotation.current.x)
        )
        const up = new THREE.Vector3(0, 1, 0)

        // Aplicar fuerzas de propulsión
        const dir = new THREE.Vector3()
        
        if (keys.current['w']) dir.sub(forward)
        if (keys.current['s']) dir.add(forward)
        if (keys.current['a']) dir.sub(right)
        if (keys.current['d']) dir.add(right)
        if (keys.current['space'] || keys.current[' ']) dir.add(up)
        if (keys.current['shift']) dir.sub(up)

        if (dir.lengthSq() > 0) {
          dir.normalize().multiplyScalar(thrust)
          velocity.current.add(dir)
        }

        if (velocity.current.length() > maxSpeed) {
          velocity.current.normalize().multiplyScalar(maxSpeed)
        }

        velocity.current.multiplyScalar(damping)

        // Aplicar movimiento con colisiones
        const newPosition = playerRef.current.position.clone().add(velocity.current)
        const constrainedPosition = checkInternalCollisions(newPosition)
        
        if (!constrainedPosition.equals(newPosition)) {
          velocity.current.multiplyScalar(0.2)
        }
        
        playerRef.current.position.copy(constrainedPosition)

      } else {
        // En vista cúpula: amortiguación gradual
        velocity.current.multiplyScalar(0.94)
        
        const newPosition = playerRef.current.position.clone().add(velocity.current)
        const constrainedPosition = checkInternalCollisions(newPosition)
        playerRef.current.position.copy(constrainedPosition)
      }

      // SISTEMA DE CÁMARA INTERNA CON MOUSE LOOK
      const cameraOffset = new THREE.Vector3(0, 1.4, 3)
      
      if (cupolaViewActive.current) {
        cameraOffset.set(0, 1.7, 0)
      }
      
      // Aplicar rotación del mouse a la cámara
      const targetCameraPos = playerRef.current.position.clone().add(cameraOffset)
      camera.position.lerp(targetCameraPos, cupolaViewActive.current ? 0.12 : 0.08)
      
      // Dirección de vista basada en mouse look
      const lookDirection = new THREE.Vector3(
        Math.sin(mouseRotation.current.x) * Math.cos(mouseRotation.current.y),
        Math.sin(mouseRotation.current.y),
        Math.cos(mouseRotation.current.x) * Math.cos(mouseRotation.current.y)
      )
      
      const lookAtTarget = playerRef.current.position.clone().add(lookDirection.multiplyScalar(10))
      camera.lookAt(lookAtTarget)

      // Rotación del jugador basada en el movimiento
      if (!cupolaViewActive.current) {
        // Redefinir direcciones para esta sección
        const forward = new THREE.Vector3(
          Math.sin(mouseRotation.current.x),
          0,
          Math.cos(mouseRotation.current.x)
        )
        const right = new THREE.Vector3(
          Math.cos(mouseRotation.current.x),
          0,
          -Math.sin(mouseRotation.current.x)
        )
        
        const movementDir = new THREE.Vector3()
        if (keys.current['w']) movementDir.sub(forward)
        if (keys.current['s']) movementDir.add(forward)
        if (keys.current['a']) movementDir.sub(right)
        if (keys.current['d']) movementDir.add(right)
        
        if (movementDir.lengthSq() > 0) {
          const angle = Math.atan2(movementDir.x, movementDir.z)
          playerRef.current.rotation.y = THREE.MathUtils.lerp(
            playerRef.current.rotation.y, 
            angle, 
            0.05
          )
        }
      }

      // Flotación sutil de microgravedad
      if (velocity.current.length() > 0.006) {
        const time = Date.now() * 0.0003
        playerRef.current.rotation.x = Math.sin(time * 0.6) * 0.02
        playerRef.current.rotation.z = Math.cos(time * 0.4) * 0.012
      } else {
        const time = Date.now() * 0.0006
        playerRef.current.rotation.x = Math.sin(time * 0.25) * 0.008
        playerRef.current.rotation.z = Math.cos(time * 0.15) * 0.005
      }
    }
  })

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {children}
    </group>
  )
}