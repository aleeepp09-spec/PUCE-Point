
export class PostgresUsuarioRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async obtenerPorCorreo(correo) {
    const consulta = `
      SELECT id, nombre, correo, password, rol, activo
      FROM usuarios
      WHERE correo = $1
    `;

    const resultado = await this.pool.query(consulta, [correo]);

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows[0];

    return {
      id: fila.id,
      nombre: fila.nombre,
      correo: fila.correo,
      password: fila.password,
      rol: fila.rol,
      activo: fila.activo
    };
  }

  async crear(usuario) {
    const consulta = `
      INSERT INTO usuarios (nombre, correo, password, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, correo, rol, activo
    `;

    const resultado = await this.pool.query(consulta, [
      usuario.nombre,
      usuario.correo,
      usuario.password,
      usuario.rol
    ]);

    return resultado.rows[0];
  }
}
