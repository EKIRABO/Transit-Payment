const BASE_URL = "http://localhost:8000"

export const getWalletByUser = async (userId) => {

  const res = await fetch(`${BASE_URL}/wallets/${userId}`)

  const text = await res.text()

  if (!text) {
    return { balance: 0 }
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error("Wallet response is not valid JSON:", text)
    throw new Error("Server returned invalid response")
  }

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch wallet")
  }

 
  return data ?? { balance: 0 }
}

export const topUpWallet = async (user_id, amount) => {

  
  const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/wallets/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ user_id, amount })
  })

  const text = await response.text()

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error("Top-up response is not valid JSON:", text)
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Top-up failed")
  }

  return data
}