'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from '@/components/Scene'
import Controls from '@/components/Controls'
import MemesSection from '@/components/MemesSection'

export default function Home() {
  return (
    <main>
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <h1 className="title">Off-Chain ↔ On-Chain Ramp via Signed Attestations</h1>
      <Controls />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <MemesSection />
      </div>
    </main>
  )
}

