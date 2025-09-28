// src/Components/phase1_museum/MuseumScene.jsx
import React, { Suspense, useRef, useEffect } from 'react'
import { MuseumRoom } from './Environment/MuseumRoom'
import { InfoPanels } from './Interactive/InfoPanels'
import { SimpleHUD } from './UI/SimpleHUD'
import { PlayerControls } from './Character/PlayerControls'
import { Player } from './Character/Player'
import { SimpleDoor } from './Interactive/SimpleDoor'

function MuseumScene() {
  const controls = useRef()

  useEffect(() => {
    if (controls.current) {
      controls.current.enablePan = false
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        {/* ===== ILUMINACIÓN ===== */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-5, 2, -3]} intensity={0.3} color="#4da6ff" />
        <pointLight position={[5, 2, -3]} intensity={0.3} color="#ff6b4d" />

        {/* ===== ESCENARIO ===== */}
        {/* Museo con carteles informativos */}
        <MuseumRoom />

        {/* Paneles decorativos adicionales */}
        <InfoPanels />

        {/* ===== PUERTA DE TRANSICIÓN ===== */}
        <SimpleDoor position={[0, 2.5, -15]} />

        {/* ===== JUGADOR ===== */}
        <PlayerControls>
          <Player />
        </PlayerControls>
      </Suspense>

    </>
  )
}

export default MuseumScene