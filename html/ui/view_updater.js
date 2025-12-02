// view_updater.js - facade that composes smaller UI modules
import { renderRegisters, updateRegisters } from './regs_view.js';
import { renderMemory } from './mem_view.js';
import { addHistory } from './history_view.js';

export const View = {
    renderRegisters,
    renderMemory,
    addHistory,

    updateUI(App, Hardware) {
        updateRegisters(Hardware);
        document.getElementById('val-mpc').innerText = App.mpc;
        renderMemory(Hardware);
    }
};
