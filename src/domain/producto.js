export class Producto {
  constructor({
    id,
    nombre,
    descripcion = "",
    precio,
    disponible = true
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = Number(precio);
    this.disponible = disponible;
  }
}