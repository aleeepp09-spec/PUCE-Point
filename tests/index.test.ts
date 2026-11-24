import { describe, expect, it } from 'vitest';
import { mensajeInicial } from '../src/index';

describe('mensajeInicial', () => {
  it('devuelve el mensaje de bienvenida del proyecto', () => {
    expect(mensajeInicial()).toBe('Arquitectura de Software — Semana 1');
  });
});
