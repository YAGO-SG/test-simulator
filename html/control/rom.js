// html/control/rom.js
// Microprograma completo do MIC-1 (ISA Tanenbaum)
export const ROM = [];

/**
 * Helper para adicionar linhas na ROM
 * @param {number} addr - Endereço na ROM (MPC)
 * @param {string} txt - Texto descritivo (Assembly Microinstrução)
 * @param {Array} actions - Lista de ações {t:'x'|'alu'|'rd'|'wr', ...}
 * @param {number} next - Próximo endereço padrão
 * @param {Object} jump - Objeto de salto condicional {c:'N'|'Z', to: addr}
 */
export const addLine = (addr, txt, actions, next, jump) => {
    ROM[addr] = { text: txt, actions: actions || [], next: next, jump: jump };
};

// =================================================================
// 1. CICLO DE BUSCA (FETCH) - Linhas 0-1
// =================================================================
// 0: MAR := PC; RD;
addLine(0, "BUSCA: mar:=pc; rd;", [{t:'x',s:'PC',d:'MAR'},{t:'rd'}], 1);
// 1: PC := PC + 1; RD;
addLine(1, "BUSCA: pc:=pc+1; rd;", [{t:'alu',op:'inc',s1:'PC',d:'PC'},{t:'rd'}], 2);

// =================================================================
// 2. DECODIFICAÇÃO (DECODE TREE) - Linhas 2-35 (aprox)
// A árvore verifica os bits do IR (Instruction Register) para saber para onde ir.
// IR tem 16 bits. Opcode são os 4 bits superiores (15-12).
// =================================================================

// 2: IR := MBR; if N goto 28 (Bit 15 é 1? 1xxx)
addLine(2, "DECODE: ir:=mbr; if ir[15] goto 28", [{t:'x',s:'MBR',d:'IR'},{t:'alu',op:'pass',s1:'MBR'}], 3, {c:'N',to:28});

// --- Ramo 0xxx (Bit 15 = 0) ---
// 3: TIR := LSHIFT(IR); if N goto 19 (Bit 14 é 1? 01xx)
addLine(3, "DECODE: tir:=lshift(ir); if ir[14] goto 19", [{t:'alu',op:'lshift',s1:'IR',d:'TIR'}], 4, {c:'N',to:19});

// --- Ramo 00xx (Bit 14 = 0) ---
// 4: TIR := LSHIFT(TIR); if N goto 11 (Bit 13 é 1? 001x)
addLine(4, "DECODE: tir:=lshift(tir); if ir[13] goto 11", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 5, {c:'N',to:11});

// --- Ramo 000x (Bit 13 = 0) ---
// 5: TIR := LSHIFT(TIR); if N goto 9 (Bit 12 é 1? 0001 STOD). Senão 0000 LODD (6)
addLine(5, "DECODE: tir:=lshift(tir); if ir[12] goto 9", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 6, {c:'N',to:9});

// --- Ramo 001x (Bit 13 = 1) ---
// 11: TIR := LSHIFT(TIR); if N goto 15 (Bit 12 é 1? 0011 SUBD). Senão 0010 ADDD (12)
addLine(11, "DECODE: tir:=lshift(tir); if ir[12] goto 15", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 12, {c:'N',to:15});

// --- Ramo 01xx (Bit 14 = 1) ---
// 19: TIR := LSHIFT(TIR); if N goto 23 (Bit 13 é 1? 011x)
addLine(19, "DECODE: tir:=lshift(tir); if ir[13] goto 23", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 20, {c:'N',to:23});

// --- Ramo 010x (Bit 13 = 0) ---
// 20: TIR := LSHIFT(TIR); if N goto 22 (Bit 12 é 1? 0101 JZER). Senão 0100 JPOS (21)
addLine(20, "DECODE: tir:=lshift(tir); if ir[12] goto 22", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 21, {c:'N',to:22});

// --- Ramo 011x (Bit 13 = 1) ---
// 23: TIR := LSHIFT(TIR); if N goto 25 (Bit 12 é 1? 0111 LOCO). Senão 0110 JUMP (24)
addLine(23, "DECODE: tir:=lshift(tir); if ir[12] goto 25", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 24, {c:'N',to:25});


// --- Ramo 1xxx (Bit 15 = 1) ---
// 28: TIR := LSHIFT(IR); if N goto 32 (Bit 14 é 1? 11xx)
addLine(28, "DECODE: tir:=lshift(ir); if ir[14] goto 32", [{t:'alu',op:'lshift',s1:'IR',d:'TIR'}], 29, {c:'N',to:32});

