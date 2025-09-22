// src/Components/phase2_NBL/UI/TrainingHUD.jsx
import React from 'react'
import { useGameState } from '../../Utils/useGameState'

export function TrainingHUD({ getStepInstructions }) {
  const { state, dispatch } = useGameState() // Get global state
  
  // Read values from global state
  const currentStep = state.nblTraining?.currentStep || 1
  const connectedBlocks = state.nblTraining?.connectedBlocks || []
  const showCompletion = state.nblTraining?.showCompletion || false

  // Default function for instructions
  const defaultGetStepInstructions = () => {
    const instructions = {
      1: "Place the Satellite Main Body on the base",
      2: "Connect the Communication Antenna on top", 
      3: "Install the Docking Ring on the front"
    }
    return instructions[currentStep] || "Training completed!"
  }

  const stepInstructions = getStepInstructions || defaultGetStepInstructions

  return (
    <>
      {/* Controls HUD (Fixed) - DOM only */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, rgba(0,60,120,0.9), rgba(0,100,150,0.9))',
        padding: '15px 20px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        border: '2px solid #4da6ff',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        zIndex: 1000,
        minWidth: '280px'
      }}>
        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px'
        }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>🏊‍♂️</span>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#87ceeb' }}>
            NBL TRAINING
          </h3>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>🎮</span> <strong>WASD</strong> - Horizontal movement
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>⌨️</span> <strong>SPACE</strong> - Go up
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>⬇️</span> <strong>SHIFT</strong> - Go down
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>🖱️</span> <strong>Mouse</strong> - Look around
          </div>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: '#00ff88' }}>🔧</span> <strong>E</strong> - Grab | <strong>Q</strong> - Release
          </div>
        </div>

        {/* Current mission */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          marginBottom: '12px'
        }}>
          <h4 style={{ 
            margin: '0 0 8px', 
            fontSize: '14px', 
            color: '#00ff88'
          }}>
            🎯 MISSION: SATELLITE ASSEMBLY
          </h4>
          
          <p style={{ fontSize: '12px', margin: '4px 0', lineHeight: '1.4' }}>
            <strong>Step {currentStep}/3:</strong> {stepInstructions()}
          </p>
          
          <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
            1. Approach the floating components<br/>
            2. Press E nearby to grab them<br/>
            3. Take each piece to the correct green point<br/>
            4. Press Q near the point to connect
          </div>
        </div>

        {/* Progress */}
        <div style={{
          background: 'rgba(40,167,69,0.3)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #28a745',
          marginBottom: '10px'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            📊 PROGRESS: {connectedBlocks.length}/3 modules
          </div>
          
          {/* Progress bar */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #28a745, #00ff88)',
              height: '100%',
              width: `${(connectedBlocks.length / 3) * 100}%`,
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Completion message */}
      {showCompletion && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(40,167,69,0.95), rgba(0,100,0,0.95))',
          color: '#fff',
          padding: '25px 35px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '3px solid #28a745',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 1001
        }}>
          <h2 style={{ margin: '0 0 15px', fontSize: '24px' }}>🎉 SATELLITE ASSEMBLED!</h2>
          <p style={{ margin: '10px 0', fontSize: '16px' }}>
            Complete structure: ✅ Body + Antenna + Docking Ring
          </p>
          <p style={{ margin: '10px 0', fontSize: '14px', opacity: 0.9 }}>
            Starting transfer to ISS...
          </p>
        </div>
      )}
    </>
  )
}