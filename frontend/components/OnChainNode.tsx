'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from './store'

/**
 * OnChainNode: Smart contract on Ethereum-like blockchain
 * Visualized as stacked blocks (blockchain) with a contract node
 * Emits mint animation when receipt is accepted
 */
export default function OnChainNode() {
  const contractRef = useRef<THREE.Mesh>(null)
  const blocksRef = useRef<THREE.Group>(null)
  const mintParticleRef = useRef<THREE.Points>(null)
  const [hovered, setHovered] = useState(false)
  const { isAnimating, replayAttack, setHoveredNode } = useAppStore()
  const [mintActive, setMintActive] = useState(false)

  // Trigger mint animation when receipt arrives
  useEffect(() => {
    if (isAnimating && !replayAttack) {
      const timer = setTimeout(() => {
        setMintActive(true)
        setTimeout(() => setMintActive(false), 2000)
      }, 2500) // After receipt travels
      return () => clearTimeout(timer)
    }
  }, [isAnimating, replayAttack])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Subtle rotation of contract node
    if (contractRef.current) {
      contractRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
    }

    // Mint particle animation
    if (mintParticleRef.current && mintActive) {
      const positions = mintParticleRef.current.geometry.attributes.position.array as Float32Array
      const count = positions.length / 3

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const angle = (i / count) * Math.PI * 2
        const radius = time * 0.5
        positions[i3] = 4 + Math.cos(angle) * radius
        positions[i3 + 1] = 1.5 + Math.sin(angle) * radius + time * 0.3
        positions[i3 + 2] = Math.sin(angle * 2) * radius * 0.5
      }

      mintParticleRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Create mint particles
  const mintParticleCount = 30
  const mintPositions = new Float32Array(mintParticleCount * 3)
  const mintColors = new Float32Array(mintParticleCount * 3)

  for (let i = 0; i < mintParticleCount; i++) {
    const i3 = i * 3
    mintPositions[i3] = 4
    mintPositions[i3 + 1] = 1.5
    mintPositions[i3 + 2] = 0

    // Gold/yellow for minted token
    mintColors[i3] = 1.0
    mintColors[i3 + 1] = 0.8
    mintColors[i3 + 2] = 0.2
  }

  return (
    <group>
      {/* Blockchain blocks (stacked) */}
      <group ref={blocksRef} position={[4, -0.5, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.3, 0]}>
            <boxGeometry args={[0.8, 0.25, 0.8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              emissive="#4a4a4a"
              emissiveIntensity={0.1}
              metalness={0.5}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Smart contract node */}
      <mesh
        ref={contractRef}
        position={[4, 1, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          setHoveredNode('onchain')
        }}
        onPointerOut={() => {
          setHovered(false)
          setHoveredNode(null)
        }}
      >
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={hovered ? '#f59e0b' : '#8b5cf6'}
          emissive={hovered ? '#f59e0b' : '#8b5cf6'}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Mint particles (when receipt is accepted) */}
      {mintActive && (
        <points ref={mintParticleRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={mintParticleCount}
              array={mintPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={mintParticleCount}
              array={mintColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Mint label */}
      {mintActive && (
        <Text
          position={[4, 2.5, 0]}
          fontSize={0.25}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          ✓ MINTED
        </Text>
      )}
    </group>
  )
}



