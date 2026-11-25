
export class RegistrarPedido {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async ejecutar(datosPedido) {
    if (!datosPedido.clienteNombre?.trim()) {
      throw new Error("El nombre del cliente es obligatorio");
    }

    if (!["digital", "presencial"].includes(datosPedido.tipoPedido)) {
      throw new Error("El tipo de pedido no es válido");
    }

    if (
      !Array.isArray(datosPedido.detalles) ||
      datosPedido.detalles.length === 0
    ) {
      throw new Error("El pedido debe contener al menos un producto");
    }

    const productosUnicos = new Set(
      datosPedido.detalles.map((detalle) => Number(detalle.productoId))
    );

    if (productosUnicos.size !== datosPedido.detalles.length) {
      throw new Error("No debes repetir productos en el pedido");
    }

    const detallesValidados = [];

    for (const detalle of datosPedido.detalles) {
      const productoId = Number(detalle.productoId);
      const cantidad = Number(detalle.cantidad);

      if (!Number.isInteger(productoId) || productoId <= 0) {
        throw new Error("El ID del producto no es válido");
      }

      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error("La cantidad debe ser un número entero positivo");
      }

      const producto = await this.productoRepository.obtenerPorId(productoId);

      if (!producto) {
        throw new Error(`No existe el producto con ID ${productoId}`);
      }

      if (!producto.disponible) {
        throw new Error(`El producto ${producto.nombre} no está disponible`);
      }

      detallesValidados.push({
        productoId: producto.id,
        cantidad,
        precioUnitario: Number(producto.precio)
      });
    }

    const pedido = {
      clienteNombre: datosPedido.clienteNombre.trim(),
      tipoPedido: datosPedido.tipoPedido,
      detalles: detallesValidados
    };

    return await this.pedidoRepository.crearConDetalles(pedido);
  }
}
