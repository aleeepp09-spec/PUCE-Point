export class ConsultarPedido {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async obtenerPorId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("El ID del pedido no es válido");
    }

    const pedido = await this.pedidoRepository.obtenerPorId(Number(id));

    if (!pedido) {
      throw new Error("No se encontró el pedido");
    }

    return pedido;
  }

  async obtenerTodos() {
    return await this.pedidoRepository.obtenerTodos();
  }
}