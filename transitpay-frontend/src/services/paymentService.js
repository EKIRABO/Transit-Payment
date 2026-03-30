const BASE_URL = "http://localhost:8000"

export const payRide = async (userId, busId) => {
  const res = await fetch("http://localhost:8000/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      bus_id: busId
    })
  })

 if (!res.ok) {
  const errData = await res.json()
  throw new Error(errData.error || "Payment failed")
}
  return await res.json()
}