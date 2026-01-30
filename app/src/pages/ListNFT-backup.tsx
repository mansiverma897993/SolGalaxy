import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import NFTDetail from '../components/NFTDetail'

interface NFT {
  id: string
  name: string
  image: string
  price: number
  creator: string
  collection: string
  description: string
  rarity: string
  floorPrice: number
}

export default function ListNFT() {
  const { connected } = useWallet()
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: 'new',
    price: '',
    royalty: 5,
    image: null as File | null,
  })

  const steps = [
    { number: 1, label: 'Upload', description: 'Add your artwork' },
    { number: 2, label: 'Details', description: 'Set NFT details' },
    { number: 3, label: 'Price', description: 'Set selling price' },
    { number: 4, label: 'Review', description: 'Review & confirm' },
  ]

  if (!connected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-6">Create & List NFT</h1>
          <p className="text-gray-400 text-lg mb-8">
            Connect your wallet to create and list your NFT on SolGalaxy
          </p>
          <WalletMultiButton
            style={{
              backgroundColor: '#9945FF',
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-white mb-12">Create & List NFT</h1>

      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setActiveStep(step.number)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    activeStep >= step.number
                      ? 'bg-gradient-to-r from-primary to-secondary text-black'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.number}
                </button>
                <p className="text-xs mt-2 text-gray-400">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 transition-colors ${
                    activeStep > step.number
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="card p-8">
        {activeStep === 1 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">Upload your NFT image</p>
            <button className="btn-primary py-3 px-8">Select Image</button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="NFT Name"
              className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white"
            />
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white"
            />
            <select className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white">
              <option>Select Collection</option>
            </select>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <input
              type="number"
              placeholder="Price in SOL"
              className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white"
            />
            <input
              type="number"
              placeholder="Royalty %"
              className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white"
            />
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <p className="text-gray-400">Review your NFT details before listing</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {activeStep > 1 && (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="btn-secondary py-3 px-8"
            >
              Back
            </button>
          )}
          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="btn-primary py-3 px-8 ml-auto"
            >
              Next
            </button>
          ) : (
            <button className="btn-primary py-3 px-8 ml-auto">List NFT</button>
          )}
        </div>
      </div>
    </div>
  )
}
