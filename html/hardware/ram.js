// ram.js
export const ram = new Uint16Array(4096);

export function clearRam() {
    ram.fill(0);
}
