import { Router } from "express";
import { IniciarSesion } from "../application/iniciarSesion.js";

export function authController(usuarioRepository) {
  const router = Router();

  const iniciarSesion = new IniciarSesion(usuarioRepository);

  router.post("/login", async (req, res) => {
    try {
      const { correo, password } = req.body;

      const resultado = await iniciarSesion.ejecutar(
        correo,
        password
      );

      res.status(200).json(resultado);
    } catch (error) {
      const status = error.message === "Credenciales incorrectas"
        ? 401
        : 400;

      res.status(status).json({
        error: error.message
      });
    }
  });

  return router;
}
