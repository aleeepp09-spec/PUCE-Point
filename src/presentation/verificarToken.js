import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No se proporcionó un token de autenticación"
    });
  }

  const token = encabezado.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "La autenticación no está configurada"
      });
    }

    const datosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = datosUsuario;

    next();
  } catch {
    return res.status(401).json({
      error: "El token no es válido o ha expirado"
    });
  }
}

export function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta operación"
      });
    }

    next();
  };
}
