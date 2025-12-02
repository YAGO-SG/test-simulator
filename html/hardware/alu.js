// alu.js
export const alu = { N: false, Z: false };

export function compute(op, v1, v2) {
    let res = 0;
    v1 = v1 & 0xFFFF;
    v2 = v2 & 0xFFFF;

    switch(op) {
        case 'add': res = v1 + v2; break;
        case 'sub': res = v1 - v2; break;
        case 'band': res = v1 & v2; break;
        case 'inv': res = ~v1; break;
        case 'lshift': res = v1 << 1; break;
        case 'pass': res = v1; break;
        default: res = 0; break;
    }

    const res16 = res & 0xFFFF;
    alu.N = (res16 & 0x8000) !== 0;
    alu.Z = (res16 === 0);
    return res16;
}
