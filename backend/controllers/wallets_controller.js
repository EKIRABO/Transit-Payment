import {
  postWalletService,
  getWalletBalanceService,
  getWalletByIdBalanceService,
  topUpService,
  adjustWalletService
} from '../services/wallets_service.js'

export const postWallet = async (req, res) => {
  try {
    const { user_id, balance } = req.body
    const userWallet = await postWalletService(user_id, balance)
    res.status(201).json(userWallet)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWalletBalance = async (req, res) => {
  try {
    const userBalance = await getWalletBalanceService()
    res.status(200).json(userBalance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getWalletByIdBalance = async (req, res) => {
  try {
    const getId = req.params.id
    const userBalance = await getWalletByIdBalanceService(getId)
    res.status(200).json(userBalance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const topUp = async (req, res) => {
  try {
    const { user_id, amount } = req.body
    const topUpBalance = await topUpService(user_id, amount)
    res.status(200).json(topUpBalance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Admin manually adds or deducts from a user's wallet
export const adjustWallet = async (req, res) => {
  try {
    const { user_id, amount, type } = req.body

    if (!user_id || !amount || !type) {
      return res.status(400).json({ error: "user_id, amount and type are required" })
    }

    if (!['add', 'deduct'].includes(type)) {
      return res.status(400).json({ error: "type must be 'add' or 'deduct'" })
    }

    const result = await adjustWalletService(user_id, Number(amount), type)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}