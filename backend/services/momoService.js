import fetch from 'node-fetch'
import { v4 as uuidv4 } from 'uuid'
import db from '../config/db.js'

const {
  MOMO_SUBSCRIPTION_KEY,
  MOMO_USER_ID,
  MOMO_API_KEY,
  MOMO_BASE_URL,
  MOMO_TARGET_ENV
} = process.env

const IS_MOCK = MOMO_TARGET_ENV === 'mock'


export const getMomoToken = async () => {
  const credentials = Buffer.from(`${MOMO_USER_ID}:${MOMO_API_KEY}`).toString('base64')

  const response = await fetch(`${MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY,
      'Content-Length': '0'
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get MoMo token')
  }

  return data.access_token
}


export const requestMomoPayment = async (phoneNumber, amount, referenceNote) => {
  if (IS_MOCK) {
    console.log(`[MoMo] Mock mode — skipping API call for ${phoneNumber}, amount: ${amount}`)
    return uuidv4()
  }

  const token = await getMomoToken()
  const referenceId = uuidv4()

  const response = await fetch(`${MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MOMO_TARGET_ENV,
      'Ocp-Apim-Subscription-Key': MOMO_SUBSCRIPTION_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: String(amount),
      currency: 'RWF',
      externalId: uuidv4(),
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber
      },
      payerMessage: referenceNote,
      payeeNote: referenceNote
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    let errMessage = errText
    try { errMessage = JSON.parse(errText)?.message || errText } catch (_) {}
    throw new Error(`MoMo payment request failed [${response.status}]: ${errMessage || 'No details'}`)
  }

  return referenceId
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

  if (!response.ok) {
    throw new Error(data.message || 'Failed to check payment status')
  }

  return data.status
}


export const waitForMomoPayment = async (referenceId) => {
  if (IS_MOCK) {
    console.log('[MoMo] Mock mode — auto-approving payment')
    return 'SUCCESSFUL'
  }

  const maxAttempts = 10
  const delayMs = 3000

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    const status = await checkMomoPaymentStatus(referenceId)
    console.log(`[MoMo] Status check ${i + 1}/${maxAttempts}: ${status}`)
    if (status === 'SUCCESSFUL') return 'SUCCESSFUL'
    if (status === 'FAILED') return 'FAILED'
  }

  return 'TIMEOUT'
}


export const momoTopUpService = async (user_id, phoneNumber, amount) => {
  const referenceId = await requestMomoPayment(
    phoneNumber,
    amount,
    `TransitPay wallet top-up for user ${user_id}`
  )

  const status = await waitForMomoPayment(referenceId)

  if (status !== 'SUCCESSFUL') {
    throw new Error(status === 'TIMEOUT'
      ? 'Payment timed out — please try again'
      : 'Payment was rejected or failed'
    )
  }

  const result = await db.query(
    `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING *`,
    [amount, user_id]
  )

  if (!result.rows[0]) throw new Error('Wallet not found')

  return result.rows[0]
}


export const momoRidePaymentService = async (user_id, bus_id, phoneNumber) => {
  const fareResult = await db.query(
    `SELECT r.fare FROM buses b JOIN routes r ON b.route_id = r.id WHERE b.id = $1`,
    [bus_id]
  )

  if (!fareResult.rows[0]) throw new Error('Bus not found or has no route assigned')

  const fare = Number(fareResult.rows[0].fare)

  const referenceId = await requestMomoPayment(
    phoneNumber,
    fare,
    `TransitPay ride payment`
  )

  const status = await waitForMomoPayment(referenceId)

  if (status !== 'SUCCESSFUL') {
    throw new Error(status === 'TIMEOUT'
      ? 'Payment timed out — please try again'
      : 'Payment was rejected or failed on MoMo'
    )
  }

  await db.query(
    `INSERT INTO transactions (user_id, bus_id, amount, status) VALUES ($1, $2, $3, 'ride_payment')`,
    [user_id, bus_id, fare]
  )

  return { success: true, amount: fare }
}