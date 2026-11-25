import { Router } from "express";

import { RegistrarProducto } from "../application/registrarProducto.js";
import { ConsultarProductos } from "../application/consultarProductos.js";
import { ActualizarProducto } from "../application/actualizarProducto.js";


import {
  verificarToken,
  verificarRol
} from "./verificarToken.js";

export function productoController(productoRepository) {
  const router = Router();

  const registrarProducto = new RegistrarProducto(productoRepository);
  const consultarProductos = new ConsultarProductos(productoRepository);
  const actualizarProducto = new ActualizarProducto(productoRepository);

  // Registrar producto: solo administrador
  router.post(
    "/",
    verificarToken,
    verificarRol("administrador"),
    async (req, res) => {
      try {
        const producto = await registrarProducto.ejecutar(req.body);

        res.status(201).json({
          mensaje: "Producto registrado correctamente",
          datos: producto
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Consultar todos los productos
  router.get("/", async (req, res) => {
    try {
      const productos = await consultarProductos.obtenerTodos();

      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Consultar producto por ID
  router.get("/:id", async (req, res) => {
    try {
      const producto = await consultarProductos.obtenerPorId(
        req.params.id
      );

      res.status(200).json(producto);
    } catch (error) {
      const status =
        error.message === "No se encontró el producto" ? 404 : 400;

      res.status(status).json({ error: error.message });
    }
  });

  // Actualizar producto: solo administrador
  router.put(
    "/:id",
    verificarToken,
    verificarRol("administrador"),
    async (req, res) => {
      try {
        const producto = await actualizarProducto.ejecutar(
          req.params.id,
          req.body
        );

        res.status(200).json({
          mensaje: "Producto actualizado correctamente",
          datos: producto
        });
      } catch (error) {
        const status =
          error.message === "No se encontró el producto" ? 404 : 400;

        res.status(status).json({ error: error.message });
      }
    }
  );

  return router;
}
