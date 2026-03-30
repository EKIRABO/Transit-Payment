import db from '../config/db.js'

export const postWalletService = async (user_id, balance) => {
  const result = await db.query(
    `INSERT INTO wallets(user_id, balance) VALUES($1,$2) RETURNING *`,
    [user_id, balance]
  )
  return result.rows[0]
}

export const getWalletBalanceService = async () => {
  const result = await db.query(`SELECT user_id, balance FROM wallets`)
  return result.rows
}

export const getWalletByIdBalanceService = async (user_id) => {
  const result = await db.query(
    `SELECT balance FROM wallets WHERE user_id=$1`,
    [user_id]
  )
  return result.rows[0]
}

export const topUpService = async (user_id, amount) => {

  // Update wallet balance
  const result = await db.query(
    `UPDATE wallets SET balance=balance+$1 WHERE user_id=$2 RETURNING *`,
    [amount, user_id]
  )
  if (result.rows.length === 0) throw new Error("Wallet not found")

  // Record top-up as a transaction so it shows in history
  await db.query(
    `INSERT INTO transactions (user_id, bus_id, amount, status)
     VALUES ($1, NULL, $2, 'top_up')`,
    [user_id, amount]
  )

  return result.rows[0]
}

export const adjustWalletService = async (user_id, amount, type) => {
  const operator = type === 'add' ? '+' : '-'
  const result = await db.query(
    `UPDATE wallets SET balance=balance${operator}$1 WHERE user_id=$2 RETURNING *`,
    [amount, user_id]
  )
  if (result.rows.length === 0) throw new Error("Wallet not found for this user")

  // Record adjustment as transaction
  await db.query(
    `INSERT INTO transactions (user_id, bus_id, amount, status)
     VALUES ($1, NULL, $2, $3)`,
    [user_id, amount, type === 'add' ? 'admin_credit' : 'admin_deduct']
  )

  return result.rows[0]
}