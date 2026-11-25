import express from "express";

import { pool, probarConexion } from "./persistence/connection.js";

// Repositorios
import { PostgresPedidoRepository } from "./persistence/pedidoRepository.js";
import { PostgresMesaRepository } from "./persistence/mesaRepository.js";
import { PostgresReservaRepository } from "./persistence/reservaRepository.js";
import { PostgresProductoRepository } from "./persistence/productoRepository.js";

// Controladores
import { pedidoController } from "./presentation/pedidoController.js";
import { mesaController } from "./presentation/mesaController.js";
import { productoController } from "./presentation/productoController.js";

const app = express();
const PUERTO = 3000;

app.use(express.json());

// Crear los repositorios
const pedidoRepository = new PostgresPedidoRepository(pool);
const mesaRepository = new PostgresMesaRepository(pool);
const reservaRepository = new PostgresReservaRepository(pool);
const productoRepository = new PostgresProductoRepository(pool);

// Registrar las rutas
app.use("/pedidos", pedidoController(pedidoRepository));

app.use(
  "/mesas",
  mesaController(mesaRepository, reservaRepository)
);

app.use(
  "/productos",
  productoController(productoRepository)
);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de PUCE-Point",
    estado: "Funcionando"
  });
});

// Ruta para comprobar el funcionamiento
app.get("/health", (req, res) => {
  res.status(200).json({
    estado: "OK",
    mensaje: "API funcionando correctamente"
  });
});

// Iniciar servidor
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
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    await pool.end();
    process.exitCode = 1;
  }
}

iniciarServidor();
