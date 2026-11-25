import { Pedido } from "../domain/pedido.js";

export class PostgresPedidoRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(pedido) {
    const resultado = await this.pool.query(
      `INSERT INTO pedidos (
        cliente_nombre,
        tipo_pedido,
        estado
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        pedido.clienteNombre,
        pedido.tipoPedido,
        pedido.estado
      ]
    );

    const fila = resultado.rows[0];

    return new Pedido({
      id: fila.id,
      clienteNombre: fila.cliente_nombre,
      tipoPedido: fila.tipo_pedido,
      estado: fila.estado,
      fechaCreacion: fila.fecha_creacion
    });
  }

  async obtenerTodos() {
    const resultado = await this.pool.query(
      "SELECT * FROM pedidos ORDER BY id"
    );

    return resultado.rows.map((fila) => new Pedido({
      id: fila.id,
      clienteNombre: fila.cliente_nombre,
      tipoPedido: fila.tipo_pedido,
      estado: fila.estado,
      fechaCreacion: fila.fecha_creacion
    }));
  }

  async obtenerPorId(id) {
    const resultado = await this.pool.query(
      "SELECT * FROM pedidos WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return new Pedido({
      id: fila.id,
      clienteNombre: fila.cliente_nombre,
      tipoPedido: fila.tipo_pedido,
      estado: fila.estado,
      fechaCreacion: fila.fecha_creacion
    });
  }
  
  async actualizarEstado(id, nuevoEstado) {
    const consulta = `
      UPDATE pedidos
      SET estado = $1
      WHERE id = $2
      RETURNING
        id,
        cliente_nombre,
        tipo_pedido,
        estado,
        fecha_creacion
    `;

    const resultado = await this.pool.query(consulta, [
      nuevoEstado,
      id
    ]);

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return {
      id: fila.id,
      clienteNombre: fila.cliente_nombre,
      tipoPedido: fila.tipo_pedido,
      estado: fila.estado,
      fechaCreacion: fila.fecha_creacion
    };
  }
  
async crearConDetalles(datosPedido) {
  const client = await this.pool.connect();

  try {
    await client.query("BEGIN");

    const pedidoResultado = await client.query(
      `INSERT INTO pedidos
        (cliente_nombre, tipo_pedido)
       VALUES ($1, $2)
       RETURNING id, cliente_nombre, tipo_pedido, estado, fecha_creacion`,
      [datosPedido.clienteNombre, datosPedido.tipoPedido]
    );

    const pedido = pedidoResultado.rows[0];
    const detalles = [];
    let total = 0;

    for (const detalle of datosPedido.detalles) {
      const resultado = await client.query(
        `INSERT INTO detalle_pedido
          (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)
         RETURNING id, producto_id, cantidad, precio_unitario`,
        [
          pedido.id,
          detalle.productoId,
          detalle.cantidad,
          detalle.precioUnitario
        ]
      );

      const fila = resultado.rows[0];
      const subtotal = Number(fila.precio_unitario) * fila.cantidad;

      total += subtotal;

      detalles.push({
        id: fila.id,
        productoId: fila.producto_id,
        cantidad: fila.cantidad,
        precioUnitario: Number(fila.precio_unitario),
        subtotal
        });
      }

      await client.query("COMMIT");

      return {
        id: pedido.id,
        clienteNombre: pedido.cliente_nombre,
        tipoPedido: pedido.tipo_pedido,
        estado: pedido.estado,
        fechaCreacion: pedido.fecha_creacion,
        detalles,
        total
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
