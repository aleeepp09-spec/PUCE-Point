
export class GestionarPedido {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async actualizarEstado(id, nuevoEstado) {
    const pedidoId = Number(id);

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      throw new Error("El ID del pedido no es válido");
    }

    const pedido = await this.pedidoRepository.obtenerPorId(pedidoId);

    if (!pedido) {
      throw new Error("No se encontró el pedido");
    }

    const transicionesPermitidas = {
      pendiente: ["preparando", "cancelado"],
      preparando: ["listo", "cancelado"],
      listo: ["entregado"],
      entregado: [],
      cancelado: []
    };

    const siguientesEstados = transicionesPermitidas[pedido.estado];

    if (!siguientesEstados?.includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar el pedido de ${pedido.estado} a ${nuevoEstado}`
      );
    }

    return await this.pedidoRepository.actualizarEstado(
      pedidoId,
      nuevoEstado
    );
  }
}
