const BASE_URL = "http://localhost:8000"

export const getRoutes = async () => {

  const response = await fetch(`${BASE_URL}/admin/routes`)

  const text = await response.text()

  if (!text) {
    return []
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error("Routes response is not valid JSON:", text)
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch routes")
  }

  return Array.isArray(data) ? data : []
}


export const getRoutesWithBuses = async () => {

  const response = await fetch(`${BASE_URL}/admin/routes-with-buses`)

  const text = await response.text()

  if (!text) {
    return []
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    console.error("Routes response is not valid JSON:", text)
    throw new Error("Server returned invalid response")
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch routes")
  }

  return Array.isArray(data) ? data : []
}