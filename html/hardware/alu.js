// html/hardware/alu.js
export const alu = { N: false, Z: false };

export function compute(op, v1, v2) {
    let res = 0;
    // Garante tratamento de 16 bits
    v1 = v1 & 0xFFFF;
    v2 = v2 & 0xFFFF;

    switch(op) {
        case 'add': res = v1 + v2; break;
        case 'sub': res = v1 - v2; break;
        case 'band': res = v1 & v2; break; // AND bit a bit
        case 'inv': res = ~v1; break;      // NOT
        case 'lshift': res = v1 << 1; break;
        case 'rshift': res = v1 >> 1; break; // Adicionado
        case 'pass': res = v1; break;      // Identidade (passa A)
        case 'pass_b': res = v2; break;    // Identidade (passa B) - util para testes
        case 'inc': res = v1 + 1; break;   // Util para SP
        case 'dec': res = v1 - 1; break;   // Util para SP
        default: res = 0; break;
    }

    // Truncar para 16 bits
    const res16 = res & 0xFFFF;
    
    // Atualizar Flags (N = bit 15, Z = tudo zero)
    alu.N = (res16 & 0x8000) !== 0;
    alu.Z = (res16 === 0);
    
    return res16;
}