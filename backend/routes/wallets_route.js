import express from 'express'
import {
  postWallet,
  getWalletBalance,
  getWalletByIdBalance,
  topUp,
  adjustWallet
} from '../controllers/wallets_controller.js'
import { authenticate } from "../middleware/auth_middleware.js"

const walletRouter = express.Router()

// POST /wallets/topup
walletRouter.post('/topup', authenticate, topUp)

// POST /wallets/adjust — admin manually adds or deducts from wallet
walletRouter.post('/adjust', authenticate, adjustWallet)

// POST /wallets
walletRouter.post('/', postWallet)

// GET /wallets
walletRouter.get('/', authenticate, getWalletBalance)

// GET /wallets/:id
walletRouter.get('/:id', getWalletByIdBalance)

export default walletRouter