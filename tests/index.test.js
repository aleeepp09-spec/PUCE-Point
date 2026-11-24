import { describe, it, expect } from "vitest";
import { mensajeInicial } from "../src/index.js";

describe("Proyecto PUCE-Point", () => {
  it("debe mostrar el mensaje inicial", () => {
    expect(mensajeInicial()).toBe(
      "PUCE-Point: Sistema de gestion de pedidos, filas y mesas"
    );
  });
});
