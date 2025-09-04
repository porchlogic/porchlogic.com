const sections = [...document.querySelectorAll(".main-sections section")];
const headers = sections.map(s => s.querySelector(".section-header"));

let index = 0, busy = false;
const COOLDOWN_MS = 350, SWIPE_THRESHOLD = 30;

function dispatch(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
}

// function setActive(i) {
//     const next = Math.max(0, Math.min(sections.length - 1, i));
//     if (next === index && sections[next].classList.contains("active")) return;

//     const prevEl = sections[index];
//     prevEl && prevEl.classList.remove("active");
//     if (prevEl) dispatch("section:deactivate", { id: prevEl.dataset.id, el: prevEl });

//     index = next;
//     const el = sections[index];
//     el.classList.add("active");
//     dispatch("section:activate", { id: el.dataset.id, el });
// }
function setActive(i) {
    const next = Math.max(0, Math.min(sections.length - 1, i));
    if (next === index && sections[next].classList.contains("active")) return;

    const prevEl = sections[index];
    prevEl && prevEl.classList.remove("active");
    dispatch("section:deactivate", { id: prevEl?.dataset.id, el: prevEl });

    index = next;
    const el = sections[index];
    el.classList.add("active");
    dispatch("section:activate", { id: el.dataset.id, el });
}

// function step(dir) {
//     if (busy) return;
//     busy = true;
//     setActive(index + dir);
//     setTimeout(() => (busy = false), COOLDOWN_MS);
// }
function step(dir) {
    setActive(index + dir);
}

// Click headers
headers.forEach((h, i) => h.addEventListener("click", () => setActive(i)));

// Wheel
window.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) < 10) return;
    e.preventDefault();
    step(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

// Touch swipe
let startY = null;
window.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchmove", (e) => { e.preventDefault(); }, { passive: false });
window.addEventListener("touchend", (e) => {
    if (startY == null) return;
    const endY = (e.changedTouches[0] || e.touches[0]).clientY;
    const dy = endY - startY;
    if (Math.abs(dy) > SWIPE_THRESHOLD) step(dy < 0 ? 1 : -1);
    startY = null;
});

// Keyboard
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") step(1);
    else if (e.key === "ArrowUp" || e.key === "PageUp") step(-1);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(sections.length - 1);
});

// start
setActive(0);
