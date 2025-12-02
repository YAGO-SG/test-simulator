// datapath.js - integra registers, alu e ram em um objeto Hardware
import { regs, resetRegs } from './registers.js';
import { alu, compute } from './alu.js';
import { ram } from './ram.js';

export const Hardware = {
    regs,
    ram,
    alu,

    reset() {
        // Reset apenas registradores e flags (comportamento original)
        resetRegs();
        alu.N = false;
        alu.Z = false;
    },

    compute(op, v1, v2) {
        return compute(op, v1, v2);
    }
};
