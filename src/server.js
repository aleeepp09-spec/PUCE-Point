import dotenv from "dotenv";
import app from "./app.js";
import { pool, probarConexion } from "./persistence/connection.js";

dotenv.config();

const PUERTO = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await probarConexion();

    app.listen(PUERTO, () => {
      console.log("--------------------------------");
      console.log("PUCE-Point iniciado correctamente");
      console.log(`Servidor: http://localhost:${PUERTO}`);
      console.log("--------------------------------");
      console.log("Rutas disponibles:");
      console.log("- GET  /");
      console.log("- GET  /health");
      console.log("- GET  /pedidos");
      console.log("- POST /pedidos");
      console.log("- GET  /mesas");
      console.log("- GET  /mesas/reservas");
      console.log("- POST /mesas/reservas");
      console.log("- GET  /productos");
      console.log("- GET  /productos/:id");
      console.log("- POST /productos");
      console.log("- PUT  /productos/:id");
      console.log("- GET  /mesas/disponibles");
      console.log("- PATCH /pedidos/:id/estado");
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    await pool.end();
    process.exitCode = 1;
  }
}

iniciarServidor();
