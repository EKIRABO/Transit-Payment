import express from 'express'
import {payment,getpayment,getPaymentById} from '../controllers/payment_controller.js'
const paymentRouter=express.Router()
paymentRouter.post('/', payment)
paymentRouter.get('/',getpayment)
paymentRouter.get('/:user_id',getPaymentById)
export default paymentRouter;