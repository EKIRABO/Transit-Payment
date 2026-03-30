const BASE_URL = "http://localhost:8000"

export const getTransactions = async (userId) => {

  const response = await fetch(`${BASE_URL}/payment/${userId}`)

  const text = await response.text()

  if (!text) {
    return []
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error("Transaction response is not valid JSON:", text)
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch transactions")
  }

  return data
}