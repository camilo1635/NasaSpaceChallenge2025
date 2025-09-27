// src/Components/phase3_ISS/ISSPlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function ISSPlayerControls({ children }) {
  const playerRef = useRef()
  const { camera } = useThree()
  const keys = useRef({})
  
  // Rotación unificada para jugador y mouse
  const playerRotation = useRef({ x: 0, y: 0 })
  
  // Estados de vista
  const externalViewActive = useRef(false)
  const cupolaViewActive = useRef(false)
  const isPointerLocked = useRef(false)
  
  // Configuración de vista externa
  const externalCameraDistance = useRef(50)
  const externalCameraAngle = useRef(0)
  const externalCameraHeight = useRef(18)
  
  // Posición fija estratégica - NUEVA POSICIÓN CENTRAL
  const fixedPosition = useRef(new THREE.Vector3(-27, 0.00, 3))

  // Manejo de teclado simplificado
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
      playerRotation.current.x -= e.movementX * sensitivity
      playerRotation.current.y -= e.movementY * sensitivity
      
      // Limitar rotación vertical
      playerRotation.current.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, playerRotation.current.y))
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

  // Controles de vista simplificados
  useEffect(() => {
    const handleViewControls = (e) => {
      // Vista externa con P
      if (e.code === 'KeyP') {
        e.preventDefault()
        
        if (!externalViewActive.current) {
          externalViewActive.current = true
          cupolaViewActive.current = false
          
          if (document.pointerLockElement) {
            document.exitPointerLock()
          }
        }
      }
      
      // Vista interna con O - REGRESA A POSICIÓN FIJA
      if (e.code === 'KeyO') {
        e.preventDefault()
        
        if (externalViewActive.current) {
          externalViewActive.current = false
          
          if (playerRef.current) {
            // Regresar a la posición fija estratégica
            playerRef.current.position.copy(fixedPosition.current)
            playerRotation.current = { x: 0, y: 0 }
          }
        }
      }
      
      // Vista rápida a cúpula con V
      if (e.code === 'KeyV') {
        e.preventDefault()
        
        if (!externalViewActive.current) {
          if (!cupolaViewActive.current) {
            cupolaViewActive.current = true
            
            if (playerRef.current) {
              playerRef.current.position.set(0, 8, 0)
            }
            
            playerRotation.current.x = 0
            playerRotation.current.y = Math.PI * 0.7
            
          } else {
            cupolaViewActive.current = false
            // Al salir de vista cúpula, regresar a posición fija
            if (playerRef.current) {
              playerRef.current.position.copy(fixedPosition.current)
              playerRotation.current = { x: 0, y: 0 }
            }
          }
        }
      }
      
      // Reset con U - REGRESA A POSICIÓN FIJA
      if (e.code === 'KeyU') {
        e.preventDefault()
        
        if (playerRef.current) {
          playerRef.current.position.copy(fixedPosition.current)
        }
        playerRotation.current.x = 0
        playerRotation.current.y = 0
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
      
      externalCameraAngle.current += 0.005
      
      const adjustSpeed = 0.02
      if (keys.current['a']) externalCameraAngle.current -= adjustSpeed
      if (keys.current['d']) externalCameraAngle.current += adjustSpeed
      if (keys.current['w']) externalCameraDistance.current = Math.max(15, externalCameraDistance.current - 0.5)
      if (keys.current['s']) externalCameraDistance.current = Math.min(50, externalCameraDistance.current + 0.5)
      if (keys.current['space'] || keys.current[' ']) externalCameraHeight.current += 0.3
      if (keys.current['shift']) externalCameraHeight.current -= 0.3
      
      const targetX = Math.cos(externalCameraAngle.current) * externalCameraDistance.current
      const targetZ = Math.sin(externalCameraAngle.current) * externalCameraDistance.current
      const targetY = externalCameraHeight.current
      
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1)
      camera.lookAt(0, 0, 0)
      
    } else {
      // === MODO VISTA INTERNA - POSICIÓN FIJA ===
      
      // MANTENER POSICIÓN FIJA RELATIVA A LA ISS
      playerRef.current.position.copy(fixedPosition.current)
      
      // Rotar el personaje con la misma velocidad que la ISS
      playerRef.current.rotation.y += 0.001

      if (!cupolaViewActive.current) {
        // Vista de tercera persona: solo la cámara gira, el personaje rota con la ISS
        const cameraDistance = 2
        const cameraHeight = 1
        
        // Calcular posición de cámara basada SOLO en rotación del mouse
        const cameraX = playerRef.current.position.x + Math.sin(playerRotation.current.x) * cameraDistance * Math.cos(playerRotation.current.y)
        const cameraY = playerRef.current.position.y + cameraHeight + Math.sin(playerRotation.current.y) * cameraDistance
        const cameraZ = playerRef.current.position.z + Math.cos(playerRotation.current.x) * cameraDistance * Math.cos(playerRotation.current.y)
        
        const targetCameraPos = new THREE.Vector3(cameraX, cameraY, cameraZ)
        camera.position.lerp(targetCameraPos, 0.1)
        
        // La cámara siempre mira al personaje
        const playerCenter = playerRef.current.position.clone().add(new THREE.Vector3(0, 1, 0))
        camera.lookAt(playerCenter)
        
      } else {
        // Vista cúpula
        const cameraOffset = new THREE.Vector3(0, 3, 3)
        const rotatedOffset = cameraOffset.clone().applyAxisAngle(
          new THREE.Vector3(0, 1, 0), 
          playerRotation.current.x
        )
        
        const pitchMatrix = new THREE.Matrix4().makeRotationX(playerRotation.current.y * 0.5)
        rotatedOffset.applyMatrix4(pitchMatrix)
        
        const targetCameraPos = playerRef.current.position.clone().add(rotatedOffset)
        camera.position.lerp(targetCameraPos, 0.12)
        
        const playerHeadPosition = playerRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0))
        camera.lookAt(playerHeadPosition)
      }
    }
  })

  // Establecer posición inicial al montar el componente
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.copy(fixedPosition.current)
    }
  }, [])

  return (
    <group ref={playerRef} position={[-27, 0.00, 3]}>
      {children}
    </group>
  )
}