'use client'

/**
 * MemesSection: Light-hearted blockchain memes for developers
 * Positioned in bottom-right corner
 */
export default function MemesSection() {
  const memes = [
    {
      title: 'The Oracle Problem',
      text: 'When your smart contract trusts an off-chain service, you\'re basically saying "trust me bro" but with cryptography.',
    },
    {
      title: 'Gas Fees Be Like',
      text: 'Why verify signatures on-chain when you can verify them off-chain and just check the result? Because decentralization, that\'s why.',
    },
    {
      title: 'Replay Attack Prevention',
      text: 'Nonces are like receipts for your receipts. Without them, your signed message is just a reusable coupon for free tokens.',
    },
  ]

  return (
    <div className="memes-section">
      <h3>Blockchain Developer Memes</h3>
      {memes.map((meme, index) => (
        <div key={index} className="meme">
          <div className="meme-title">{meme.title}</div>
          <div className="meme-text">{meme.text}</div>
        </div>
      ))}
    </div>
  )
}












