// src/Components/phase2_NBL/BuoyancyCalibration.jsx
import React, { useState } from 'react'

export function BuoyancyCalibration({ onCalibrationComplete }) {
  const [step, setStep] = useState(1)
  const [userWeight, setUserWeight] = useState(70)
  const [addedWeights, setAddedWeights] = useState(0)
  const [addedFloats, setAddedFloats] = useState(0)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [testingBuoyancy, setTestingBuoyancy] = useState(false)
  const [buoyancyStatus, setBuoyancyStatus] = useState('neutral') // 'sinking', 'neutral', 'floating'

  // Calibration constants
  const SUIT_WEIGHT = 180 // kg (space suit)
  const WATER_DENSITY = 1.0
  const TARGET_BUOYANCY = 0 // Perfect neutral buoyancy

  // Calculate current buoyancy
  const calculateBuoyancy = () => {
    const totalWeight = userWeight + SUIT_WEIGHT + addedWeights - addedFloats
    // Effective weight - if positive it sinks, if negative it floats
    const effectiveWeight = totalWeight - 250 // 250 kg is the target neutral weight
    return effectiveWeight
  }

  const getBuoyancyStatus = () => {
    const buoyancy = calculateBuoyancy()
    if (buoyancy > 2) return 'sinking' // More weight = sinks
    if (buoyancy < -2) return 'floating' // Less weight = floats
    return 'neutral'
  }

  const testBuoyancy = () => {
    setTestingBuoyancy(true)
    const status = getBuoyancyStatus()
    setBuoyancyStatus(status)
    
    setTimeout(() => {
      setTestingBuoyancy(false)
      // Always allow calibration regardless of buoyancy status
      setIsCalibrated(true)
    }, 2000)
  }

  const addWeight = (amount) => {
    setAddedWeights(prev => Math.max(0, prev + amount))
    setIsCalibrated(false)
  }

  const addFloat = (amount) => {
    setAddedFloats(prev => Math.max(0, prev + amount))
    setIsCalibrated(false)
  }

  const startTraining = () => {
    if (isCalibrated) {
      onCalibrationComplete({
        userWeight,
        addedWeights,
        addedFloats,
        buoyancyForce: calculateBuoyancy()
      })
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, #0a1929 0%, #1e3a5f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '480px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '2px solid rgba(59, 130, 246, 0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '26px', 
            margin: '0 0 4px 0',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🌊 NBL Buoyancy Calibration
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>
            Neutral Buoyancy Laboratory Training
          </p>
        </div>

        {/* Step 1: User weight */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>
              Step 1: Enter your body weight
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '13px' }}>
              In the real NBL, astronauts must record their weight before suiting up with the 180 kg EMU space suit.
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                Your weight (kg)
              </label>
              <input
                type="range"
                min="40"
                max="120"
                value={userWeight}
                onChange={(e) => setUserWeight(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  outline: 'none',
                  marginBottom: '8px'
                }}
              />
              <div style={{ 
                fontSize: '29px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                color: '#60a5fa'
              }}>
                {userWeight} kg
              </div>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: '#94a3b8' }}>Your weight:</span>
                <span style={{ fontWeight: 'bold' }}>{userWeight} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: '#94a3b8' }}>EMU Suit:</span>
                <span style={{ fontWeight: 'bold' }}>+{SUIT_WEIGHT} kg</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '13px'
              }}>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Total weight:</span>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{userWeight + SUIT_WEIGHT} kg</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Buoyancy adjustment */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '17px', marginBottom: '12px' }}>
              Step 2: Adjust your buoyancy
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '12px' }}>
              Add lead weights or foam floats until you achieve neutral buoyancy (neither sinking nor floating).
            </p>

            {/* Current status */}
            <div style={{
              background: buoyancyStatus === 'neutral' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : buoyancyStatus === 'sinking'
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(251, 191, 36, 0.1)',
              border: `2px solid ${
                buoyancyStatus === 'neutral' 
                ? 'rgba(34, 197, 94, 0.5)' 
                : buoyancyStatus === 'sinking'
                ? 'rgba(239, 68, 68, 0.5)'
                : 'rgba(251, 191, 36, 0.5)'
              }`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '19px', marginBottom: '4px' }}>
                {buoyancyStatus === 'neutral' && '✅ NEUTRAL BUOYANCY'}
                {buoyancyStatus === 'sinking' && '⬇️ SINKING'}
                {buoyancyStatus === 'floating' && '⬆️ FLOATING'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {buoyancyStatus === 'neutral' && 'Perfect! You\'re ready to train'}
                {buoyancyStatus === 'sinking' && 'Add more floats or remove weights'}
                {buoyancyStatus === 'floating' && 'Add more weights or remove floats'}
              </div>
            </div>

            {/* Weights */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                ⚖️ Lead Weights
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button onClick={() => addWeight(1)} style={buttonStyle}>+1 kg</button>
                <button onClick={() => addWeight(5)} style={buttonStyle}>+5 kg</button>
                <button onClick={() => addWeight(-1)} style={buttonStyle}>-1 kg</button>
                <button onClick={() => addWeight(-5)} style={buttonStyle}>-5 kg</button>
              </div>
              <div style={{ 
                textAlign: 'center', 
                fontSize: '17px', 
                color: '#60a5fa',
                fontWeight: 'bold'
              }}>
                {addedWeights} kg
              </div>
            </div>

            {/* Floats */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                🎈 Foam Floats
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button onClick={() => addFloat(1)} style={buttonStyle}>+1 kg</button>
                <button onClick={() => addFloat(5)} style={buttonStyle}>+5 kg</button>
                <button onClick={() => addFloat(-1)} style={buttonStyle}>-1 kg</button>
                <button onClick={() => addFloat(-5)} style={buttonStyle}>-5 kg</button>
              </div>
              <div style={{ 
                textAlign: 'center', 
                fontSize: '17px', 
                color: '#60a5fa',
                fontWeight: 'bold'
              }}>
                {addedFloats} kg
              </div>
            </div>

            {/* Summary */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Base weight + suit:</span>
                <span>{userWeight + SUIT_WEIGHT} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Added weights:</span>
                <span>+{addedWeights} kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Floats:</span>
                <span>-{addedFloats} kg</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                fontWeight: 'bold'
              }}>
                <span style={{ color: '#60a5fa' }}>Effective weight:</span>
                <span style={{ color: '#60a5fa' }}>{userWeight + SUIT_WEIGHT + addedWeights - addedFloats} kg</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={testBuoyancy}
                disabled={testingBuoyancy}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: testingBuoyancy 
                    ? 'rgba(100, 116, 139, 0.5)' 
                    : 'linear-gradient(90deg, #0891b2, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: testingBuoyancy ? 'not-allowed' : 'pointer'
                }}
              >
                {testingBuoyancy ? '🌊 Testing...' : '🧪 Test Buoyancy'}
              </button>
              
              <button
                onClick={startTraining}
                disabled={!isCalibrated}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: isCalibrated 
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : 'rgba(100, 116, 139, 0.5)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isCalibrated ? 'pointer' : 'not-allowed'
                }}
              >
                {isCalibrated ? '✅ Start Training' : '🔒 Calibrate First'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const buttonStyle = {
  flex: 1,
  padding: '8px',
  background: 'rgba(59, 130, 246, 0.2)',
  border: '1px solid rgba(59, 130, 246, 0.4)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s'
}