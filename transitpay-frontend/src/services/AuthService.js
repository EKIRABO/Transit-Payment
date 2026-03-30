const BASE_URL = "http://localhost:8000"

export const login = async (email, password) => {

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  const text = await response.text()

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Login failed")
  }

  return data
}

export const signup = async ({ name, email, password, phone }) => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, phone })
  })

  const text = await response.text()

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Signup failed")
  }

  return data
}