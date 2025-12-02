// app.js - UI control and simulation logic
import { Hardware } from './hardware/datapath.js';
import { ROM } from './control/rom.js';
import { assembleFromText } from './isa/assembler.js';
import { View } from './ui/view_updater.js';

export const App = {
    mpc: 0,
    running: false,
    timer: null,
    historyLog: [],

    init() {
        // Listener de Velocidade
        const rng = document.getElementById('speedRange');
        rng.addEventListener('input', (e) => {
            document.getElementById('speedVal').innerText = e.target.value + 'ms';
            if(this.running) { this.stopRun(); this.startRun(); }
        });
        
        View.renderRegisters(Hardware); // Renderiza tabela vazia
        View.renderMemory(Hardware);    // Renderiza memória vazia
    },

    assemble() {
        const code = document.getElementById('editor').value;
        const compiledText = assembleFromText(code, Hardware);

        document.getElementById('compiled-view').innerText = compiledText;
        document.getElementById('status-msg').innerText = "Montado com sucesso. RAM[10]=5, RAM[11]=7 para teste.";
        document.getElementById('status-msg').style.color = "#4ec9b0";

        this.reset();
        document.getElementById('btnStep').disabled = false;
        document.getElementById('btnRun').disabled = false;
        View.renderMemory(Hardware);
    },

    reset() {
        Hardware.reset();
        this.mpc = 0;
        this.historyLog = [];
        this.stopRun();
        this.updateUI();
        document.getElementById('micro-history-log').innerHTML = "";
    },

    step() {
        const inst = ROM[this.mpc];
        if(!inst) { alert("Microcódigo não definido: " + this.mpc); this.stopRun(); return; }

        // Log
        View.addHistory(this.mpc, inst.text);

        // Executar
        inst.actions.forEach(a => {
            if(a.t === 'x') Hardware.regs[a.d] = Hardware.regs[a.s];
            else if(a.t === 'rd') Hardware.regs.MBR = Hardware.ram[Hardware.regs.MAR];
            else if(a.t === 'wr') Hardware.ram[Hardware.regs.MAR] = Hardware.regs.MBR;
            else if(a.t === 'alu') {
                let v2 = (typeof a.s2 === 'number') ? a.s2 : Hardware.regs[a.s2];
                Hardware.regs[a.d] = Hardware.compute(a.op, Hardware.regs[a.s1], v2);
            }
        });

        // Próximo
        let next = inst.next;
        if(inst.jump) {
            const cond = (inst.jump.c === 'N') ? Hardware.alu.N : Hardware.alu.Z;
            if(cond) next = inst.jump.to;
        }
        this.mpc = (next !== undefined) ? next : 0;

        View.updateUI(this, Hardware);
    },

    toggleRun() {
        if(this.running) this.stopRun(); else this.startRun();
    },

    startRun() {
        this.running = true;
        document.getElementById('btnRun').innerText = "PAUSAR";
        document.getElementById('btnRun').style.background = "#e74c3c";
        let ms = document.getElementById('speedRange').value;
        this.timer = setInterval(() => this.step(), ms);
    },

    stopRun() {
        this.running = false;
        document.getElementById('btnRun').innerText = "AUTO RUN";
        document.getElementById('btnRun').style.background = "#27ae60";
        clearInterval(this.timer);
    },

    addHistory(mpc, text) {
        // Deprecated: use View.addHistory
        View.addHistory(mpc, text);
    },

    renderRegisters() {
        // Deprecated: use View.renderRegisters
        View.renderRegisters(Hardware);
    },

    renderMemory() {
        // Deprecated: use View.renderMemory
        View.renderMemory(Hardware);
    },

    updateUI() {
        // Deprecated: use View.updateUI
        View.updateUI(this, Hardware);
    }
};

// Expor `App` globalmente para handlers inline no HTML (ex.: onclick="App.assemble()")
if(typeof window !== 'undefined') {
    window.App = App;
    document.addEventListener('DOMContentLoaded', () => {
        if(typeof App.init === 'function') App.init();
    });
}
