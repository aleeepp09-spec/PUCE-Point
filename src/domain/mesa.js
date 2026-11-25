export class Mesa {
  constructor({ id, numero, capacidad, activa = true }) {
    this.id = id;
    this.numero = numero;
    this.capacidad = capacidad;
    this.activa = activa;
  }
}