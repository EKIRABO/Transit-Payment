import QRCode from 'qrcode'
import pool from '../config/db.js'

// GET /qr/bus/:bus_id
// Returns a QR code image (base64) encoding bus + route + fare info
export const getBusQRCode = async (req, res) => {
  try {
    const { bus_id } = req.params

    // Get bus + route + fare info
    const result = await pool.query(`
      SELECT
        b.id AS bus_id,
        b.plate_number,
        r.id AS route_id,
        r.route_name,
        r.start_location,
        r.end_location,
        r.fare
      FROM buses b
      JOIN routes r ON b.route_id = r.id
      WHERE b.id = $1
    `, [bus_id])

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Bus not found or has no route assigned" })
    }

    const busInfo = result.rows[0]

    // This is what gets encoded in the QR code
    const qrData = JSON.stringify({
      bus_id: busInfo.bus_id,
      plate_number: busInfo.plate_number,
      route_id: busInfo.route_id,
      route_name: busInfo.route_name,
      from: busInfo.start_location,
      to: busInfo.end_location,
      fare: Number(busInfo.fare)
    })

    // Generate QR as base64 PNG
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#ffffff'
      }
    })

    res.status(200).json({
      bus_id: busInfo.bus_id,
      plate_number: busInfo.plate_number,
      route_name: busInfo.route_name,
      qr_image: qrImage // base64 PNG
    })

  } catch (error) {
    console.error("QR generation error:", error)
    res.status(500).json({ error: error.message })
  }
}

// GET /qr/all-buses
// Returns QR codes for all buses — used by admin to print them all
export const getAllBusQRCodes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id AS bus_id,
        b.plate_number,
        r.route_name,
        r.start_location,
        r.end_location,
        r.fare
      FROM buses b
      JOIN routes r ON b.route_id = r.id
      ORDER BY b.id ASC
    `)

    const qrCodes = await Promise.all(result.rows.map(async (bus) => {
      const qrData = JSON.stringify({
        bus_id: bus.bus_id,
        plate_number: bus.plate_number,
        route_name: bus.route_name,
        from: bus.start_location,
        to: bus.end_location,
        fare: Number(bus.fare)
      })

      const qrImage = await QRCode.toDataURL(qrData, { width: 300, margin: 2 })

      return {
        bus_id: bus.bus_id,
        plate_number: bus.plate_number,
        route_name: bus.route_name,
        qr_image: qrImage
      }
    }))

    res.status(200).json(qrCodes)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}