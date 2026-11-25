
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class IniciarSesion {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(correo, password) {
    if (!correo?.trim() || !password) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    const usuario = await this.usuarioRepository.obtenerPorCorreo(
      correo.trim().toLowerCase()
    );

    if (!usuario || !usuario.activo) {
      throw new Error("Credenciales incorrectas");
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValida) {
      throw new Error("Credenciales incorrectas");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("La configuración de autenticación no está disponible");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h"
      }
    );

    return {
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    };
  }
}
