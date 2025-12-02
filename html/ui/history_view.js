// history_view.js - micro-history log
export function addHistory(mpc, text) {
    const container = document.getElementById('micro-history-log');
    const entry = document.createElement('div');
    entry.className = 'history-log';
    entry.innerHTML = `<span style="color:#569cd6">[${mpc}]</span> ${text}`;
    container.prepend(entry);
    if(container.children.length > 50) container.lastChild.remove();
}
