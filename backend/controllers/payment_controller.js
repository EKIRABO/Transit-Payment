import { paymentService, getpaymentService, getpaymentByIdService } from '../services/payment_service.js'

export const payment = async (req, res) => {
  try {
    const { user_id, bus_id } = req.body
    const paying = await paymentService(user_id, bus_id)
    res.status(201).json(paying)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getpayment = async (req, res) => {
  try {
    const getfunds = await getpaymentService()
   
    res.status(200).json(getfunds)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPaymentById = async (req, res) => {
  try {
    const id = req.params.user_id
    const payingById = await getpaymentByIdService(id)
   
    res.status(200).json(payingById)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}