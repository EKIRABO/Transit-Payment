import express from 'express'
import { loginUser } from '../controllers/users_controller.js'

const authRouter = express.Router()

// POST /auth/login
authRouter.post('/login', loginUser)

export default authRouter