import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

interface WalletInfoProps {
  showBalance?: boolean
}

export default function WalletInfo({ showBalance = true }: WalletInfoProps) {
  const { connected, publicKey } = useWallet()
  const [balance, setBalance] = useState<number>(0)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!connected || !publicKey) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-400 mb-4">Please connect your wallet to continue</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-white mb-4">Wallet Info</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Wallet Address</p>
          <p className="text-secondary font-mono text-lg">{formatAddress(publicKey.toString())}</p>
          <p className="text-gray-500 text-xs mt-1">Full: {publicKey.toString()}</p>
        </div>
        {showBalance && (
          <div>
            <p className="text-gray-400 text-sm">Balance</p>
            <p className="text-white font-bold text-lg">{balance.toFixed(4)} SOL</p>
          </div>
        )}
      </div>
    </div>
  )
}
