// src/Components/phase2_nbl/Objects/ISSModuleB.jsx
import React from 'react'

export function ISSModuleB({ position = [8, 2, -5] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[2, 2, 10, 32]} />
      <meshStandardMaterial color="#999" metalness={0.7} roughness={0.4} />
    </mesh>
  )
}
