const BASE_URL = "http://localhost:8000"

// Called when user pays for a ride via MoMo
export const momoPayRide = async (userId, busId, phoneNumber) => {

  const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/momo/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id: userId,
      bus_id: busId,
      phone_number: phoneNumber
    })
  })

  const text = await response.text()
  let data
  try { data = JSON.parse(text) } catch (e) { throw new Error("Server returned invalid response") }
  if (!response.ok) { throw new Error(data.error || "MoMo payment failed") }
  return data
}

// Called when user tops up wallet via MoMo
export const momoTopUp = async (userId, phoneNumber, amount) => {

  const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/momo/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id: userId,
      phone_number: phoneNumber,
      amount: amount
    })
  })

  const text = await response.text()
  let data
  try { data = JSON.parse(text) } catch (e) { throw new Error("Server returned invalid response") }
  if (!response.ok) { throw new Error(data.error || "MoMo top-up failed") }
  return data
}