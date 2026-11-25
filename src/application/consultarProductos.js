export class ConsultarProductos {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async obtenerTodos() {
    return await this.productoRepository.obtenerTodos();
  }

  async obtenerPorId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("El ID del producto no es válido");
    }

    const producto = await this.productoRepository.obtenerPorId(Number(id));

    if (!producto) {
      throw new Error("No se encontró el producto");
    }

    return producto;
  }
}