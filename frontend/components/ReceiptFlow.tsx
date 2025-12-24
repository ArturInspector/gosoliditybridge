'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from './store'

interface ReceiptFlowProps {
  replayAttack: boolean
}

/**
 * ReceiptFlow: Animated particle stream representing a signed receipt
 * Travels from off-chain node to verifier, then to on-chain node
 * In replay attack mode, shows a second receipt that gets blocked
 */
export default function ReceiptFlow({ replayAttack }: ReceiptFlowProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const receiptBlockRef = useRef<THREE.Mesh>(null)
  const [progress, setProgress] = useState(0)
  const { setAnimating } = useAppStore()

  // Create particle system for the receipt stream
  const particleCount = 50
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = -4 + (i / particleCount) * 4
    positions[i3 + 1] = 1 + Math.sin(i * 0.5) * 0.3
    positions[i3 + 2] = Math.cos(i * 0.3) * 0.2

    // Blue-green glow for valid receipt
    colors[i3] = 0.2
    colors[i3 + 1] = 0.8
    colors[i3 + 2] = 1.0
  }

  useEffect(() => {
    setProgress(0)
    const duration = 3000 // 3 seconds
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete
        setTimeout(() => {
          setAnimating(false)
        }, 1000)
      }
    }

    animate()
  }, [setAnimating, replayAttack])

  useFrame(() => {
    if (particlesRef.current) {
      // Update particle positions based on progress
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const startX = -4
      const endX = replayAttack ? 0 : 4 // Stop at verifier if replay attack
      const currentX = startX + (endX - startX) * progress

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const offset = (i / particleCount) * 2
        positions[i3] = currentX - offset
        positions[i3 + 1] = 1 + Math.sin((i + Date.now() * 0.001) * 0.5) * 0.3
        positions[i3 + 2] = Math.cos((i + Date.now() * 0.001) * 0.3) * 0.2
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate receipt block (JSON-like structure)
    if (receiptBlockRef.current) {
      const startX = -4
      const endX = replayAttack ? 0 : 4
      const currentX = startX + (endX - startX) * progress
      receiptBlockRef.current.position.x = currentX
      receiptBlockRef.current.position.y = 1.5
      
      receiptBlockRef.current.rotation.y += 0.02
    }
  })

  return (
    <group>
      {/* Particle stream representing the receipt data */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Receipt block visualization (glowing JSON sigil) */}
      <mesh ref={receiptBlockRef} position={[-4, 1.5, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Label for the receipt */}
      {progress > 0.1 && progress < 0.9 && (
        <Text
          position={[receiptBlockRef.current?.position.x || 0, 2.2, 0]}
          fontSize={0.2}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          Signed Receipt
        </Text>
      )}

      {/* Replay attack: show blocked receipt */}
      {replayAttack && progress > 0.5 && (
        <group>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.4, 0.6, 0.1]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
          <Text
            position={[0, 2.2, 0]}
            fontSize={0.2}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            Replay Blocked
          </Text>
        </group>
      )}
    </group>
  )
}

