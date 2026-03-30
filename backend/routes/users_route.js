import express from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  updateUserStatus,
  deleteUser,
  registerUser
} from '../controllers/users_controller.js'
import { authenticate } from '../middleware/auth_middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id', authenticate, updateUser)
userRouter.patch('/:id/password', authenticate, changePassword)
userRouter.patch('/:id/status', authenticate, updateUserStatus)
userRouter.delete('/:id', authenticate, deleteUser)

export default userRouter