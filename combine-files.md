<!-- combine-files:
home4/index.html
home4/base.css
home4/base.js
-->

---


# Code Bundle


### index.html
**Path:** `home4/index.html`

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover" />
    <title>porchLogic</title>

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
            <h1 class="font-stealth text-neonBlue text-4xl">
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

        <section data-id="welcome" class="color-white">
            <div class="section-header">
                <h2 class="text-neon">Welcome</h2>
            </div>
            <div class="section-content">
                <p>Advanced Cybernetic Orchestrations</p>
            </div>
        </section>

        <section data-id="lineup" class="color-blue">
            <div class="section-header">
                <h2 class="text-neon">LineUp</h2>
            </div>
            <div class="section-content">
                <p>now playing / upcoming performances</p>
            </div>
        </section>

        <section data-id="pulse" class="color-red">
            <div class="section-header">
                <h2 class="text-neon">Pulse</h2>
            </div>
            <div class="section-content">
                <p>the shared structure for making music</p>
            </div>
        </section>

        <section data-id="swarm" class="color-yellow">
            <div class="section-header">
                <h2 class="text-neon">Swarm</h2>
            </div>
            <div class="section-content">
                <p>synchronized group audio tool</p>
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
                <p>asdf</p>
            </div>
        </section>
    </div>

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
        0 0 calc(16px * 0.1) var(--neon-color);
}
.text-neon-bright {
    color: var(--text-dark);
    text-shadow:
        0 0 calc(2px * var(--pulse)) var(--neon-color),
        0 0 calc(4px * var(--pulse)) var(--neon-color),
        0 0 calc(6px * var(--pulse)) var(--neon-color),
        0 0 calc(18px * var(--pulse)) var(--neon-color);
}
@font-face {
    font-family: "stealth57";

    src: url("/fonts/stealth57.ttf") format("truetype");

    font-weight: normal;

    font-style: normal;
}

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
    font-family: system-ui, sans-serif;
    background: #111;
    color: #e7e7e7;
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
    height: 3px;
    width: 0;
    /* collapsed by default */
    background: var(--text-dark);
    /* neon cyan color */
    box-shadow:
        0 0 2px var(--neon-color),
        0 0 6px var(--neon-color),
        0 0 9px var(--neon-color);
    transition: width 0.4s ease;
}

/* Grow to text width by default */
.section-header h2 {
    display: inline-block;
    position: relative;
}

.section-header h2::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    height: 1px;
    width: 100%;
    /* match text width */
    background: var(--text-dark);
    box-shadow:
        0 0 2px var(--neon-color),
        0 0 6px var(--neon-color),
        0 0 9px var(--neon-color);
    transition: width 0.4s ease;
}

/* When active, stretch full width of the header area */
section.active .section-header h2::after {
    width: 100vw;
    /* effectively full viewport width; adjust if you want container width */
}

section.active {
    flex-grow: 1;
    /* background: #141414; */
}



.section-content {
    flex: 1;
    display: none;
    padding: 0 16px 16px;
    overflow: hidden;
}

section.active .section-content {
    display: block;
}

/* Optional generic scoping helpers (use sparingly) */
/* section[data-id] .section-content :where(h1, h2, h3, p, ul, ol) {
    margin-block: 0.5rem;
} */
```

### base.js
**Path:** `home4/base.js`

```javascript
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

```
