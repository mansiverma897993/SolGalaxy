// Format SOL amount
export const formatSOL = (amount: number): string => {
  return `${amount.toFixed(4)} SOL`
}

// Format wallet address (shortened)
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`
  }
  return num.toFixed(2)
}

// Format date
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format date and time
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Truncate text
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    legendary: 'text-orange-400',
  }
  return colors[rarity] || 'text-gray-400'
}

// Get rarity background
export const getRarityBg = (rarity: string): string => {
  const bgs: Record<string, string> = {
    common: 'bg-gray-500/20',
    uncommon: 'bg-green-500/20',
    rare: 'bg-blue-500/20',
    legendary: 'bg-orange-500/20',
  }
  return bgs[rarity] || 'bg-gray-500/20'
}

// Validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    // Basic validation - Solana addresses are 44 characters (base58)
    return /^[1-9A-HJ-NP-Z]{44}$/.test(address)
  } catch {
    return false
  }
}
