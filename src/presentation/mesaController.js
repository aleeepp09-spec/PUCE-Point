import { Router } from "express";
import { ReservarMesa } from "../application/reservarMesa.js";
import { ConsultarMesas } from "../application/consultarMesas.js";

export function mesaController(mesaRepository, reservaRepository) {
  const router = Router();

  const reservarMesa = new ReservarMesa(
    mesaRepository,
    reservaRepository
  );

  const consultarMesas = new ConsultarMesas(
     mesaRepository,
    reservaRepository
 );

  // Consultar todas las mesas
  router.get("/", async (req, res) => {
    try {
      const mesas = await mesaRepository.obtenerTodas();
      res.status(200).json(mesas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Registrar una reserva
  router.post("/reservas", async (req, res) => {
    try {
      const reserva = await reservarMesa.ejecutar(req.body);

      res.status(201).json({
        mensaje: "Reserva registrada correctamente",
        datos: reserva
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Consultar todas las reservas
  router.get("/reservas", async (req, res) => {
    try {
      const reservas = await reservaRepository.obtenerTodas();
      res.status(200).json(reservas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/disponibles", async (req, res) => {
  try {
    const { fechaInicio, fechaFin, cantidadPersonas } = req.query;

    const mesas = await consultarMesas.consultarDisponibilidad(
      fechaInicio,
      fechaFin,
      cantidadPersonas
    );

    res.status(200).json({
      mensaje: "Mesas disponibles consultadas correctamente",
      datos: mesas
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  return router;
}