// --- Ramo 10xx (Bit 14 = 0) ---
// 29: TIR := LSHIFT(TIR); if N goto 31 (Bit 13 é 1? 101x)
addLine(29, "DECODE: tir:=lshift(tir); if ir[13] goto 31", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 30, {c:'N',to:31});

// --- Ramo 100x (Bit 13 = 0) ---
// 30: TIR := LSHIFT(TIR); if N goto 40 (Bit 12 é 1? 1001 STOL). Senão 1000 LODL (38)
addLine(30, "DECODE: tir:=lshift(tir); if ir[12] goto 40", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 38, {c:'N',to:40});

// --- Ramo 101x (Bit 13 = 1) ---
// 31: TIR := LSHIFT(TIR); if N goto 44 (Bit 12 é 1? 1011 SUBL). Senão 1010 ADDL (42)
addLine(31, "DECODE: tir:=lshift(tir); if ir[12] goto 44", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 42, {c:'N',to:44});

// --- Ramo 11xx (Bit 14 = 1) ---
// 32: TIR := LSHIFT(TIR); if N goto 34 (Bit 13 é 1? 111x)
addLine(32, "DECODE: tir:=lshift(tir); if ir[13] goto 34", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 33, {c:'N',to:34});

// --- Ramo 110x (Bit 13 = 0) ---
// 33: TIR := LSHIFT(TIR); if N goto 48 (Bit 12 é 1? 1101 JNZE). Senão 1100 JNEG (46)
addLine(33, "DECODE: tir:=lshift(tir); if ir[12] goto 48", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 46, {c:'N',to:48});

// --- Ramo 111x (Bit 13 = 1) ---
// 34: TIR := LSHIFT(TIR); if N goto 53 (Bit 12 é 1? 1111 PSHI). Senão 1110 CALL (50)
addLine(34, "DECODE: tir:=lshift(tir); if ir[12] goto 53", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 50, {c:'N',to:53});


// =================================================================
// 3. EXECUÇÃO DAS INSTRUÇÕES
// =================================================================

// --- 0000: LODD (Load Direct) ---
addLine(6, "LODD: mar:=ir; rd;", [{t:'x',s:'IR',d:'MAR'},{t:'rd'}], 7);
addLine(7, "LODD: rd;", [{t:'rd'}], 8);
addLine(8, "LODD: ac:=mbr; goto 0", [{t:'x',s:'MBR',d:'AC'}], 0);

// --- 0001: STOD (Store Direct) ---
addLine(9, "STOD: mar:=ir; mbr:=ac; wr;", [{t:'x',s:'IR',d:'MAR'},{t:'x',s:'AC',d:'MBR'},{t:'wr'}], 10);
addLine(10, "STOD: wr; goto 0", [{t:'wr'}], 0);

// --- 0010: ADDD (Add Direct) ---
addLine(12, "ADDD: mar:=ir; rd;", [{t:'x',s:'IR',d:'MAR'},{t:'rd'}], 13);
addLine(13, "ADDD: rd;", [{t:'rd'}], 14);
addLine(14, "ADDD: ac:=ac+mbr; goto 0", [{t:'alu',op:'add',s1:'AC',s2:'MBR',d:'AC'}], 0);

// --- 0011: SUBD (Subtract Direct) ---
addLine(15, "SUBD: mar:=ir; rd;", [{t:'x',s:'IR',d:'MAR'},{t:'rd'}], 16);
addLine(16, "SUBD: rd;", [{t:'rd'}], 17);
addLine(17, "SUBD: ac:=ac-mbr; goto 0", [{t:'alu',op:'sub',s1:'AC',s2:'MBR',d:'AC'}], 0);

// --- 0100: JPOS (Jump Positive - AC >= 0) ---
// Testa AC. Se N=0 (Positivo), pula. Se N=1 (Negativo), ignora.
addLine(21, "JPOS: alu:=ac; if n goto 0", [{t:'alu',op:'pass',s1:'AC'}], 100, {c:'N', to:0}); 
// Nota: Usei addr 100 temp para o caso "PULA SE POSITIVO". Se N for true (negativo), vai para 0 (fim). 
// Se N for false (positivo), vai para 100 (realiza pulo).
addLine(100, "JPOS: pc:=ir; goto 0", [{t:'x',s:'IR',d:'PC'}], 0);

// --- 0101: JZER (Jump Zero - AC == 0) ---
// Testa AC. Se Z=1, pula.
addLine(22, "JZER: alu:=ac; if z goto 101", [{t:'alu',op:'pass',s1:'AC'}], 0, {c:'Z', to:101});
addLine(101, "JZER: pc:=ir; goto 0", [{t:'x',s:'IR',d:'PC'}], 0);

