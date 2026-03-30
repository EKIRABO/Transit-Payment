import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY id ASC`
    )
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = $1`,
      [id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone } = req.body
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4
       RETURNING id, name, email, phone, role, status`,
      [name, email, phone, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const changePassword = async (req, res) => {
  try {
    const { id } = req.params
    const { current_password, new_password } = req.body

    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id])
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: "User not found" })

    const valid = await bcrypt.compare(current_password, user.password)
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" })

    const hashed = await bcrypt.hash(new_password, 10)
    await pool.query(`UPDATE users SET password=$1 WHERE id=$2`, [hashed, id])

    res.status(200).json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'active' or 'suspended'" })
    }
    const result = await pool.query(
      `UPDATE users SET status=$1 WHERE id=$2 RETURNING id, name, email, role, status`,
      [status, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM transactions WHERE user_id=$1`, [id])
    await pool.query(`DELETE FROM wallets WHERE user_id=$1`, [id])
    await pool.query(`DELETE FROM users WHERE id=$1`, [id])
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || 'passenger']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    )

    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: "User not found" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Invalid credentials" })

   
    const token = jwt.sign(
      { id: String(user.id), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "Login successful",
      token,                      
      user: {
        id: String(user.id),      
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
