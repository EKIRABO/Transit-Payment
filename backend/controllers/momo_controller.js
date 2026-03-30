import {
  momoTopUpService,
  momoRidePaymentService
} from '../services/momoService.js'


export const momoTopUp = async (req, res) => {
  try {
    const { user_id, phone_number, amount } = req.body

    if (!user_id || !phone_number || !amount) {
      return res.status(400).json({ error: 'user_id, phone_number and amount are required' })
    }

    if (amount < 500) {
      return res.status(400).json({ error: 'Minimum top-up amount is RWF 500' })
    }

    const result = await momoTopUpService(user_id, phone_number, Number(amount))
    res.status(200).json({ success: true, balance: result.balance })

  } catch (error) {
    console.error('MoMo top-up error:', error.message)
    res.status(500).json({ error: error.message })
  }
}


export const momoRidePayment = async (req, res) => {
  try {
    const { user_id, bus_id, phone_number } = req.body

    if (!user_id || !bus_id || !phone_number) {
      return res.status(400).json({ error: 'user_id, bus_id and phone_number are required' })
    }

    const result = await momoRidePaymentService(user_id, bus_id, phone_number)
    res.status(200).json(result)

  } catch (error) {
    console.error('MoMo ride payment error:', error.message)
    res.status(500).json({ error: error.message })
  }
}
export const checkMomoPaymentStatus = async (referenceId) => {
  const token = await getMomoToken()

  const response = await fetch(
    `${MOMO_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': MOMO_TARGET_ENV,
        'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY
      }
    }
  )

  const data = await response.json()
  console.log('MOMO FULL RESPONSE:', JSON.stringify(data, null, 2)) // 👈 Add this
  
  return data.status
}