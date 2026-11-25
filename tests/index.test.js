import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Proyecto PUCE-Point", () => {
  it("debe mostrar el mensaje inicial", async () => {
    const respuesta = await request(app).get("/");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      mensaje: "Bienvenido a la API de PUCE-Point",
      estado: "Funcionando"
    });
  });

  it("debe comprobar el estado de la API", async () => {
    const respuesta = await request(app).get("/health");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.estado).toBe("OK");
  });
});
