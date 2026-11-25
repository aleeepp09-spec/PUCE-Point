
import { describe, it, expect, vi } from "vitest";
import { GestionarPedido } from "../src/application/gestionarPedido.js";

describe("GestionarPedido", () => {
  it("debe permitir pasar de pendiente a preparando", async () => {
    const pedidoRepository = {
      obtenerPorId: vi.fn().mockResolvedValue({
        id: 1,
        estado: "pendiente"
      }),
      actualizarEstado: vi.fn().mockResolvedValue({
        id: 1,
        estado: "preparando"
      })
    };

    const gestionarPedido = new GestionarPedido(pedidoRepository);

    const resultado = await gestionarPedido.actualizarEstado(
      1,
      "preparando"
    );

    expect(resultado.estado).toBe("preparando");
    expect(pedidoRepository.actualizarEstado).toHaveBeenCalled();
  });

  it("debe rechazar una transición no permitida", async () => {
    const pedidoRepository = {
      obtenerPorId: vi.fn().mockResolvedValue({
        id: 1,
        estado: "pendiente"
      }),
      actualizarEstado: vi.fn()
    };

    const gestionarPedido = new GestionarPedido(pedidoRepository);

    await expect(
      gestionarPedido.actualizarEstado(1, "entregado")
    ).rejects.toThrow("No se puede cambiar");

    expect(pedidoRepository.actualizarEstado).not.toHaveBeenCalled();
  });

  it("debe rechazar un pedido inexistente", async () => {
    const pedidoRepository = {
      obtenerPorId: vi.fn().mockResolvedValue(null),
      actualizarEstado: vi.fn()
    };

    const gestionarPedido = new GestionarPedido(pedidoRepository);

    await expect(
      gestionarPedido.actualizarEstado(99, "preparando")
    ).rejects.toThrow("No se encontró el pedido");
  });

  it("debe rechazar un ID inválido", async () => {
    const pedidoRepository = {
      obtenerPorId: vi.fn(),
      actualizarEstado: vi.fn()
    };

    const gestionarPedido = new GestionarPedido(pedidoRepository);

    await expect(
      gestionarPedido.actualizarEstado(0, "preparando")
    ).rejects.toThrow("El ID del pedido no es válido");
  });
});
