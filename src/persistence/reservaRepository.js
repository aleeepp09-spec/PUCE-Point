import { ReservaMesa } from "../domain/reservaMesa.js";

export class PostgresReservaRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(reserva) {
    const cliente = await this.pool.connect();

    try {
      await cliente.query("BEGIN");

      // Bloqueamos la mesa para evitar reservas simultáneas.
      const mesa = await cliente.query(
        "SELECT id FROM mesas WHERE id = $1 FOR UPDATE",
        [reserva.mesaId]
      );

      if (mesa.rows.length === 0) {
        throw new Error("La mesa no existe");
      }

      // Comprobamos si existe otra reserva en ese horario.
      const conflicto = await cliente.query(
        `SELECT id
         FROM reservas_mesa
         WHERE mesa_id = $1
         AND estado IN ('pendiente', 'confirmada')
         AND fecha_inicio < $3
         AND fecha_fin > $2
         LIMIT 1`,
        [
          reserva.mesaId,
          reserva.fechaInicio,
          reserva.fechaFin
        ]
      );

      if (conflicto.rows.length > 0) {
        throw new Error("La mesa ya está reservada en ese horario");
      }

      const resultado = await cliente.query(
        `INSERT INTO reservas_mesa (
          mesa_id,
          nombre_reservante,
          cantidad_personas,
          fecha_inicio,
          fecha_fin,
          canal,
          estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          reserva.mesaId,
          reserva.nombreReservante,
          reserva.cantidadPersonas,
          reserva.fechaInicio,
          reserva.fechaFin,
          reserva.canal,
          reserva.estado
        ]
      );

      await cliente.query("COMMIT");

      const fila = resultado.rows[0];

      return new ReservaMesa({
        id: fila.id,
        mesaId: fila.mesa_id,
        nombreReservante: fila.nombre_reservante,
        cantidadPersonas: fila.cantidad_personas,
        fechaInicio: fila.fecha_inicio,
        fechaFin: fila.fecha_fin,
        canal: fila.canal,
        estado: fila.estado
      });

    } catch (error) {
      await cliente.query("ROLLBACK");
      throw error;
    } finally {
      cliente.release();
    }
  }

  async obtenerTodas() {
    const resultado = await this.pool.query(
      "SELECT * FROM reservas_mesa ORDER BY fecha_inicio"
    );

    return resultado.rows.map((fila) => new ReservaMesa({
      id: fila.id,
      mesaId: fila.mesa_id,
      nombreReservante: fila.nombre_reservante,
      cantidadPersonas: fila.cantidad_personas,
      fechaInicio: fila.fecha_inicio,
      fechaFin: fila.fecha_fin,
      canal: fila.canal,
      estado: fila.estado
    }));
  }
}