// utils.js - small helpers for ISA parsing
export function parseLine(line) {
    const clean = line.split(';')[0].trim().toUpperCase();
    if(!clean) return null;
    const parts = clean.split(/\s+/);
    const op = parts[0];
    const arg = parts[1] ? parseInt(parts[1]) : 0;
    return { op, arg };
}
