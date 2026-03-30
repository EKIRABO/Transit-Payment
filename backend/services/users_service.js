import bcrypt from "bcrypt"
import db from '../config/db.js'

export const createUserService = async (name,email,password,phone) => {

  const checkQuery = `
    SELECT * FROM users
    WHERE email = $1
  `

  const existingUser = await db.query(checkQuery,[email])

  if(existingUser.rows.length > 0){
    throw new Error("Email already registered")
  }

  const hashedPassword = await bcrypt.hash(password,10)

  const query = `
    INSERT INTO users(name,email,password,phone)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,phone
  `

  const result = await db.query(query,[name,email,hashedPassword,phone])

  return result.rows[0]
}
export const getUserService = async () => {
    const query = `
    SELECT * FROM users
    `
    const results = await db.query(query)
    return results.rows
}
export const getUserByIdService = async (id) => {

  const query = `
    SELECT * FROM users
    WHERE id = $1
  `

  const result = await db.query(query, [id])

  return result.rows[0]
}
export const loginUserService = async (email, password) => {

  const query = `
    SELECT * FROM users
    WHERE email = $1
  `

  const result = await db.query(query, [email])

  const user = result.rows[0]

  if (!user) {
    throw new Error("User not found")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Invalid password")
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role   
  }
}