<!-- combine-files:
home4/index.html
home4/base.css
home4/base.js
-->

---


# Code Bundle
> Generated 2025-09-05T12:04:57.240Z

### index.html
**Path:** `home4/index.html`

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover" />
    <title>porchLogic</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">

    <!-- Global layout -->
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="brand.css" />
    <!-- Per-section styles -->
    <link rel="stylesheet" href="sections/welcome.css" />
    <link rel="stylesheet" href="sections/lineup.css" />
    <link rel="stylesheet" href="sections/pulse.css" />
    <link rel="stylesheet" href="sections/swarm.css" />
    <link rel="stylesheet" href="sections/shop.css" />
    <link rel="stylesheet" href="sections/venue.css" />
</head>

<body>
    <header>
        <!-- <h1 class="brand">porchLogic</h1> -->
        <a href="/">
            <h1 class="text-neonBlue text-4xl">
                <span class="text-neonGreen">p</span>
                <span class="text-neonGreen">o</span>
                <span class="text-neonGreen">r</span>
                <span class="text-neonGrey">c</span>
                <span class="text-neonGrey">h</span>
        
                <span class="text-neonWhite">L</span>
                <span class="text-neonBlue">o</span>
                <span class="text-neonYellow">g</span>
                <span class="text-neonBlue">i</span>
                <span class="text-neonWhite">c</span>
            </h1>
        </a>
    </header>

    <div class="main-sections" id="stack">

        <section data-id="welcome" data-speed="14" class="color-white">
            <div class="section-header">
                <h2 class="text-neon">Welcome</h2>
            </div>
            <div class="section-content fx-typeOut">
                <p>Advanced</p>
                <p>Cybernetic</p>
                <p>Orchestrations</p>
            </div>
        </section>

        <section data-id="lineup" class="color-blue">
            <div class="section-header">
                <h2 class="text-neon">Coming Up</h2>
            </div>
            <div class="section-content">
                <div class="poster">
                    <h3>System Rehearsal</h3>
                    <p>Umday, Pertumber 16</p>
                    <p>240 SE Clay St.</p>
                    <p>roll-out 6:15pm</p>
                    <a href="#">what you'll need</a>
                    <img class="rider-group" src="/images/riders.png" alt="rider group" />
                </div>
            </div>
            
        </section>

        <section data-id="pulse" class="color-red">
            <div class="section-header">
                <h2 class="text-neon">Pulse</h2>
            </div>
            <div class="section-content">
                <p>pulse.porchlogic.com</p>
                <p>our current song structure:</p>
            </div>
        </section>

        <section data-id="swarm" class="color-yellow">
            <div class="section-header">
                <h2 class="text-neon">Swarm</h2>
            </div>
            <div class="section-content">
                <h3>join the porchLogic swarm:</h3>
                <a href="#">swarm.porchlogic.com/main</a>
                <br>
                <h3>or create your own swarm:</h3>
                <a href="#">swarm.porchlogic.com</a>
            </div>
        </section>

        <section data-id="shop" class="color-green">
            <div class="section-header">
                <h2 class="text-neon">Shop</h2>
            </div>
            <div class="section-content">
                <div class="product-card">
                    <h3>SMB1</h3>
                </div>
                <div class="product-card">
                    <h3>SMB1 founders edition</h3>
                </div>
            </div>
        </section>

        <section data-id="venue" class="color-grey">
            <div class="section-header">
                <h2 class="text-neon">Venue</h2>
            </div>
            <div class="section-content">
                <div class="venue">
                    <p class="venue-tagline">A mobile, distributed 3D sound system — carried by riders.</p>
                
                    <div class="venue-specs">
                        <h3>System Specs</h3>
                        <ul>
                            <li><strong>Format:</strong> Networked speaker swarm (up to 20+ nodes)</li>
                            <li><strong>Coverage:</strong> Expands to cover streets, plazas, clubs</li>
                            <li><strong>Sync:</strong> Ultra-low latency MIDI clock + wireless link</li>
                            <li><strong>Inputs:</strong> Standard DJ/mixer stereo line in (TRS / RCA)</li>
                            <li><strong>Power:</strong> Self-powered nodes (battery / portable)</li>
                        </ul>
                    </div>
                
                    <div class="venue-experience">
                        <h3>For Artists</h3>
                        <ul>
                            <li>Plug-and-play with your existing gear</li>
                            <li>Audience fully immersed in a moving 3D soundscape</li>
                            <li>Perfect for DJs, live PA, experimental sets</li>
                            <li>Bring the underground into the open air</li>
                        </ul>
                    </div>
                
                    <div class="venue-contact">
                        <h3>Booking & Collabs</h3>
                        <p>We’re looking for DJs, live artists, and sonic explorers.</p>
                        <p><strong>Contact:</strong> <a href="mailto:booking@porchlogic.net">booking@porchlogic.net</a></p>
                    </div>
                </div>

            </div>
        </section>

        
    </div>
    <footer>
        <p style="text-align: center;">© Porch Logic 2025</p>    
    </footer>

    <!-- Core behavior first -->
    <script type="module" src="base.js"></script>

    <!-- Per-section modules (self-contained, light) -->
    <script type="module" src="sections/welcome.js" defer></script>
    <script type="module" src="sections/lineup.js" defer></script>
    <script type="module" src="sections/pulse.js" defer></script>
    <script type="module" src="sections/swarm.js" defer></script>
    <script type="module" src="sections/shop.js" defer></script>
    <script type="module" src="sections/venue.js" defer></script>
