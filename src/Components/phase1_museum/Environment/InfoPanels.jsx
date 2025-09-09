// InfoPanels.jsx
import { Html } from '@react-three/drei'

export function InfoPanels() {
  return (
    <group>
      <mesh position={[0, 2, -9.5]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#222" />
        <Html center>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <h3>ISS - 25 años</h3>
            <p>Explora la historia de la Estación Espacial Internacional</p>
          </div>
        </Html>
      </mesh>
    </group>
  )
}
