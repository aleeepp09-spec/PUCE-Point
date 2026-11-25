export class Pedido {
  constructor({
    id,
    clienteNombre,
    tipoPedido,
    estado = "pendiente",
    fechaCreacion = new Date()
  }) {
    this.id = id;
    this.clienteNombre = clienteNombre;
    this.tipoPedido = tipoPedido;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
  }
}
