import pool from '../config/db.js'

export const postroutesService= async(route_name,start_location,end_location,fare)=>{
    const query=
    ` INSERT INTO routes(route_name,start_location,end_location,fare)
    VALUES($1,$2,$3,$4)
    RETURNING *`
    const routings= await pool
    .query(query,[route_name,start_location,end_location,fare])
    return routings.rows[0]
}
export const postbusesService= async(plate_number,route_id,capacity)=>{
    const query=
    ` INSERT INTO buses(plate_number,route_id,capacity)
    VALUES($1,$2,$3)
    RETURNING *`
    const results= await pool
    .query(query,[plate_number,route_id,capacity])
    return results.rows[0]
}
export const getbusesService= async()=>{
    const query=
    ` SELECT * FROM buses`
    const results= await pool
    .query(query)
    return results.rows
}
