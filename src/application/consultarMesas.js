
export class ConsultarMesas {
  constructor(mesaRepository, reservaRepository) {
    this.mesaRepository = mesaRepository;
    this.reservaRepository = reservaRepository;
  }

  async obtenerTodas() {
    return await this.mesaRepository.obtenerTodas();
  }

  async consultarDisponibilidad(fechaInicio, fechaFin, cantidadPersonas) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const personas = Number(cantidadPersonas);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fin.getTime()) ||
      fin <= inicio
    ) {
      throw new Error("El rango de fechas no es válido");
    }

    if (!Number.isInteger(personas) || personas <= 0) {
      throw new Error("La cantidad de personas no es válida");
    }

    const mesas = await this.mesaRepository.obtenerTodas();
    const reservas = await this.reservaRepository.obtenerTodas();

    return mesas.filter((mesa) => {
      if (!mesa.activa || mesa.capacidad < personas) {
        return false;
      }

      const tieneReserva = reservas.some((reserva) => {
        const estadoActivo = ["pendiente", "confirmada"].includes(
          reserva.estado
        );

        const mismaMesa = reserva.mesaId === mesa.id;

        const reservaInicio = new Date(reserva.fechaInicio);
        const reservaFin = new Date(reserva.fechaFin);

        const hayCruce =
          inicio < reservaFin && fin > reservaInicio;

        return estadoActivo && mismaMesa && hayCruce;
      });

      return !tieneReserva;
    });
  }
}
