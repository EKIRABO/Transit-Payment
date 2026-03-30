import express from 'express'
import { momoTopUp, momoRidePayment } from '../controllers/momo_controller.js'
import { authenticate } from '../middleware/auth_middleware.js'

const momoRouter = express.Router()


momoRouter.post('/topup', authenticate, momoTopUp)


momoRouter.post('/pay', authenticate, momoRidePayment)

export default momoRouter