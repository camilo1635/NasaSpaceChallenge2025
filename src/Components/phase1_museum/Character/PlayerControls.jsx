// src/Components/phase1_museum/Character/PlayerControls.jsx
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function PlayerControls({ children, onMove }) {
  const playerRef = useRef()
  const { camera, gl } = useThree()
  const keys = useRef({})
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

  // Manejo de ratón (rotación cámara)
  useEffect(() => {
    const onMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        rotation.current.x -= e.movementX * 0.002
        rotation.current.y -= e.movementY * 0.002
        rotation.current.y = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, rotation.current.y)
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

  // Animación frame a frame
  useFrame(() => {
    if (!playerRef.current) return

    const speed = 0.1
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

    // Movimiento WASD
    const dir = new THREE.Vector3()
    if (keys.current['w']) dir.sub(forward)
    if (keys.current['s']) dir.add(forward)
    if (keys.current['a']) dir.sub(right)
    if (keys.current['d']) dir.add(right)

    dir.normalize().multiplyScalar(speed)
    playerRef.current.position.add(dir)

    // Límites dentro del pasillo
    const pos = playerRef.current.position
    pos.x = Math.max(-2.5, Math.min(2.5, pos.x)) // entre paredes
    pos.z = Math.max(-18, Math.min(18, pos.z))   // inicio y final

    // Cámara detrás del jugador
    const cameraOffset = new THREE.Vector3(0, 2, 5)
    const offsetRotated = cameraOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1,0), rotation.current.x)

    camera.position.copy(
      playerRef.current.position.clone().add(offsetRotated)
    )
    camera.lookAt(
      playerRef.current.position.clone().add(new THREE.Vector3(0, 1, 0))
    )

    // Rotar al jugador en dirección de movimiento
    if (dir.lengthSq() > 0) {
      const angle = Math.atan2(dir.x, dir.z)
      playerRef.current.rotation.y = angle
    }

    // Reportar la posición del jugador en cada frame
    if (onMove) {
      const { x, y, z } = playerRef.current.position
      onMove([x, y, z])
    }
  })

  return (
    <group ref={playerRef} position={[0, 1, 15]}>
      {children}
    </group>
  )
}