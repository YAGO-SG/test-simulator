// mem_view.js - memory rendering
export function renderMemory(Hardware) {
    const tbody = document.getElementById('mem-body');
    tbody.innerHTML = "";
    for(let i=0; i<4096; i++) {
        const val = Hardware.ram[i];
        const bin = val.toString(2).padStart(16,'0');
        const hex = val.toString(16).toUpperCase().padStart(4,'0');

        let labels = [];
        if(Hardware.regs.PC === i) labels.push('<span style="background:#264f78; padding:1px 3px; color:white">PC</span>');
        if(Hardware.regs.SP === i) labels.push('<span style="background:#c586c0; padding:1px 3px; color:white">SP</span>');

        const tr = document.createElement('tr');
        if(Hardware.regs.PC === i) tr.style.backgroundColor = "#2a2d2e";

        tr.innerHTML = `
            <td>${i}</td>
            <td style="font-family:monospace; color:#858585">${bin}</td>
            <td style="color:#ce9178">${hex}</td>
            <td>${val}</td>
            <td>${labels.join(' ')}</td>
        `;
        tbody.appendChild(tr);
    }
}
