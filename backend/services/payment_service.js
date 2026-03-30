import db from '../config/db.js'

export const paymentService = async (user_id, bus_id) => {

  const fareQuery = `
    SELECT r.fare
    FROM buses b
    JOIN routes r ON b.route_id = r.id
    WHERE b.id = $1
  `
  const fareResult = await db.query(fareQuery, [bus_id])

  if (!fareResult.rows[0]) {
    throw new Error("Bus not found or has no route assigned")
  }

  
  const fare = Number(fareResult.rows[0].fare)

  const walletQuery = `
    SELECT balance FROM wallets WHERE user_id = $1
  `
  const walletResult = await db.query(walletQuery, [user_id])

  if (!walletResult.rows[0]) {
    throw new Error("Wallet not found for this user")
  }

 
  const balance = Number(walletResult.rows[0].balance)

  console.log(`Payment attempt — userId: ${user_id}, busId: ${bus_id}, fare: ${fare}, balance: ${balance}`)

  if (balance < fare) {
    throw new Error(`Insufficient funds — balance: ${balance}, fare: ${fare}`)
  }

  await db.query(
    `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
    [fare, user_id]
  )

  await db.query(
    `INSERT INTO transactions (user_id, bus_id, amount, status)
     VALUES ($1, $2, $3, 'ride_payment')`,
    [user_id, bus_id, fare]
  )

  const updated = await db.query(
    `SELECT balance FROM wallets WHERE user_id = $1`,
    [user_id]
  )

  return updated.rows[0]
}

export const getpaymentService = async () => {
  const result = await db.query(`SELECT * FROM transactions ORDER BY created_at DESC`)
  return result.rows
}

export const getpaymentByIdService = async (user_id) => {
  const query = `
    SELECT
      t.id,
      t.user_id,
      t.bus_id,
      t.amount,
      t.status,
      t.created_at,
      r.route_name,
      r.start_location,
      r.end_location,
      b.plate_number
    FROM transactions t
    LEFT JOIN buses b ON t.bus_id = b.id
    LEFT JOIN routes r ON b.route_id = r.id
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC
  `
  const result = await db.query(query, [user_id])
  return result.rows
}