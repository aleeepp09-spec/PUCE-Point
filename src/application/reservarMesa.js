import { ReservaMesa } from "../domain/reservaMesa.js";

export class ReservarMesa {
  constructor(mesaRepository, reservaRepository) {
    this.mesaRepository = mesaRepository;
    this.reservaRepository = reservaRepository;
  }

  async ejecutar(datosReserva) {
    const mesa = await this.mesaRepository.obtenerPorId(datosReserva.mesaId);

    if (!mesa || !mesa.activa) {
      throw new Error("La mesa no existe o no está activa");
    }

    if (datosReserva.cantidadPersonas > mesa.capacidad) {
      throw new Error("La cantidad de personas supera la capacidad de la mesa");
    }

    if (datosReserva.cantidadPersonas <= 0) {
      throw new Error("La cantidad de personas debe ser mayor que cero");
    }

    if (!["digital", "presencial"].includes(datosReserva.canal)) {
      throw new Error("El canal de reserva no es válido");
    }

    if (
        !datosReserva.fechaInicio ||
        !datosReserva.fechaFin ||
        new Date(datosReserva.fechaFin) <= new Date(datosReserva.fechaInicio)
        ) {
        throw new Error("El horario de reserva no es válido");
    }

    const reserva = new ReservaMesa(datosReserva);

    return await this.reservaRepository.crear(reserva);
  }
}