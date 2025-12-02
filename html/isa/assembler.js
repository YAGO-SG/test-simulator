// assembler.js - monta o código assembly na RAM
import { OPCODES } from './constants.js';
import { parseLine } from './utils.js';

export function assembleFromText(text, Hardware) {
    const lines = text.split('\n');
    Hardware.ram.fill(0);
    let compiledText = '';

    lines.forEach((line, idx) => {
        const parsed = parseLine(line);
        if(!parsed) { compiledText += '\n'; return; }
        const { op, arg } = parsed;
        if(OPCODES[op] !== undefined) {
            const bin = OPCODES[op] | (arg & 0x0FFF);
            Hardware.ram[idx] = bin;
            const hex = bin.toString(16).toUpperCase().padStart(4,'0');
            compiledText += `${idx.toString().padStart(2,'0')}: ${hex}  (${op} ${arg})\n`;
        } else {
            compiledText += `Erro Linha ${idx}\n`;
        }
    });

    // dados de teste (comportamento original)
    Hardware.ram[10] = 5;
    Hardware.ram[11] = 7;

    return compiledText;
}
