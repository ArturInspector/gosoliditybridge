'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from './store'

/**
 * OffChainNode: Represents the off-chain service (Go backend)
 * Visualizes as a glowing cube that pulses when active
 * This is where payment receipts are generated and signed
 * 
 * THREE.JS RENDERING PIPELINE:
 * 1. Geometry Creation: boxGeometry creates a 3D box mesh with vertices, edges, faces
 *    - args=[width, height, depth] defines the box dimensions
 *    - Three.js internally creates vertex buffer (positions, normals, UVs)
 * 2. Material: meshStandardMaterial uses PBR (Physically Based Rendering)
 *    - color: base color in hex (#3b82f6 = blue)
 *    - emissive: self-illumination color (makes it glow)
 *    - emissiveIntensity: how bright the glow is (0-1)
 *    - metalness: 0.8 = 80% metallic (affects reflections)
 *    - roughness: 0.2 = smooth surface (low roughness = shiny)
 * 3. useFrame: Called every frame (~60fps) before render
 *    - state.clock.getElapsedTime() = seconds since scene start
 *    - Math.sin() creates smooth oscillating motion
 *    - Direct mesh manipulation via ref (imperative Three.js API)
 * 4. Transform Hierarchy: mesh is inside <group> for organization
 *    - position=[x, y, z] in world space coordinates
 *    - scale/rotation applied in order: scale → rotation → translation
 */
export default function OffChainNode() {
  // useRef stores a reference to the Three.js Mesh object
  // This allows direct access to Three.js native API for performance
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { setHoveredNode } = useAppStore()

  /**
   * useFrame: React Three Fiber hook that runs every frame
   * This is where we update animations before rendering
   * 
   * RENDERING LOOP:
   * 1. useFrame executes (60fps)
   * 2. Update mesh transforms (rotation, scale)
   * 3. React Three Fiber reconciles changes
   * 4. Three.js WebGLRenderer draws to canvas
   * 5. GPU processes vertices through vertex/fragment shaders
   */
  useFrame((state) => {
    if (meshRef.current) {
      // state.clock: Three.js Clock object tracking elapsed time
      // Used for time-based animations (independent of frame rate)
      const time = state.clock.getElapsedTime()
      
      // Rotation: Y-axis rotation creates spinning effect
      // Math.sin(time * 0.5) oscillates between -1 and 1
      // * 0.1 limits rotation to ±0.1 radians (~6 degrees)
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
      
      // Scale: Pulsing effect (breathing animation)
      // Math.sin(time * 2) oscillates faster (2x frequency)
      // + 1 shifts range from [0, 2] instead of [-1, 1]
      // * 0.05 = 5% size variation
      const scale = 1 + Math.sin(time * 2) * 0.05
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group>
      {/* 
        MAIN CUBE: Primary visual element
        - boxGeometry: Creates 8 vertices forming a cube
        - Three.js generates 12 triangles (2 per face) for GPU rendering
        - Each vertex has: position (x,y,z), normal (for lighting), UV (for textures)
      */}
      <mesh
        ref={meshRef}
        position={[0, 1, 0]}
        // Raycasting: React Three Fiber handles mouse/touch intersection
        // onPointerOver fires when raycast hits this mesh
        onPointerOver={(e) => {
          e.stopPropagation() // Prevent event bubbling to parent groups
          setHovered(true)
          setHoveredNode('offchain')
        }}
        onPointerOut={() => {
          setHovered(false)
          setHoveredNode(null)
        }}
      >
        {/* 
          GEOMETRY: Defines the 3D shape
          - args: [width, height, depth] in Three.js units
          - Internally creates Float32Array buffers for GPU
          - Vertices stored in attribute buffers (positions, normals, uvs)
        */}
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        
        {/* 
          MATERIAL: Defines surface appearance
          - meshStandardMaterial: PBR material (responds to lights)
          - Shader compilation: Three.js compiles to GLSL shaders
          - Vertex shader: Transforms 3D positions to 2D screen space
          - Fragment shader: Calculates pixel colors (lighting, reflections)
        */}
        <meshStandardMaterial
          color={hovered ? '#4ade80' : '#3b82f6'} // Base color (RGB)
          emissive={hovered ? '#4ade80' : '#3b82f6'} // Self-illumination
          emissiveIntensity={hovered ? 0.8 : 0.4} // Glow brightness
          metalness={0.8} // 0=dielectric, 1=metal (affects reflections)
          roughness={0.2} // 0=smooth/mirror, 1=rough/matte
        />
      </mesh>
      
      {/* 
        GLOW EFFECT: Layered rendering technique
        - Larger, semi-transparent cube behind main cube
        - Creates "halo" effect through additive blending
        - opacity + transparent: Enables alpha blending
        - Rendered after main cube (order matters for transparency)
      */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent // Enables alpha channel
          opacity={0.2} // 20% visible (80% transparent)
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

