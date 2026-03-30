import express from 'express'
import { getBusQRCode, getAllBusQRCodes } from '../controllers/qr_controller.js'

const qrRouter = express.Router()


qrRouter.get('/bus/:bus_id', getBusQRCode)


qrRouter.get('/all-buses', getAllBusQRCodes)

export default qrRouter