import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState, useCallback } from 'react'
import { solanaHelper } from '../services/solana'

export const useSolanaBalance = () => {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const bal = await solanaHelper.getBalance(publicKey.toString())
      setBalance(bal)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance'
      setError(message)
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  return { balance, loading, error, fetchBalance }
}

export const useSolanaWalletInfo = () => {
  const { publicKey } = useWallet()
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWalletInfo = useCallback(async () => {
    if (!publicKey) {
      setWalletInfo(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const info = await solanaHelper.getWalletInfo(publicKey.toString())
      setWalletInfo(info)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet info'
      setError(message)
      setWalletInfo(null)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  return { walletInfo, loading, error, fetchWalletInfo }
}

export const useSolanaTransactionHistory = () => {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactionHistory = useCallback(async (limit: number = 10) => {
    if (!publicKey) {
      setTransactions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const txns = await solanaHelper.getTransactionHistory(publicKey.toString(), limit)
      setTransactions(txns)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions'
      setError(message)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  return { transactions, loading, error, fetchTransactionHistory }
}
