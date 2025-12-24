# Off-Chain ↔ On-Chain Ramp Visualization

Interactive 3D visualization demonstrating how signed attestations bridge off-chain events (payments/receipts) to on-chain actions (mints/entitlements).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Three.js** (via React Three Fiber)
- **Zustand** (state management)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Components

- **`OffChainNode`**: Represents the off-chain service (Go backend) that generates and signs receipts
- **`ReceiptFlow`**: Animated particle stream showing the signed receipt traveling from off-chain to on-chain
- **`Verifier`**: Cryptographic signature verification node (ECDSA) that validates receipts
- **`OnChainNode`**: Smart contract on Ethereum-like blockchain that mints tokens/grants access
- **`Scene`**: Main 3D scene orchestrating all components
- **`Controls`**: UI buttons for simulating payments and toggling replay attacks

### Visual Flow

1. **Off-chain Service** emits a signed receipt (glowing JSON block)
2. **Receipt travels** as a particle stream from left to right
3. **Signature Verification** pulses green (valid) or red (replay attack blocked)
4. **On-chain Contract** emits mint animation when receipt is accepted

### Interactivity

- **Hover nodes** to see technical explanations in tooltips
- **"Simulate Payment"** button triggers the full animation flow
- **"Replay Attack"** toggle demonstrates how replay attacks are blocked

## Cryptographic Concepts Visualized

- **ECDSA Signatures**: The off-chain service signs receipts with a private key
- **Signature Verification**: On-chain verification ensures authenticity
- **Replay Attack Prevention**: Nonces/timestamps prevent reuse of signed receipts
- **Trust Boundary**: The verifier represents the cryptographic trust boundary between off-chain and on-chain worlds

## Development

The codebase is modular with clear separation between:
- **Rendering logic** (Three.js components)
- **State management** (Zustand store)
- **Animation logic** (React hooks and useFrame)

All components include detailed comments explaining the cryptographic meaning of visual elements.

