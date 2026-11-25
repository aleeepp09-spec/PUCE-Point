import express from "express";

// Conexión a la base de datos
import { pool } from "./persistence/connection.js";

// Repositorios
import { PostgresPedidoRepository } from "./persistence/pedidoRepository.js";
import { PostgresMesaRepository } from "./persistence/mesaRepository.js";
import { PostgresReservaRepository } from "./persistence/reservaRepository.js";
import { PostgresProductoRepository } from "./persistence/productoRepository.js";

// Controladores
import { pedidoController } from "./presentation/pedidoController.js";
import { mesaController } from "./presentation/mesaController.js";
import { productoController } from "./presentation/productoController.js";
import { PostgresUsuarioRepository } from "./persistence/usuarioRepository.js";
import { authController } from "./presentation/authController.js";

const app = express();

// Middleware
app.use(express.json());

// Crear repositorios
const pedidoRepository = new PostgresPedidoRepository(pool);
const mesaRepository = new PostgresMesaRepository(pool);
const reservaRepository = new PostgresReservaRepository(pool);
const productoRepository = new PostgresProductoRepository(pool);
const usuarioRepository = new PostgresUsuarioRepository(pool);
// Registrar rutas
app.use(
  "/pedidos",
  pedidoController(pedidoRepository, productoRepository)
);
app.use("/mesas", mesaController(mesaRepository, reservaRepository));
app.use("/productos", productoController(productoRepository));
app.use("/auth", authController(usuarioRepository));

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de PUCE-Point",
    estado: "Funcionando"
  });
});

// Comprobar funcionamiento
app.get("/health", (req, res) => {
  res.status(200).json({
    estado: "OK",
    mensaje: "API funcionando correctamente"
  });
});

export default app;
