import { create } from 'zustand'

interface AppState {
  isAnimating: boolean
  replayAttack: boolean
  hoveredNode: string | null
  setAnimating: (value: boolean) => void
  setReplayAttack: (value: boolean) => void
  setHoveredNode: (node: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  isAnimating: false,
  replayAttack: false,
  hoveredNode: null,
  setAnimating: (value) => set({ isAnimating: value }),
  setReplayAttack: (value) => set({ replayAttack: value }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
}))












