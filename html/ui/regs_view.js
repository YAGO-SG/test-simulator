// regs_view.js - register rendering and updates
export function renderRegisters(Hardware) {
    const list = document.getElementById('regs-list');
    list.innerHTML = "";
    const order = ['PC', 'AC', 'SP', 'IR', 'TIR', 'MAR', 'MBR', 'A'];

    order.forEach(key => {
        const val = Hardware.regs[key];
        const hex = val.toString(16).toUpperCase().padStart(4,'0');

        const row = document.createElement('div');
        row.className = 'reg-row';
        row.id = `reg-row-${key}`;
        row.innerHTML = `
            <span class="reg-name">${key}</span>
            <span class="reg-val">${hex}h <span style="color:#666">(${val})</span></span>
        `;
        list.appendChild(row);
    });
}

export function updateRegisters(Hardware) {
    const order = ['PC', 'AC', 'SP', 'IR', 'TIR', 'MAR', 'MBR', 'A'];
    order.forEach(key => {
        const row = document.getElementById(`reg-row-${key}`);
        if(row) {
            const val = Hardware.regs[key];
            const hex = val.toString(16).toUpperCase().padStart(4,'0');
            const currentText = row.querySelector('.reg-val').innerText;
            if(!currentText.startsWith(hex)) {
                row.querySelector('.reg-val').innerHTML = `${hex}h <span style="color:#666">(${val})</span>`;
                row.classList.add('reg-changed');
                setTimeout(() => row.classList.remove('reg-changed'), 500);
            }
        }
    });
}