</body>

</html>
```

### base.css
**Path:** `home4/base.css`

```css
:root {
    /* Backgrounds */
    --bg: #0e0e10;
    --bg-light: #1a1a1d;

    /* Text */
    --text-primary: rgba(165, 181, 175, 0.954);
    --text-strong: rgba(123, 220, 183, 0.954);
    --text-secondary: rgb(94, 103, 107);
    --text-dark: rgb(16, 16, 16);

    /* Accent Colors */
    --neonGreen: rgb(34, 186, 52);
    --neonGrey: rgb(95, 94, 94);
    --neonWhite: rgb(237, 237, 237);
    --neonYellow: rgb(162, 254, 63);
    --neonBlue: rgb(16, 111, 244);
    --neonPurple: rgb(130, 80, 250);
    --neonPink: rgb(248, 57, 117);
    --neonRed: rgba(218, 22, 22, 0.886);

    /* Borders / Shadows */
    --border-color: #4b5563;
    --shadow-color: rgba(0, 0, 0, 0.5);

    --pulse: 0.5;

    --neon-color: #0ff;
}
.color-green {
    --neon-color: rgb(34, 186, 52);
}
.color-yellow {
    --neon-color: rgb(162, 254, 63);
}
.color-white {
    --neon-color: rgb(237, 237, 237);
}
.color-blue {
    --neon-color: rgb(16, 111, 244);
}
.color-grey {
    --neon-color: rgb(95, 94, 94);
}
.color-pink {
    --neon-color: rgb(248, 57, 117);
}

.color-red {
    --neon-color: rgba(218, 22, 22, 0.886);
}
.text-neon {
    color: var(--text-dark);
    text-shadow:
        0 0 2px var(--neon-color);
        0 0 5px var(--neon-color);
}
.text-neon-bright {
    color: var(--text-dark);
    text-shadow:
        0 0 calc(2px * var(--pulse)) var(--neon-color),
        0 0 calc(4px * var(--pulse)) var(--neon-color),
        0 0 calc(6px * var(--pulse)) var(--neon-color),
        0 0 calc(18px * var(--pulse)) var(--neon-color);
}

.share-tech-mono-regular {
    font-family: "Share Tech Mono", monospace;
    font-weight: 400;
    font-style: normal;
}
/* @font-face {
    font-family: "stealth57";

    src: url("/fonts/stealth57.ttf") format("truetype");

    font-weight: normal;

    font-style: normal;
} */

.font-stealth {
    font-family: stealth57, sans-serif;
}

.text-4xl {
    font-size: 2.75rem;
    line-height: 2.5rem;
}

html,
body {
    margin: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    /* font-family: system-ui, sans-serif; */
    font-family: "Share Tech Mono", monospace;
    background: #111;
    color: var(--text-primary);
}

header {
    background: #111;
    text-align: center;
    padding: 2px 6px;
    position: sticky;
    top: 0;
    z-index: 1;
    flex: 0 0 auto;
}

.brand {
    margin: 0;
    font-size: 1.2rem;
}

