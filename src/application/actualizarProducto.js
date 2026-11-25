
export class ActualizarProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(id, datosProducto) {
    // Validar el ID
    const productoId = Number(id);

    if (!Number.isInteger(productoId) || productoId <= 0) {
      throw new Error("El ID del producto no es válido");
    }

    // Verificar que el producto exista
    const productoExistente =
      await this.productoRepository.obtenerPorId(productoId);

    if (!productoExistente) {
      throw new Error("No se encontró el producto");
    }

    // Validar el nombre
    if (
      typeof datosProducto.nombre !== "string" ||
      !datosProducto.nombre.trim()
    ) {
      throw new Error("El nombre del producto es obligatorio");
    }

    // Validar el precio
    const precio = Number(datosProducto.precio);

    if (!Number.isFinite(precio) || precio < 0) {
      throw new Error("El precio del producto no es válido");
    }

    // Validar la disponibilidad
    if (
      datosProducto.disponible !== undefined &&
      typeof datosProducto.disponible !== "boolean"
    ) {
      throw new Error("La disponibilidad debe ser verdadera o falsa");
    }

    // Preparar los datos actualizados
    const productoActualizado = {
      nombre: datosProducto.nombre.trim(),
      descripcion: datosProducto.descripcion ?? "",
      precio,
      disponible: datosProducto.disponible ?? true
    };

    // Actualizar el producto en la base de datos
    return await this.productoRepository.actualizar(
      productoId,
      productoActualizado
    );
  }
}
