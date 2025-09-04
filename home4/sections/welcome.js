const el = document.querySelector('section[data-id="welcome"]');
if (!el) return;

let timer = null;

function onActivate() {
    // lightweight demo behavior
    const content = el.querySelector('.section-content');
    if (content && !content.dataset.pulsed) {
        content.dataset.pulsed = "1";
        // e.g., start a one-off effect
        timer = setTimeout(() => { timer = null; }, 800);
    }
}

function onDeactivate() {
    if (timer) { clearTimeout(timer); timer = null; }
}

// Hook into base.js lifecycle
window.addEventListener('section:activate', (e) => {
    if (e.detail.el === el) onActivate();
});
window.addEventListener('section:deactivate', (e) => {
    if (e.detail.el === el) onDeactivate();
});
