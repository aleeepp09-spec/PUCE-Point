import { Producto } from "../domain/producto.js";

export class PostgresProductoRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(producto) {
    const resultado = await this.pool.query(
      `INSERT INTO productos (
        nombre,
        descripcion,
        precio,
        disponible
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.disponible
      ]
    );

    const fila = resultado.rows[0];

    return new Producto({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      disponible: fila.disponible
    });
  }

  async obtenerTodos() {
    const resultado = await this.pool.query(
      "SELECT * FROM productos ORDER BY id"
    );

    return resultado.rows.map((fila) => new Producto({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      disponible: fila.disponible
    }));
  }

  async obtenerPorId(id) {
    const resultado = await this.pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return new Producto({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      disponible: fila.disponible
    });
  }

  async actualizar(producto) {
    const resultado = await this.pool.query(
      `UPDATE productos
       SET nombre = $1,
           descripcion = $2,
           precio = $3,
           disponible = $4
       WHERE id = $5
       RETURNING *`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.disponible,
        producto.id
      ]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return new Producto({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      disponible: fila.disponible
    });
  }
}