// registers.js
const _initial = {
    PC:0, AC:0, SP:4095,
    IR:0, TIR:0, MAR:0, MBR:0, A:0
};

export const regs = {
    PC: _initial.PC,
    AC: _initial.AC,
    SP: _initial.SP,
    IR: _initial.IR,
    TIR: _initial.TIR,
    MAR: _initial.MAR,
    MBR: _initial.MBR,
    A: _initial.A
};

export function resetRegs() {
    Object.keys(_initial).forEach(k => { regs[k] = _initial[k]; });
}
