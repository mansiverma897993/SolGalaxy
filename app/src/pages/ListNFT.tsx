import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Upload, AlertCircle } from 'lucide-react'

interface ListingFormData {
  name: string
  description: string
  collection: string
  price: number
  royalty: number
  image: string
}

export default function ListNFT() {
  const { connected, publicKey } = useWallet()
  const [formData, setFormData] = useState<ListingFormData>({
    name: '',
    description: '',
    collection: '',
    price: 0,
    royalty: 5,
    image: '',
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'royalty' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFormData((prev) => ({ ...prev, image: file.name }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      alert('Please connect your wallet first')
      return
    }

    if (!formData.name || !formData.description || !formData.collection || formData.price <= 0) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        collection: '',
        price: 0,
        royalty: 5,
        image: '',
      })
      setPreview(null)

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    }, 2000)
  }

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-6">List Your NFT</h1>
          <p className="text-gray-400 text-lg mb-8">
            Connect your wallet to create and list your NFT
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">List Your NFT</h1>
        <p className="text-gray-400 text-lg">
          Create and list your NFT on SolGalaxy marketplace
        </p>
      </div>

      {success && (
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-green-400 font-semibold">
            ✓ Your NFT has been successfully listed!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card">
          <div className="space-y-6">
            {/* NFT Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                NFT Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Cosmic Voyager #001"
                className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your NFT..."
                rows={4}
                className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-colors resize-none"
                required
              />
            </div>

            {/* Collection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Collection *
              </label>
              <select
                name="collection"
                value={formData.collection}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                required
              >
                <option value="">Select a collection</option>
                <option value="cosmic-series">Cosmic Series</option>
                <option value="genesis">Genesis Collection</option>
                <option value="rare-gems">Rare Gems</option>
                <option value="limited-edition">Limited Edition</option>
                <option value="new-collection">Create New Collection</option>
              </select>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Price (SOL) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Royalty (%)
                </label>
                <input
                  type="number"
                  name="royalty"
                  value={formData.royalty}
                  onChange={handleInputChange}
                  min="0"
                  max="25"
                  step="0.5"
                  className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                NFT Image *
              </label>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                  required
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <Upload size={32} className="text-secondary mx-auto mb-2" />
                  <p className="text-white font-semibold mb-1">Drop your image here</p>
                  <p className="text-gray-400 text-sm">or click to select</p>
                </label>
              </div>
              {preview && (
                <p className="text-green-400 text-sm mt-2">✓ Image selected: {formData.image}</p>
              )}
            </div>

            {/* Warning */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-semibold mb-1">Gas fees apply</p>
                <p className="text-orange-300 text-sm">
                  You'll need SOL for transaction fees when listing your NFT
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 font-bold text-lg hover:disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating NFT...' : 'List NFT'}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Preview</h3>

            {preview ? (
              <div className="space-y-4">
                <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs">Name</p>
                    <p className="text-white font-semibold">
                      {formData.name || 'Your NFT Name'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="text-secondary font-bold text-lg">
                      {formData.price > 0 ? `${formData.price} SOL` : 'Not set'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Royalty</p>
                    <p className="text-white font-semibold">{formData.royalty}%</p>
                  </div>

                  <div className="pt-3 border-t border-primary/20">
                    <p className="text-gray-400 text-xs mb-2">Collection</p>
                    <p className="text-secondary text-sm">
                      {formData.collection || 'No collection selected'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Upload image to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
