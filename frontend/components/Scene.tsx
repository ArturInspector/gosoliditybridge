'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import OffChainNode from './OffChainNode'
import ReceiptFlow from './ReceiptFlow'
import Verifier from './Verifier'
import OnChainNode from './OnChainNode'
import { useAppStore } from './store'

export default function Scene() {
  const { isAnimating, replayAttack } = useAppStore()
  
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.8} />

      {/* Grid floor for depth reference */}
      <gridHelper args={[20, 20, '#1a1a1a', '#0f0f0f']} position={[0, -1, 0]} />

      {/* Left: Off-chain world */}
      <group position={[-4, 0, 0]}>
        <OffChainNode />
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
        >
          Off-chain Service (Go)
        </Text>
      </group>

      {/* Center: Trust boundary / Verifier */}
      <group position={[0, 0, 0]}>
        <Verifier />
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
        >
          Signature Verification (ECDSA)
        </Text>
      </group>

      {/* Right: On-chain world */}
      <group position={[4, 0, 0]}>
        <OnChainNode />
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
        >
          Smart Contract (Solidity)
        </Text>
      </group>

      {/* Animated receipt flow */}
      {isAnimating && <ReceiptFlow key={`${isAnimating}-${replayAttack}`} replayAttack={replayAttack} />}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
    </>
  )
}

