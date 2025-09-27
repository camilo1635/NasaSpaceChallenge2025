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
  const externalCameraDistance = useRef(85)
  const externalCameraAngle = useRef(0)
  const externalCameraHeight = useRef(30)
  
  // Posiciones guardadas para vista externa
  const savedPlayerPosition = useRef(new THREE.Vector3(9.96, 0.00, 25.96))
  const savedPlayerRotation = useRef({ x: 0, y: 0 })
  
  // Posición fija estratégica - NUEVA POSICIÓN CENTRAL
  const fixedPosition = useRef(new THREE.Vector3(-27, 0.00, 3))

  // ======= SISTEMA SIMPLE DE MAPEO DE CILINDROS =======
  const cylinderMapping = useRef({
    startPoint: null,
    endPoint: null,
    isRecording: false
  })

  const recordCylinderPoint = () => {
    if (!playerRef.current) return

    const currentPos = playerRef.current.position.clone()
    
    if (!cylinderMapping.current.startPoint) {
      // Primera presión de H: marcar punto inicial
      cylinderMapping.current.startPoint = currentPos
      cylinderMapping.current.isRecording = true
      console.log('\n🟢 PUNTO INICIAL DEL CILINDRO:')
      console.log(`   X: ${currentPos.x.toFixed(2)}`)
      console.log(`   Y: ${currentPos.y.toFixed(2)}`)
      console.log(`   Z: ${currentPos.z.toFixed(2)}`)
      console.log('   Muévete al punto final y presiona H de nuevo')
      
    } else if (!cylinderMapping.current.endPoint) {
      // Segunda presión de H: marcar punto final y calcular cilindro
      cylinderMapping.current.endPoint = currentPos
      cylinderMapping.current.isRecording = false
      
      console.log('\n🔴 PUNTO FINAL DEL CILINDRO:')
      console.log(`   X: ${currentPos.x.toFixed(2)}`)
      console.log(`   Y: ${currentPos.y.toFixed(2)}`)
      console.log(`   Z: ${currentPos.z.toFixed(2)}`)
      
      // Calcular datos del cilindro
      const start = cylinderMapping.current.startPoint
      const end = cylinderMapping.current.endPoint
      
      // Centro del cilindro (punto medio)
      const center = new THREE.Vector3(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        (start.z + end.z) / 2
      )
      
      // Vector direccional y longitud
      const direction = end.clone().sub(start)
      const length = direction.length()
      
      // Determinar eje principal
      const absX = Math.abs(direction.x)
      const absY = Math.abs(direction.y)
      const absZ = Math.abs(direction.z)
      
      let axis, axisMin, axisMax
      
      if (absX > absY && absX > absZ) {
        axis = 'x'
        axisMin = Math.min(start.x, end.x)
        axisMax = Math.max(start.x, end.x)
      } else if (absZ > absY) {
        axis = 'z'
        axisMin = Math.min(start.z, end.z)
        axisMax = Math.max(start.z, end.z)
      } else {
        axis = 'y'
        axisMin = Math.min(start.y, end.y)
        axisMax = Math.max(start.y, end.y)
      }
      
      console.log('\n🔧 DATOS DEL CILINDRO GENERADO:')
      console.log('=====================================')
      console.log('{')
      console.log(`  center: [${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}],`)
      console.log(`  axis: '${axis}',`)
      console.log(`  radius: 2.0, // AJUSTAR MANUALMENTE`)
      console.log(`  ${axis}Min: ${axisMin.toFixed(2)},`)
      console.log(`  ${axis}Max: ${axisMax.toFixed(2)}`)
      console.log('}')
      console.log('=====================================')
      console.log(`Longitud del eje: ${length.toFixed(2)} unidades`)
      console.log('Ajusta el radio según necesites y agrégalo al array modules')
      console.log('Presiona H de nuevo para mapear otro cilindro\n')
      
      // Reset para el siguiente cilindro
      cylinderMapping.current.startPoint = null
      cylinderMapping.current.endPoint = null
      
    } else {
      // Si ya hay dos puntos, empezar un nuevo cilindro
      cylinderMapping.current.startPoint = currentPos
      cylinderMapping.current.endPoint = null
      cylinderMapping.current.isRecording = true
      console.log('\n🆕 NUEVO CILINDRO - PUNTO INICIAL:')
      console.log(`   X: ${currentPos.x.toFixed(2)}`)
      console.log(`   Y: ${currentPos.y.toFixed(2)}`)
      console.log(`   Z: ${currentPos.z.toFixed(2)}`)
      console.log('   Muévete al punto final y presiona H de nuevo')
    }
  }

  // Manejo de teclado (SIN WASD para movimiento)
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

  // Controles de vista y mapeo
  useEffect(() => {
    const handleViewControls = (e) => {
      // NUEVO: Mapeo de cilindros con H
      if (e.code === 'KeyH') {
        e.preventDefault()
        recordCylinderPoint()
      }
      
      // Vista externa con P
      if (e.code === 'KeyP') {
        e.preventDefault()
        
        if (!externalViewActive.current) {
          externalViewActive.current = true
          cupolaViewActive.current = false
          
          if (playerRef.current) {
            savedPlayerPosition.current.copy(playerRef.current.position)
            savedPlayerRotation.current = { ...playerRotation.current }
          }
          
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
      if (e.code === 'KeyV' && !externalViewActive.current) {
        e.preventDefault()
        
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
      // === MODO VISTA INTERNA - SINCRONIZADO CON ROTACIÓN ISS ===
      
      // MANTENER POSICIÓN FIJA RELATIVA A LA ISS
      playerRef.current.position.copy(fixedPosition.current)
      
      // *** ROTAR EL PERSONAJE CON LA MISMA VELOCIDAD QUE LA ISS ***
      // Esta es la MISMA rotación que se aplica en ISSEnvironment.jsx
      playerRef.current.rotation.y += 0.001

      if (!cupolaViewActive.current) {
        // Vista de tercera persona: solo la cámara gira, el personaje rota con la ISS
        const cameraDistance = 2 // Distancia de la cámara al personaje
        const cameraHeight = 1 // Altura relativa de la cámara
        
        // Calcular posición de cámara basada SOLO en rotación del mouse
        const cameraX = playerRef.current.position.x + Math.sin(playerRotation.current.x) * cameraDistance * Math.cos(playerRotation.current.y)
        const cameraY = playerRef.current.position.y + cameraHeight + Math.sin(playerRotation.current.y) * cameraDistance
        const cameraZ = playerRef.current.position.z + Math.cos(playerRotation.current.x) * cameraDistance * Math.cos(playerRotation.current.y)
        
        const targetCameraPos = new THREE.Vector3(cameraX, cameraY, cameraZ)
        camera.position.lerp(targetCameraPos, 0.1)
        
        // La cámara siempre mira al personaje (que rota con la ISS)
        const playerCenter = playerRef.current.position.clone().add(new THREE.Vector3(0, 1, 0))
        camera.lookAt(playerCenter)
        
      } else {
        // Vista cúpula - movimiento temporal permitido, pero también sincronizado
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
    <group ref={playerRef} position={[9.96, 0.00, 25.96]}>
      {children}
    </group>
  )
}