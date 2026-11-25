import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export async function probarConexion() {
  try {
    const resultado = await pool.query("SELECT NOW()");

    console.log("Conexión a PostgreSQL exitosa");
    console.log("Fecha del servidor:", resultado.rows[0].now);
  } catch (error) {
    console.error("Error de conexión:", error.message);
    throw error;
  }
}
