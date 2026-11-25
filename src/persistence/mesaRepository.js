import { Mesa } from "../domain/mesa.js";

export class PostgresMesaRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(mesa) {
    const resultado = await this.pool.query(
      `INSERT INTO mesas (
        numero,
        capacidad,
        activa
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        mesa.numero,
        mesa.capacidad,
        mesa.activa
      ]
    );

    const fila = resultado.rows[0];

    return new Mesa({
      id: fila.id,
      numero: fila.numero,
      capacidad: fila.capacidad,
      activa: fila.activa
    });
  }

  async obtenerTodas() {
    const resultado = await this.pool.query(
      "SELECT * FROM mesas ORDER BY numero"
    );

    return resultado.rows.map((fila) => new Mesa({
      id: fila.id,
      numero: fila.numero,
      capacidad: fila.capacidad,
      activa: fila.activa
    }));
  }

  async obtenerPorId(id) {
    const resultado = await this.pool.query(
      "SELECT * FROM mesas WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return new Mesa({
      id: fila.id,
      numero: fila.numero,
      capacidad: fila.capacidad,
      activa: fila.activa
    });
  }
}