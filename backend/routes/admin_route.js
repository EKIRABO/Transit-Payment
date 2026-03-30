import express from 'express'
import {
  postroutes,
  postbuses,
  getbuses,
  getroutes,
  getRoutesWithBuses,
  updateRoute,
  deleteRoute,
  updateBus,
  deleteBus
} from '../controllers/admin_controller.js'
import { authenticate } from '../middleware/auth_middleware.js'

const adminRouter = express.Router()

// All admin routes require authentication
adminRouter.get('/routes', authenticate, getroutes)
adminRouter.post('/routes', authenticate, postroutes)
adminRouter.put('/routes/:id', authenticate, updateRoute)
adminRouter.delete('/routes/:id', authenticate, deleteRoute)

adminRouter.get('/routes-with-buses', getRoutesWithBuses)

adminRouter.get('/buses', authenticate, getbuses)
adminRouter.post('/buses', authenticate, postbuses)
adminRouter.put('/buses/:id', authenticate, updateBus)
adminRouter.delete('/buses/:id', authenticate, deleteBus)

export default adminRouter