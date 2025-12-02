/**
 * constants.js - Especificação Completa da MIC-1
 * Todas as instruções base e macroinstruções conforme tabela de especificação
 * Formato: binário | Mnemônico | Instrução | Significado
 */

// ===== INSTRUÇÕES BASE (16 opcodes principais) =====
export const OPCODES = {
    // Instruções Diretas (0000-0111)
    "LODD": 0x0000,  // 0000 xxxx xxxx xxxx - Carrega Direto
    "STOD": 0x1000,  // 0001 xxxx xxxx xxxx - Armazena Direto
    "ADDD": 0x2000,  // 0010 xxxx xxxx xxxx - Adiciona Direto
    "SUBD": 0x3000,  // 0011 xxxx xxxx xxxx - Subtrai Direto
    "JPOS": 0x0400,  // 0100 xxxx xxxx xxxx - Desvia se positivo
    "JZER": 0x0500,  // 0101 xxxx xxxx xxxx - Desvia se zero
    "JUMP": 0x0600,  // 0110 xxxx xxxx xxxx - Desvia
    "LOCO": 0x0700,  // 0111 xxxx xxxx xxxx - Carrega Constante

    // Instruções Locais (1000-1101)
    "LODL": 0x0800,  // 1000 xxxx xxxx xxxx - Carrega Local
    "STOL": 0x0900,  // 1001 xxxx xxxx xxxx - Armazena Local
    "ADDL": 0x0A00,  // 1010 xxxx xxxx xxxx - Adiciona Local
    "SUBL": 0x0B00,  // 1011 xxxx xxxx xxxx - Subtrai Local
    "JNEG": 0x0C00,  // 1100 xxxx xxxx xxxx - Desvia se negativo
    "JNZE": 0x0D00,  // 1101 xxxx xxxx xxxx - Desvia se não zero
    "CALL": 0x0E00   // 1110 xxxx xxxx xxxx - Chama proced.
};

// ===== MACROINSTRUÇÕES (1111 xxxx xxxx xxxx) =====
export const MACROINSTRUCOES = {
    "PSHI": {
        codigo: 0xF000,        // 1111 0000 0000 0000
        binario: "1111000000000000",
        mnemonica: "PSHI",
        instrucao: "Empilha indireto",
        significado: "sp--; m[sp]=m[ac];"
    },
    "POPI": {
        codigo: 0xF100,        // 1111 0001 0000 0000
        binario: "1111000100000000",
        mnemonica: "POPI",
        instrucao: "Desempilha indireto",
        significado: "m[sp]=m[ac]; sp++"
    },
    "PUSH": {
        codigo: 0xF200,        // 1111 0010 0000 0000
        binario: "1111001000000000",
        mnemonica: "PUSH",
        instrucao: "Coloca na pilha",
        significado: "Sp--; m[sp]=ac"
    },
    "POP": {
        codigo: 0xF300,        // 1111 0011 0000 0000
        binario: "1111001100000000",
        mnemonica: "POP",
        instrucao: "Retira da pilha",
        significado: "ac=m[sp]; sp++"
    },
    "RETN": {
        codigo: 0xF400,        // 1111 0100 0000 0000
        binario: "1111010000000000",
        mnemonica: "RETN",
        instrucao: "Retorna",
        significado: "pc=m[sp];sp++"
    },
    "SWAP": {
        codigo: 0xF500,        // 1111 0101 0000 0000
        binario: "1111010100000000",
        mnemonica: "SWAP",
        instrucao: "Troca ac com sp",
        significado: "temp:=ac;ac:=sp;sp:=temp;"
    },
    "INSP": {
        codigo: 0xF600,        // 1111 0110 yyyy yyyy
        binario: "1111011000000000",
        mnemonica: "INSP",
        instrucao: "Incrementa sp",
        significado: "sp=sp+y"
    },
    "DESP": {
        codigo: 0xF700,        // 1111 0111 yyyy yyyy
        binario: "1111011100000000",
        mnemonica: "DESP",
        instrucao: "Decrementa sp",
        significado: "sp=sp-y"
    }
};

// ===== TABELA UNIFICADA PARA REFERÊNCIA =====
export const TODAS_INSTRUCOES = {
    ...OPCODES,
    ...Object.keys(MACROINSTRUCOES).reduce((acc, key) => {
        acc[key] = MACROINSTRUCOES[key].codigo;
        return acc;
    }, {})
};

