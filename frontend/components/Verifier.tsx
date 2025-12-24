'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from './store'

/**
 * Verifier: Cryptographic signature verification node
 * Visualizes as a floating lock/hash ring that pulses when verifying
 * Green pulse = valid signature, Red pulse = invalid/replay attack
 */
export default function Verifier() {
  const ringRef = useRef<THREE.Mesh>(null)
  const lockRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { isAnimating, replayAttack, setHoveredNode } = useAppStore()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Rotate the verification ring
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5
    }

    // Pulse animation when verifying
    if (lockRef.current && isAnimating) {
      const pulse = Math.sin(time * 10) * 0.1 + 1
      lockRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  // Determine verification status color
  const verificationColor = isAnimating
    ? replayAttack
      ? '#ef4444' // Red for blocked replay
      : '#22c55e' // Green for valid
    : '#a0a0a0' // Gray when idle

  return (
    <group>
      {/* Outer verification ring (represents hash verification) */}
      <mesh
        ref={ringRef}
        position={[0, 1, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          setHoveredNode('verifier')
        }}
        onPointerOut={() => {
          setHovered(false)
          setHoveredNode(null)
        }}
      >
        <torusGeometry args={[0.8, 0.1, 16, 32]} />
        <meshStandardMaterial
          color={verificationColor}
          emissive={verificationColor}
          emissiveIntensity={isAnimating ? 0.8 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner lock/core (represents ECDSA signature verification) */}
      <mesh ref={lockRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
        <meshStandardMaterial
          color={verificationColor}
          emissive={verificationColor}
          emissiveIntensity={isAnimating ? 0.9 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Verification status indicator */}
      {isAnimating && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.25}
          color={verificationColor}
          anchorX="center"
          anchorY="middle"
        >
          {replayAttack ? '✗ REJECTED' : '✓ VERIFIED'}
        </Text>
      )}
    </group>
  )
}



