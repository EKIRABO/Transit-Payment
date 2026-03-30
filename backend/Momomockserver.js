import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const payments = new Map()

app.post('/collection/token/', (req, res) => {
  console.log('[MoMo Mock] Token requested')
  res.json({
    access_token: `mock-token-${uuidv4()}`,
    token_type: 'access_token',
    expires_in: 3600
  })
})

app.post('/collection/v1_0/requesttopay', (req, res) => {
  const referenceId = req.headers['x-reference-id']

  if (!referenceId) {
    return res.status(400).json({ message: 'Missing X-Reference-Id header' })
  }

  const { amount, currency, payer, payerMessage } = req.body

  const payment = {
    referenceId,
    amount,
    currency,
    payer,
    payerMessage,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }

  payments.set(referenceId, payment)
  console.log(`[MoMo Mock] Payment request created: ${referenceId} — RWF ${amount} from ${payer?.partyId}`)

  res.status(202).send()
})

app.get('/collection/v1_0/requesttopay/:referenceId', (req, res) => {
  const { referenceId } = req.params
  const payment = payments.get(referenceId)

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' })
  }

  console.log(`[MoMo Mock] Status check: ${referenceId} → ${payment.status}`)
  res.json(payment)
})

app.post('/collection/v1_0/requesttopay/:referenceId/approve', (req, res) => {
  const { referenceId } = req.params
  const payment = payments.get(referenceId)
  if (!payment) return res.status(404).json({ message: 'Payment not found' })
  payment.status = 'SUCCESSFUL'
  console.log(`[MoMo Mock] Payment APPROVED: ${referenceId}`)
  res.json({ success: true, payment })
})

app.post('/collection/v1_0/requesttopay/:referenceId/reject', (req, res) => {
  const { referenceId } = req.params
  const payment = payments.get(referenceId)
  if (!payment) return res.status(404).json({ message: 'Payment not found' })
  payment.status = 'FAILED'
  console.log(`[MoMo Mock] Payment REJECTED: ${referenceId}`)
  res.json({ success: true, payment })
})

app.get('/payments', (req, res) => {
  res.json(Array.from(payments.values()))
})

const PORT = process.env.MOMO_MOCK_PORT || 8001
app.listen(PORT, () => {
  console.log(`\n[MoMo Mock Server] Running on http://localhost:${PORT}`)
  console.log(`[MoMo Mock Server] Dashboard: open momo-dashboard.html in your browser\n`)
})

export default app