// ===== ESPECIFICAÇÃO DETALHADA (para documentação e UI) =====
export const SPEC_MIC1 = {
    instrucoesBase: [
        { binario: "0000xxxxxxxxxxxx", mnemonica: "LODD", instrucao: "Carrega Direto", significado: "ac=m[x]" },
        { binario: "0001xxxxxxxxxxxx", mnemonica: "STOD", instrucao: "Armazena Direto", significado: "m[x] = ac" },
        { binario: "0010xxxxxxxxxxxx", mnemonica: "ADDD", instrucao: "Adiciona Direto", significado: "ac=ac+m[x]" },
        { binario: "0011xxxxxxxxxxxx", mnemonica: "SUBD", instrucao: "Subtrai Direto", significado: "ac=ac-m[x]" },
        { binario: "0100xxxxxxxxxxxx", mnemonica: "JPOS", instrucao: "Desvia se positivo", significado: "if ac≥0 then pc=x" },
        { binario: "0101xxxxxxxxxxxx", mnemonica: "JZER", instrucao: "Desvia se zero", significado: "if ac=0 then pc=x" },
        { binario: "0110xxxxxxxxxxxx", mnemonica: "JUMP", instrucao: "Desvia", significado: "pc=x" },
        { binario: "0111xxxxxxxxxxxx", mnemonica: "LOCO", instrucao: "Carrega Constante", significado: "ac=x" },
        { binario: "1000xxxxxxxxxxxx", mnemonica: "LODL", instrucao: "Carrega Local", significado: "ac=m[x+sp]" },
        { binario: "1001xxxxxxxxxxxx", mnemonica: "STOL", instrucao: "Armazena Local", significado: "m[x+sp]=ac" },
        { binario: "1010xxxxxxxxxxxx", mnemonica: "ADDL", instrucao: "Adiciona Local", significado: "ac=ac+m[x+sp]" },
        { binario: "1011xxxxxxxxxxxx", mnemonica: "SUBL", instrucao: "Subtrai Local", significado: "ac=ac-m[x+sp]" },
        { binario: "1100xxxxxxxxxxxx", mnemonica: "JNEG", instrucao: "Desvia se negativo", significado: "if ac<0 then pc=x" },
        { binario: "1101xxxxxxxxxxxx", mnemonica: "JNZE", instrucao: "Desvia se não zero", significado: "if ac≠0 then pc=x" },
        { binario: "1110xxxxxxxxxxxx", mnemonica: "CALL", instrucao: "Chama proced.", significado: "sp--; m[sp]=pc;pc=x" }
    ],
    macroinstrucoes: [
        { binario: "1111000000000000", mnemonica: "PSHI", instrucao: "Empilha indireto", significado: "sp--; m[sp]=m[ac];" },
        { binario: "1111000100000000", mnemonica: "POPI", instrucao: "Desempilha indireto", significado: "m[sp]=m[ac]; sp++" },
        { binario: "1111001000000000", mnemonica: "PUSH", instrucao: "Coloca na pilha", significado: "sp--; m[sp]=ac" },
        { binario: "1111001100000000", mnemonica: "POP", instrucao: "Retira da pilha", significado: "ac=m[sp]; sp++" },
        { binario: "1111010000000000", mnemonica: "RETN", instrucao: "Retorna", significado: "pc=m[sp];sp++" },
        { binario: "1111010100000000", mnemonica: "SWAP", instrucao: "Troca ac com sp", significado: "temp:=ac;ac:=sp;sp:=temp;" },
        { binario: "1111011000000000", mnemonica: "INSP", instrucao: "Incrementa sp", significado: "sp=sp+y" },
        { binario: "1111011100000000", mnemonica: "DESP", instrucao: "Decrementa sp", significado: "sp=sp-y" }
    ]
};

// ===== FUNÇÃO AUXILIAR DE BUSCA =====
export function getInstrucaoInfo(mnemonica) {
    if (OPCODES[mnemonica] !== undefined) {
        return {
            tipo: "base",
            codigo: OPCODES[mnemonica],
            mnemonica: mnemonica,
            info: SPEC_MIC1.instrucoesBase.find(i => i.mnemonica === mnemonica)
        };
    }
    if (MACROINSTRUCOES[mnemonica]) {
        return {
            tipo: "macro",
            ...MACROINSTRUCOES[mnemonica],
            info: SPEC_MIC1.macroinstrucoes.find(i => i.mnemonica === mnemonica)
        };
    }
    return null;
}
