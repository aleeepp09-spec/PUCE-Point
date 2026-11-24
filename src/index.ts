/**
 * Proyecto base de Arquitectura de Software — Semana 1.
 * En semanas posteriores evolucionará hacia una API organizada por capas,
 * un monolito modular y una arquitectura hexagonal.
 */
export function mensajeInicial(): string {
  return "Arquitectura de Software — Semana 1";
}

if (require.main === module) {
  console.log(mensajeInicial());
}
