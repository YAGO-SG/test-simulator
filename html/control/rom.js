// control/rom.js - microprogram (ROM)
export const 
ROM = [];
export const addLine = (addr, txt, actions, next, jump) => {
    ROM[addr] = { text: txt, actions: actions || [], next: next, jump: jump };
};

// FETCH
addLine(0, "mar:=pc; rd;", [{t:'x',s:'PC',d:'MAR'},{t:'rd'}], 1);
addLine(1, "pc:=pc + 1; rd;", [{t:'alu',op:'add',s1:'PC',s2:1,d:'PC'},{t:'rd'}], 2);

// DECODE (Árvore de decisão)
addLine(2, "ir:=mbr; if n goto 28", [{t:'x',s:'MBR',d:'IR'},{t:'alu',op:'pass',s1:'MBR'}], 3, {c:'N',to:28});
addLine(3, "tir:=lshift(ir); if n goto 19", [{t:'alu',op:'lshift',s1:'IR',d:'TIR'}], 4, {c:'N',to:19});
addLine(4, "tir:=lshift(tir); if n goto 11", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 5, {c:'N',to:11});
addLine(5, "tir:=lshift(tir); if n goto 9", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 6, {c:'N',to:9});

// EXECUTE - LODD (0000)
addLine(6, "LODD: mar:=ir; rd;", [{t:'x',s:'IR',d:'MAR'},{t:'rd'}], 7);
addLine(7, "LODD: rd;", [{t:'rd'}], 8);
addLine(8, "LODD: ac:=mbr; goto 0", [{t:'x',s:'MBR',d:'AC'}], 0);

// EXECUTE - STOD (0001)
addLine(9, "STOD: mar:=ir; mbr:=ac; wr;", [{t:'x',s:'IR',d:'MAR'},{t:'x',s:'AC',d:'MBR'},{t:'wr'}], 10);
addLine(10, "STOD: wr; goto 0", [{t:'wr'}], 0);

// EXECUTE - ADDD (0010)
addLine(11, "tir:=lshift(tir); if n goto 15", [{t:'alu',op:'lshift',s1:'TIR',d:'TIR'}], 12, {c:'N',to:15});
addLine(12, "ADDD: mar:=ir; rd;", [{t:'x',s:'IR',d:'MAR'},{t:'rd'}], 13);
addLine(13, "ADDD: rd;", [{t:'rd'}], 14);
addLine(14, "ADDD: ac:=ac+mbr; goto 0", [{t:'alu',op:'add',s1:'AC',s2:'MBR',d:'AC'}], 0);

// EXECUTE - JUMP (0110) - Simplificado para teste
addLine(19, "Check Jump...", [], 22);
addLine(22, "JUMP: pc:=ir; goto 0", [{t:'x',s:'IR',d:'PC'}], 0);
