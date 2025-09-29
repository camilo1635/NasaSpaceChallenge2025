// src/Components/phase2_NBL/NBLScene.jsx
import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { UnderwaterEnvironment } from './UnderwaterEnvironment'
import { FloatingPlayer } from './FloatingPlayer'
import { TrainingTasks } from './TrainingTasks'
import { TrainingHUD } from './UI/TrainingHUD'
import { ParticleSystem } from './ParticleSystem'
import { Player } from '../../Components/phase1_museum/Character/Player'
import { NBLPlayerControls } from './NBLPlayerControls'
import { BuoyancyCalibration } from './BuoyancyCalibration'

export function NBLScene() {
  const [calibrationData, setCalibrationData] = useState(null)
  const [showCalibration, setShowCalibration] = useState(true)

  const handleCalibrationComplete = (data) => {
    setCalibrationData(data)
    setShowCalibration(false)
    console.log('✅ Calibration completed:', data)
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* Buoyancy calibration screen */}
      {showCalibration && (
        <BuoyancyCalibration onCalibrationComplete={handleCalibrationComplete} />
      )}

      {/* NBL 3D Scene */}
      {!showCalibration && (
        <>
          <Canvas 
            camera={{ position: [0, 5, 10], fov: 60 }}
            gl={{ antialias: true, shadowMap: true }}
            shadows
          >
            <Suspense fallback={null}>
              {/* Enhanced underwater lighting */}
              <ambientLight intensity={0.6} color="#4da6ff" />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1.5}
                color="#87ceeb"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              
              {/* Brighter underwater lights */}
              <pointLight position={[0, 10, 0]} intensity={2} color="#00bfff" />
              <pointLight position={[-10, 5, -5]} intensity={1.2} color="#4169e1" />
              <pointLight position={[10, 5, -5]} intensity={1.2} color="#00ced1" />
              <pointLight position={[0, 2, 0]} intensity={1.5} color="#ffffff" />
              
              {/* Underwater environment */}
              <UnderwaterEnvironment />
              
              {/* Particle system (bubbles) */}
              <ParticleSystem />
              
              {/* Training tasks */}
              <TrainingTasks />
              
              {/* Player with NBL controls and buoyancy data */}
              <NBLPlayerControls buoyancyData={calibrationData}>
                <Player />
              </NBLPlayerControls>
            </Suspense>
          </Canvas>
          
          {/* Training HUD */}
          <TrainingHUD />

          {/* Buoyancy HUD - Top right */}
          {calibrationData && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '10px',
              background: 'rgba(15, 23, 42, 0.95)',
              padding: '15px 20px',
              borderRadius: '12px',
              border: '2px solid rgba(59, 130, 246, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              color: '#fff',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              minWidth: '220px',
              zIndex: 100,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>🌊</span>
                Buoyancy Status
              </div>
              
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>User weight:</span>
                  <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>{calibrationData.userWeight} kg</span>
                </div>
                
                <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>EMU Suit:</span>
                  <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>+180 kg</span>
                </div>
                
                <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Added weights:</span>
                  <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>+{calibrationData.addedWeights} kg</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Floats:</span>
                  <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>-{calibrationData.addedFloats} kg</span>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '8px',
                padding: '8px 12px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ 
                  color: '#22c55e', 
                  fontWeight: 'bold',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '16px' }}>✅</span>
                  NEUTRAL BUOYANCY
                </span>
              </div>

              <button
                onClick={() => setShowCalibration(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.4))'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '16px' }}>🔄</span>
                Recalibrate Buoyancy
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}