import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Off-Chain ↔ On-Chain Ramp Visualization',
  description: 'Interactive 3D visualization of signed attestations bridging off-chain and on-chain worlds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}












