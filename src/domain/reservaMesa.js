export class ReservaMesa {
  constructor({
    id,
    mesaId,
    nombreReservante,
    cantidadPersonas,
    fechaInicio,
    fechaFin,
    canal,
    estado = "pendiente"
  }) {
    this.id = id;
    this.mesaId = mesaId;
    this.nombreReservante = nombreReservante;
    this.cantidadPersonas = cantidadPersonas;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.canal = canal;
    this.estado = estado;
  }
}

