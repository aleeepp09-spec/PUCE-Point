import { Router } from "express";

import { RegistrarPedido } from "../application/registrarPedido.js";
import { ConsultarPedido } from "../application/consultarPedido.js";
import { GestionarPedido } from "../application/gestionarPedido.js";

import {
  verificarToken,
  verificarRol
} from "./verificarToken.js";

export function pedidoController(pedidoRepository, productoRepository) {
  const router = Router();

  const registrarPedido = new RegistrarPedido(
    pedidoRepository,
    productoRepository
  );

  const consultarPedido = new ConsultarPedido(pedidoRepository);
  const gestionarPedido = new GestionarPedido(pedidoRepository);

  // Registrar pedido con sus productos
  router.post("/", async (req, res) => {
    try {
      const pedido = await registrarPedido.ejecutar(req.body);

      res.status(201).json({
        mensaje: "Pedido registrado correctamente",
        datos: pedido
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Consultar todos los pedidos
  router.get("/", async (req, res) => {
    try {
      const pedidos = await consultarPedido.obtenerTodos();

      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Consultar pedido por ID
  router.get("/:id", async (req, res) => {
    try {
      const pedido = await consultarPedido.ejecutar(req.params.id);

      res.status(200).json(pedido);
    } catch (error) {
      const status =
        error.message === "No se encontró el pedido" ? 404 : 400;

      res.status(status).json({ error: error.message });
    }
  });

  // Actualizar estado: empleados y administradores
  router.patch(
    "/:id/estado",
    verificarToken,
    verificarRol("empleado", "administrador"),
    async (req, res) => {
      try {
        const pedido = await gestionarPedido.actualizarEstado(
          req.params.id,
          req.body.estado
        );

        res.status(200).json({
          mensaje: "Estado del pedido actualizado correctamente",
          datos: pedido
        });
      } catch (error) {
        const status =
          error.message === "No se encontró el pedido" ? 404 : 400;

        res.status(status).json({ error: error.message });
      }
    }
  );

  return router;
}