.main-sections {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

section {
    transition: flex-grow 0.35s ease;
    display: flex;
    flex-direction: column;
}

.section-header {
    position: relative;
    flex-shrink: 0;
    padding: 4px 16px;
    cursor: pointer;
    user-select: none;
}

/* Neon underline tube */
.section-header::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 4px;
    /* sits just below the text */
    height: 1px;
    width: 100%;
    /* collapsed by default */
    background: var(--neon-color);
    visibility: hidden;
    /* neon cyan color */
    box-shadow:
        0 0 0px var(--neon-color),
        0 0 0px var(--neon-color),
        0 0 0px var(--neon-color);
    transition: box-shadow 1.4s ease;
}

/* Grow to text width by default */
.section-header h2 {
    display: inline-block;
    position: relative;
    margin-block-start: 0.1em;
    margin-block-end: 0.1em;
}



section.active .section-header::after {
    visibility: visible;
    box-shadow:
        0 0 1px var(--neon-color),
        0 0 2px var(--neon-color),
        0 0 3px var(--neon-color);
}


section.active {
    flex-grow: 1;
    /* background: #141414; */
    text-align: center;
}



.section-content {
    flex: 1;
    display: none;
    overflow: hidden;
    flex-direction: column;
    
    justify-content: center;
    /* horizontal center */
    align-items: center;
    /* vertical center */
    width: 100%;
    /* height: 100%; */
    text-align: center;

    min-width: 0;
    /* avoid flex overflow */
    min-height: 0;
    container-type: size;
}




section.active .section-content {
    display: flex;
    flex-grow: 1;
}



/* Disable accordion/underline transitions during initial boot only */
.no-anim section {
    transition: none !important;
}

.no-anim .section-header::after,
.no-anim .section-header h2::after {
    transition: none !important;
}


/* Hidden by default so first paint never shows full text */
.fx-typeOut p {
    visibility: hidden;
}

/* JS will add .typing to the .fx-typeOut container right before drawing */
.fx-typeOut.typing p {
    visibility: visible;
}


section.active .section-content.fx-typeOut {
    display: flex;
    flex-direction: column;
}

section.active .section-content.fx-typeOut p {
    /* visibility: visible; */
    display: block;
    /* ensure each line stays its own row */
    white-space: pre;
    /* preserves spaces while typing */
    margin: 0 0 0.5em 0;
}


section[data-id="welcome"] p {
    font-size: 2.5em;
}


.poster {
    --w: 2;
    /* poster width ratio  */
    --h: 3;
    /* poster height ratio */
    aspect-ratio: var(--w) / var(--h);

    /* Choose the limiting side of the parent */
    width: min(100cqw, calc(100cqh * (var(--w) / var(--h))));
    height: auto;

    /* Optional cosmetics */
    border-radius: 12px;
    overflow: hidden;
    /* demo visuals; remove if you have your own */
    box-shadow: 0 0 0 1px hsl(0 0% 100% / .08) inset;
    background: #0b0b0b;

    margin-top: 1.0em;
}

.poster h3 {
    font-size: 3em;
}

.poster img {
    width: 100%;
    margin-top:2em;
}


.venue {
    padding: 1rem;
    margin: 1rem auto;
    color: #fff;
    text-align: left;
}

.venue-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 0.5rem;
    color: var(--color-neon, #0ff);
    text-shadow: 0 0 10px var(--color-neon, #0ff);
}

.venue-tagline {
    text-align: center;
    font-style: italic;
    margin-bottom: 2rem;
}

.venue h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-neon, #0ff);
}

.venue ul {
    list-style: none;
    padding-left: 0;
}

.venue li {
    margin: 0.25rem 0;
}


footer {
    color: var(--text-secondary);
}
```

### base.js
**Path:** `home4/base.js`

```javascript
// base.js — section activation + generic effect hooks

// ------- Sections & navigation -------
const sections = [...document.querySelectorAll(".main-sections section")];
const headers = sections.map(s => s.querySelector(".section-header"));

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
    }

    index = next;
    const el = sections[index];
    el.classList.add("active");
    dispatch("section:activate", { id: el.dataset.id, el });
    // Now spin up effects for this section
    FX.activateSection(el);
}

function step(dir) { setActive(index + dir); }

// Click headers
headers.forEach((h, i) => h && h.addEventListener("click", () => setActive(i)));

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
                await new Promise(r => setTimeout(r, 30));
            }
            await new Promise(r => setTimeout(r, 80));
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

```
