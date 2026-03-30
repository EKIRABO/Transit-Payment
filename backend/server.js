import dotenv from 'dotenv'
dotenv.config()

import cors from "cors"
import express from "express"

import authRouter from "./routes/auth_route.js"
import userRouter from "./routes/users_route.js"
import walletRouter from "./routes/wallets_route.js"
import paymentRouter from "./routes/payment_route.js"
import adminRouter from "./routes/admin_route.js"
import momoRouter from "./routes/momo_route.js"
import qrRouter from "./routes/qr_route.js"

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/wallets", walletRouter)
app.use("/payment", paymentRouter)
app.use("/admin", adminRouter)
app.use("/momo", momoRouter)
app.use("/qr", qrRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})