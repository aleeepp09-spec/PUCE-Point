# Proyecto integrador · Arquitectura de Software

## Semana 1: contexto y entorno base

### Propósito
Este repositorio comienza como una aplicación mínima en TypeScript. Durante el semestre evolucionará por etapas: drivers, monolito en capas, modularidad, arquitectura hexagonal, gobernanza, contenedores, servicios, eventos y resiliencia.

### Requisitos
- Node.js LTS
- npm
- Git
- Cuenta de GitHub para quien creará el repositorio remoto

### Instalar y comprobar el proyecto
Abre una terminal en la carpeta `starter-project` y ejecuta:

```bash
npm install
npm run dev
npm test
npm run build
```

`npm install` crea `package-lock.json` cuando no existe. Inclúyelo en el commit inicial para que el equipo conserve la misma resolución de dependencias.

### Completar por el equipo
- Nombre del sistema:
- Integrantes:
- Problema que resuelve:
- Usuarios/interesados:
- Alcance inicial:
- Restricciones conocidas:
- Preguntas por investigar:

### Estructura inicial
```text
src/index.ts
tests/index.test.ts
docs/bitacora.md
docs/contexto.md
docs/github.md
```

### Convenciones iniciales
- Usen commits descriptivos.
- No incluyan secretos, contraseñas, tokens ni archivos `.env` en el repositorio.
- No versionen `node_modules/` ni `dist/`; están excluidos en `.gitignore`.
- Documenten decisiones y cambios en `docs/bitacora.md`.
- El proyecto es didáctico: no incorporen datos personales reales.

### Publicar y compartir el repositorio
Sigan el paso a paso de [`docs/github.md`](docs/github.md) para inicializar Git, crear el repositorio remoto vacío, subir la rama `main` e invitar a los integrantes.

