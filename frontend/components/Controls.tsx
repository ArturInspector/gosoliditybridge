'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from './store'

/**
 * Controls: UI buttons for simulating payment and toggling replay attack
 */
export default function Controls() {
  const { isAnimating, replayAttack, setAnimating, setReplayAttack } = useAppStore()
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const handleSimulate = () => {
    if (!isAnimating) {
      setAnimating(true)
    }
  }

  const handleReplayToggle = () => {
    if (!isAnimating) {
      setReplayAttack(!replayAttack)
    }
  }

  // Show tooltip based on hovered node
  const hoveredNode = useAppStore((state) => state.hoveredNode)
  useEffect(() => {
    if (hoveredNode) {
      const tooltips: Record<string, string> = {
        offchain: 'Off-chain service generates and signs payment receipts using ECDSA. The private key never leaves the server.',
        verifier: 'ECDSA signature verification ensures the receipt was signed by the authorized off-chain service. Replay attacks are prevented by nonce/timestamp checks.',
        onchain: 'Smart contract verifies the signature on-chain and mints tokens/grants access. The contract only accepts valid, non-replayed receipts.',
      }
      setTooltip({
        text: tooltips[hoveredNode] || '',
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 + 100,
      })
    } else {
      setTooltip(null)
    }
  }, [hoveredNode])

  return (
    <>
      <div className="controls">
        <button onClick={handleSimulate} disabled={isAnimating}>
          {isAnimating ? 'Animating...' : 'Simulate Payment'}
        </button>
        <button
          onClick={handleReplayToggle}
          className={replayAttack ? 'active' : ''}
          disabled={isAnimating}
        >
          {replayAttack ? 'Replay Attack: ON' : 'Replay Attack: OFF'}
        </button>
      </div>
      {tooltip && (
        <div
          className="tooltip"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </>
  )
}

