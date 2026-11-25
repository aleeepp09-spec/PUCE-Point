import { Producto } from "../domain/producto.js";

export class RegistrarProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async ejecutar(datosProducto) {
    if (!datosProducto.nombre?.trim()) {
      throw new Error("El nombre del producto es obligatorio");
    }

    if (
      datosProducto.precio === undefined ||
      !Number.isFinite(Number(datosProducto.precio)) ||
      Number(datosProducto.precio) < 0
    ) {
      throw new Error("El precio del producto no es válido");
    }

    const producto = new Producto({
      nombre: datosProducto.nombre.trim(),
      descripcion: datosProducto.descripcion || "",
      precio: datosProducto.precio,
      disponible: datosProducto.disponible ?? true
    });

    return await this.productoRepository.crear(producto);
  }
}