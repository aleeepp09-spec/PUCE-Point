const pedidos = [];

export function guardarPedido(pedido) {
  pedidos.push(pedido);
  return pedido;
}

export function obtenerPedidos() {
  return pedidos;
}

export function obtenerPedidoPorId(id) {
  return pedidos.find((pedido) => pedido.id === id);
}
