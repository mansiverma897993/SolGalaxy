import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// NFT API calls
export const nftAPI = {
  // Get all NFTs
  getNFTs: async (filters?: any) => {
    try {
      const response = await api.get('/nfts', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      throw error
    }
  },

  // Get NFT by ID
  getNFT: async (id: string) => {
    try {
      const response = await api.get(`/nfts/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching NFT:', error)
      throw error
    }
  },

  // Create NFT
  createNFT: async (data: any) => {
    try {
      const response = await api.post('/nfts', data)
      return response.data
    } catch (error) {
      console.error('Error creating NFT:', error)
      throw error
    }
  },

  // Update NFT
  updateNFT: async (id: string, data: any) => {
    try {
      const response = await api.put(`/nfts/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating NFT:', error)
      throw error
    }
  },

  // Delete NFT
  deleteNFT: async (id: string) => {
    try {
      const response = await api.delete(`/nfts/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting NFT:', error)
      throw error
    }
  },
}

// Collection API calls
export const collectionAPI = {
  // Get all collections
  getCollections: async () => {
    try {
      const response = await api.get('/collections')
      return response.data
    } catch (error) {
      console.error('Error fetching collections:', error)
      throw error
    }
  },

  // Get collection by ID
  getCollection: async (id: string) => {
    try {
      const response = await api.get(`/collections/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching collection:', error)
      throw error
    }
  },

  // Create collection
  createCollection: async (data: any) => {
    try {
      const response = await api.post('/collections', data)
      return response.data
    } catch (error) {
      console.error('Error creating collection:', error)
      throw error
    }
  },
}

// Transaction API calls
export const transactionAPI = {
  // Buy NFT
  buyNFT: async (nftId: string, walletAddress: string) => {
    try {
      const response = await api.post('/transactions/buy', {
        nftId,
        walletAddress,
      })
      return response.data
    } catch (error) {
      console.error('Error buying NFT:', error)
      throw error
    }
  },

  // List NFT for sale
  listNFT: async (nftId: string, price: number, walletAddress: string) => {
    try {
      const response = await api.post('/transactions/list', {
        nftId,
        price,
        walletAddress,
      })
      return response.data
    } catch (error) {
      console.error('Error listing NFT:', error)
      throw error
    }
  },

  // Get user transactions
  getUserTransactions: async (walletAddress: string) => {
    try {
      const response = await api.get(`/transactions/user/${walletAddress}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },
}

// User/Profile API calls
export const userAPI = {
  // Get user profile
  getProfile: async (walletAddress: string) => {
    try {
      const response = await api.get(`/users/${walletAddress}`)
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (walletAddress: string, data: any) => {
    try {
      const response = await api.put(`/users/${walletAddress}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Get user's NFTs
  getUserNFTs: async (walletAddress: string) => {
    try {
      const response = await api.get(`/users/${walletAddress}/nfts`)
      return response.data
    } catch (error) {
      console.error('Error fetching user NFTs:', error)
      throw error
    }
  },
}

export default api
