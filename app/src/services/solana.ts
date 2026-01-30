import { Connection, PublicKey } from '@solana/web3.js'

const SOLANA_RPC_URL =
  process.env.REACT_APP_RPC_URL ||
  'https://api.devnet.solana.com'

export const connection = new Connection(SOLANA_RPC_URL, 'processed')

// Helper functions for Solana interactions
export const solanaHelper = {
  // Get wallet balance
  getBalance: async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const balance = await connection.getBalance(publicKey)
      return balance / 1e9 // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  },

  // Get wallet info
  getWalletInfo: async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const balance = await connection.getBalance(publicKey)
      const accountInfo = await connection.getAccountInfo(publicKey)

      return {
        address: walletAddress,
        balance: balance / 1e9,
        accountInfo,
      }
    } catch (error) {
      console.error('Error getting wallet info:', error)
      throw error
    }
  },

  // Get token accounts
  getTokenAccounts: async (walletAddress: string) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJsyFbPVwwQQfstapzSmtckLdc1w'),
      })
      return tokenAccounts.value
    } catch (error) {
      console.error('Error getting token accounts:', error)
      throw error
    }
  },

  // Get transaction history
  getTransactionHistory: async (walletAddress: string, limit: number = 10) => {
    try {
      const publicKey = new PublicKey(walletAddress)
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit,
      })
      return signatures
    } catch (error) {
      console.error('Error getting transaction history:', error)
      throw error
    }
  },
}

export default connection
