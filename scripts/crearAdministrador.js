
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { pool } from "../src/persistence/connection.js";

dotenv.config();

async function crearAdministrador() {
  try {
    const nombre = process.env.ADMIN_NOMBRE;
    const correo = process.env.ADMIN_CORREO?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!nombre || !correo || !password) {
      throw new Error(
        "Configura ADMIN_NOMBRE, ADMIN_CORREO y ADMIN_PASSWORD en .env"
      );
    }

    if (password.length < 12) {
      throw new Error("La contraseña debe tener al menos 12 caracteres");
    }

    const existente = await pool.query(
      "SELECT id FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (existente.rows.length > 0) {
      console.log("Ya existe un usuario con ese correo");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, rol)
       VALUES ($1, $2, $3, 'administrador')`,
      [nombre, correo, passwordHash]
    );

    console.log("Administrador creado correctamente");

  } catch (error) {
    console.error("Error al crear administrador:", error.message);
    process.exitCode = 1;

  } finally {
    await pool.end();
  }
}

crearAdministrador();
