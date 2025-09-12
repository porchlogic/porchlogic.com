// base.js — section activation + generic effect hooks

// ------- Sections & navigation -------
const sections = [...document.querySelectorAll(".main-sections section")];
const headers = sections.map(s => s.querySelector(".section-header"));

// Build left-edge vertical tabs for inactive sections
const mainContainer = document.querySelector('.main-sections');
const tabsContainer = document.createElement('nav');
tabsContainer.className = 'section-tabs';
tabsContainer.style.setProperty('--tab-count', String(sections.length));

// Create one tab per section
const tabs = sections.map((section) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'section-tabs__item';
    // Inherit the section's accent via its color-* class
    for (const cls of section.classList) {
        if (cls.startsWith('color-')) item.classList.add(cls);
    }
    const label = document.createElement('span');
    label.className = 'section-tabs__label';
    const h2 = section.querySelector('.section-header h2');
    label.textContent = h2 ? h2.textContent : (section.dataset.id || '');
    item.appendChild(label);
    tabsContainer.appendChild(item);
    return item;
});

mainContainer.prepend(tabsContainer);

let index = 0;
const SWIPE_THRESHOLD = 30;

function dispatch(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
}

// ------- Minimal effect system -------
// Usage in HTML:
//   <section data-id="welcome" data-fx="sectionPulse">
//     <div class="section-content" data-fx="typeOut sparkle"></div>
//   </section>
//
// Or class form (equivalent):
//   data-fx="typeOut"  <=>  class="fx-typeOut"
//
// Register effects below with FX.register('typeOut', (el, ctx)=>({...}))
// where factory returns { activate(), deactivate() } (both optional).
const FX = {
    registry: new Map(),            // name -> factory(el, ctx) => {activate,deactivate}
    instances: new WeakMap(),       // el -> Map<name, instance>

    register(name, factory) {
        this.registry.set(name, factory);
    },

    _parseNames(el) {
        // Prefer data-fx="a b c", also support class="fx-a fx-b"
        const set = new Set();
        const data = el.dataset.fx;
        if (data) data.split(/\s+/).filter(Boolean).forEach(n => set.add(n));
        el.classList.forEach(cls => {
            if (cls.startsWith('fx-')) set.add(cls.slice(3));
        });
        return [...set];
    },

    _getInstance(el, name, ctx) {
        let perEl = this.instances.get(el);
        if (!perEl) {
            perEl = new Map();
            this.instances.set(el, perEl);
        }
        if (!perEl.has(name)) {
            const factory = this.registry.get(name);
            if (!factory) return null; // unknown effect name: ignore silently
            const instance = factory(el, ctx) || {};
            perEl.set(name, instance);
        }
        return perEl.get(name);
    },

    _targetEls(sectionEl) {
        // Section itself may have fx, plus any descendants with fx
        const targets = [];
        if (sectionEl.dataset.fx || [...sectionEl.classList].some(c => c.startsWith('fx-'))) {
            targets.push(sectionEl);
        }
        sectionEl.querySelectorAll('[data-fx], [class*="fx-"]').forEach(el => targets.push(el));
        return targets;
    },

    activateSection(sectionEl) {
        const ctx = { section: sectionEl };
        for (const el of this._targetEls(sectionEl)) {
            for (const name of this._parseNames(el)) {
                const inst = this._getInstance(el, name, ctx);
                if (inst?.activate) inst.activate(ctx);
            }
        }
    },

    deactivateSection(sectionEl) {
        if (!sectionEl) return;
        const ctx = { section: sectionEl };
        for (const el of this._targetEls(sectionEl)) {
            const names = this._parseNames(el);
            const perEl = this.instances.get(el);
            if (!perEl) continue;
            for (const name of names) {
                const inst = perEl.get(name);
                if (inst?.deactivate) inst.deactivate(ctx);
            }
        }
    }
};

// ------- Activation flow -------
function setActive(i) {
    const next = Math.max(0, Math.min(sections.length - 1, i));
    if (next === index && sections[next].classList.contains("active")) return;

    const prevEl = sections[index];
    if (prevEl) {
        prevEl.classList.remove("active");
        dispatch("section:deactivate", { id: prevEl.dataset.id, el: prevEl });
        // Tell effects first so they can clean up before DOM classes change
        FX.deactivateSection(prevEl);
        // Update tab states
        const prevTab = tabs[index];
        if (prevTab) prevTab.classList.remove('is-active');
    }

    index = next;
    const el = sections[index];
    el.classList.add("active");
    dispatch("section:activate", { id: el.dataset.id, el });
    // Now spin up effects for this section
    FX.activateSection(el);

    // Mark the corresponding tab as active (hidden via CSS)
    const activeTab = tabs[index];
    if (activeTab) activeTab.classList.add('is-active');
}

function step(dir) { setActive(index + dir); }

// Click headers (inline active header)
headers.forEach((h, i) => h && h.addEventListener("click", () => setActive(i)));

// Click tabs (left rail)
tabs.forEach((t, i) => t && t.addEventListener('click', () => setActive(i)));

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
}, { passive: false });

// Keyboard
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") step(1);
    else if (e.key === "ArrowUp" || e.key === "PageUp") step(-1);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(sections.length - 1);
});

// start
// setActive(0);

// start: activate first section without any accordion animation on first paint
document.documentElement.classList.add('no-anim');
requestAnimationFrame(() => {
    setActive(0); // runs FX.activateSection -> typeOut still animates
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-anim');
    });
});


// ------- Example reusable effects -------

// 1) typeOut — types the text content of each <p> in sequence, preserving lines
FX.register('typeOut', (el, { section }) => {
    let cancelled = false;
    let original = null;

    function snapshot() {
        if (original) return;
        original = Array.from(el.querySelectorAll('p')).map(p => p.textContent);
    }

    async function animate() {
        cancelled = false;
        snapshot();

        // 1) Clear while still invisible
        el.querySelectorAll('p').forEach(p => p.textContent = '');

        // 2) Reveal only when we're ready to type
        el.classList.add('typing');

        // 3) Type each line
        for (let li = 0; li < original.length; li++) {
            const line = original[li] || '';
            const p = el.querySelectorAll('p')[li];
            for (let i = 0; i <= line.length; i++) {
                if (cancelled) return;
                p.textContent = line.slice(0, i);
                await new Promise(r => setTimeout(r, 20));
            }
            await new Promise(r => setTimeout(r, 20));
        }
    }

    return {
        activate() {
            // Cancel any prior run and start fresh
            cancelled = true;
            // Start on next tick to let DOM/class changes settle
            setTimeout(() => { animate(); }, 0);
        },
        deactivate() {
            // Stop current animation and restore original text
            cancelled = true;
            el.classList.remove('typing');
            if (original) {
                el.querySelectorAll('p').forEach((p, i) => { p.textContent = original[i] || ''; });
            }
        }
    };
});


// 2) sparkle — “generic” example; gets the activated section via ctx.section
FX.register('sparkle', (el, { section }) => {
    let raf = null, t = 0;

    function loop() {
        // toy effect: pulse opacity; replace with your real sparkle logic
        t += 0.02;
        el.style.opacity = (0.85 + 0.15 * Math.sin(t)).toFixed(3);
        raf = requestAnimationFrame(loop);
    }

    return {
        activate() {
            // You can use section if you need section-level context or lookups
            // e.g., section.dataset.id to alter behavior per section
            if (!raf) loop();
        },
        deactivate() {
            if (raf) cancelAnimationFrame(raf);
            raf = null;
            el.style.opacity = '';
        }
    };
});
