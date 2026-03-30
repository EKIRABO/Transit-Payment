import pool from '../config/db.js'
import { postroutesService, postbusesService, getbusesService } from '../services/admin_service.js'

export const postroutes = async (req, res) => {
  try {
    const { route_name, start_location, end_location, fare } = req.body
    const routes = await postroutesService(route_name, start_location, end_location, fare)
    res.status(201).json(routes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const postbuses = async (req, res) => {
  try {
    const { plate_number, route_id, capacity } = req.body
    const buses = await postbusesService(plate_number, route_id, capacity)
    res.status(201).json(buses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getbuses = async (req, res) => {
  try {
    const getbus = await getbusesService()
    res.status(200).json(getbus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getroutes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM routes ORDER BY id ASC")
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRoutesWithBuses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id AS route_id,
        r.route_name,
        r.start_location,
        r.end_location,
        r.fare,
        b.id AS bus_id,
        b.plate_number
      FROM routes r
      LEFT JOIN buses b ON b.route_id = r.id
      ORDER BY r.id ASC
    `)
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params
    const { route_name, start_location, end_location, fare } = req.body
    const result = await pool.query(
      `UPDATE routes SET route_name=$1, start_location=$2, end_location=$3, fare=$4
       WHERE id=$5 RETURNING *`,
      [route_name, start_location, end_location, fare, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: "Route not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM routes WHERE id=$1`, [id])
    res.status(200).json({ message: "Route deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params
    const { plate_number, route_id, capacity } = req.body
    const result = await pool.query(
      `UPDATE buses SET plate_number=$1, route_id=$2, capacity=$3
       WHERE id=$4 RETURNING *`,
      [plate_number, route_id, capacity, id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: "Bus not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM buses WHERE id=$1`, [id])
    res.status(200).json({ message: "Bus deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}