// --- 0110: JUMP (Unconditional) ---
addLine(24, "JUMP: pc:=ir; goto 0", [{t:'x',s:'IR',d:'PC'}], 0);

// --- 0111: LOCO (Load Constant) ---
// Carrega o operando (parte baixa do IR) para o AC. Mas IR bits 0-11.
// O MIC-1 geralmente trata o IR inteiro como operando mascarado ou assume que x é o valor.
// Vamos assumir AC := IR & 0xFFF (ou 0xFFFF se o simulador usa IR full).
addLine(25, "LOCO: ac:=ir; goto 0", [{t:'alu',op:'pass',s1:'IR',d:'AC'}], 0);

// --- 1000: LODL (Load Local) ---
// AC := M[SP + x]
addLine(38, "LODL: mar:=sp+ir; rd;", [{t:'alu',op:'add',s1:'SP',s2:'IR',d:'MAR'},{t:'rd'}], 39);
addLine(39, "LODL: rd;", [{t:'rd'}], 8); // Reusa final do LODD (ac:=mbr)

// --- 1001: STOL (Store Local) ---
// M[SP + x] := AC
addLine(40, "STOL: mar:=sp+ir; mbr:=ac; wr;", [{t:'alu',op:'add',s1:'SP',s2:'IR',d:'MAR'},{t:'x',s:'AC',d:'MBR'},{t:'wr'}], 41);
addLine(41, "STOL: wr; goto 0", [{t:'wr'}], 0);

// --- 1010: ADDL (Add Local) ---
// AC := AC + M[SP + x]
addLine(42, "ADDL: mar:=sp+ir; rd;", [{t:'alu',op:'add',s1:'SP',s2:'IR',d:'MAR'},{t:'rd'}], 43);
addLine(43, "ADDL: rd;", [{t:'rd'}], 14); // Reusa final do ADDD

// --- 1011: SUBL (Sub Local) ---
// AC := AC - M[SP + x]
addLine(44, "SUBL: mar:=sp+ir; rd;", [{t:'alu',op:'add',s1:'SP',s2:'IR',d:'MAR'},{t:'rd'}], 45);
addLine(45, "SUBL: rd;", [{t:'rd'}], 17); // Reusa final do SUBD

// --- 1100: JNEG (Jump Negative) ---
// Se N=1, pula.
addLine(46, "JNEG: alu:=ac; if n goto 100", [{t:'alu',op:'pass',s1:'AC'}], 0, {c:'N', to:100});

// --- 1101: JNZE (Jump Non-Zero) ---
// Se Z=0, pula. O 'jump' só suporta if true.
// Lógica invertida: Se Z=1 (zero), vai para fim (0). Se Z=0, vai para Pulo (100).
// O simulador atual só tem {c:'Z', to:X}. Se Z for true, vai pra X.
// Solução: Se Z=1 goto 0. Else goto 100.
addLine(48, "JNZE: alu:=ac; if z goto 0", [{t:'alu',op:'pass',s1:'AC'}], 100, {c:'Z', to:0});

// --- 1110: CALL (Chamada de Função) ---
// SP := SP - 1; M[SP] := PC; PC := IR
addLine(50, "CALL: sp:=sp-1; mar:=sp; mbr:=pc", [
    {t:'alu',op:'dec',s1:'SP',d:'SP'}, // Decrementa SP
    {t:'x',s:'SP',d:'MAR'}, // Setup MAR novo
    {t:'x',s:'PC',d:'MBR'}  // Prepara PC para salvar
], 51);
addLine(51, "CALL: wr; pc:=ir; goto 0", [{t:'wr'}, {t:'x',s:'IR',d:'PC'}], 0);

// --- 1111: PSHI (Push Immediate / Stack Ops) ---
// Simplificação: Vamos tratar como RETN se o IR for 0 ou PSHI se tiver valor?
// O Tanenbaum define PSHI como AC := M[SP+x]? Não, PSHI é Push.
// Vamos implementar RETN (Retorno) como uma variação ou instrução separada.
// Como o código 1111 é "Joker", vou implementar RETN aqui para fechar o CALL.
// RETN: PC := M[SP]; SP := SP + 1;
addLine(53, "RETN: mar:=sp; rd;", [{t:'x',s:'SP',d:'MAR'}, {t:'rd'}], 54);
addLine(54, "RETN: rd;", [{t:'rd'}], 55);
addLine(55, "RETN: pc:=mbr; sp:=sp+1; goto 0", [{t:'x',s:'MBR',d:'PC'}, {t:'alu',op:'inc',s1:'SP',d:'SP'}], 0);