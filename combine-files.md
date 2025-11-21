<!-- combine-files:
/shop/cart-utils.js
/shop/cart.html
/shop/cart.js
/shop/checkout.html
/shop/checkout.js
/shop/index.html
/shop/shop.css
/shop/shop.js
-->

---


# Code Bundle
> Generated 2025-11-21T23:03:02.760Z

### cart-utils.js
**Path:** `/shop/cart-utils.js`

```javascript
(function () {
    "use strict";

    const CART_STORAGE_KEY = "porchlogic_cart";

    function readCart() {
        try {
            const raw = sessionStorage.getItem(CART_STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed;
        } catch (e) {
            console.error("Failed to read cart from sessionStorage", e);
            return [];
        }
    }

    function writeCart(items) {
        try {
            sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items || []));
        } catch (e) {
            console.error("Failed to write cart to sessionStorage", e);
        }
    }

    function getCartItems() {
        return readCart();
    }

    function saveCartItems(items) {
        writeCart(items);
    }

    function getCartCount() {
        return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

    function addItemToCart(item) {
        const items = readCart();
        const existingIdx = items.findIndex((i) => i.id === item.id);
        const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

        if (existingIdx >= 0) {
            items[existingIdx].quantity += qtyToAdd;
        } else {
            items.push({
                id: item.id,
                name: item.name || "",
                price: Number(item.price || 0),
                quantity: qtyToAdd,
            });
        }
        writeCart(items);
    }

    function setItemQuantity(id, qty) {
        const q = Math.max(0, Math.floor(qty || 0));
        const items = readCart();
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) return;
        if (q === 0) {
            items.splice(idx, 1);
        } else {
            items[idx].quantity = q;
        }
        writeCart(items);
    }

    function removeItem(id) {
        const items = readCart().filter((i) => i.id !== id);
        writeCart(items);
    }

    function clearCart() {
        writeCart([]);
    }

    const api = {
        getCartItems,
        saveCartItems,
        getCartCount,
        addItemToCart,
        setItemQuantity,
        removeItem,
        clearCart,
    };

    window.ShopCart = api;

    document.addEventListener("DOMContentLoaded", function () {
        const countEls = document.querySelectorAll("[data-cart-count]");
        const count = api.getCartCount();
        countEls.forEach((el) => {
            el.textContent = String(count);
        });
    });
})();

```

### cart.html
**Path:** `/shop/cart.html`

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Porch Logic – Cart</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="./shop.css" />
</head>

<body>
    <header class="shop-header">
        <a href="/" class="logo-link">Porch Logic</a>
        <nav class="shop-nav">
            <a href="./index.html" class="nav-link">Shop</a>
            <a href="./cart.html" class="cart-link">
                <span>Cart</span>
                <span class="cart-count">0</span>
            </a>
        </nav>
    </header>

    <main class="shop-main cart-main">
        <h1>Your cart</h1>

        <section class="cart-layout">
            <!-- Full-width cart panel only -->
            <div class="cart-panel card">
                <h2>Items</h2>
                <div id="cart-items-container" class="cart-items"></div>

                <div class="cart-summary">
                    <span>Total</span>
                    <strong id="cart-total">$0.00</strong>
                </div>

                <div class="cart-actions">
                    <a href="./index.html" class="button">Continue shopping</a>
                    <button id="go-to-checkout" class="button button-primary" type="button">
                        Checkout
                    </button>
                </div>
            </div>
        </section>
    </main>

    
    
    <!-- <canvas id="mound-grid" width="640" height="240"
        style="border:1px solid #444; width:100%; max-width:640px; display:block; margin:auto;">
    </canvas>

    <div style="text-align:center; margin-top:10px;">
        <button id="mode-toggle" style="padding:6px 14px; font-size:16px; cursor:pointer;">
            ON
        </button>
    </div>
    
    <script>
        (function () {

            const ROWS = 8;
            const COLS = 16;
            const WIDTH = 640;
            const HEIGHT = 240;

            let moundData = Array.from({ length: ROWS }, () =>
                Array.from({ length: COLS }, () => 0)
            );

            const canvas = document.getElementById("mound-grid");
            const ctx = canvas.getContext("2d");
            const toggleBtn = document.getElementById("mode-toggle");

            let isDragging = false;
            let dragButton = 0;  // 0 = left, 2 = right (right-click)
            let changedThisDrag = new Set();
            let mode = "ON";     // ON means left-click = add

            toggleBtn.addEventListener("click", () => {
                mode = (mode === "ON" ? "OFF" : "ON");
                toggleBtn.innerText = mode;
            });

            function getHitInfo(x, y) {
                const colWidth = WIDTH / COLS;
                const rowHeight = HEIGHT / ROWS;

                const col = Math.floor(x / colWidth);
                const row = Math.floor(y / rowHeight);

                if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
                return { row, col };
            }

            function applyAction(row, col, button) {
                const key = `${row}:${col}`;
                if (changedThisDrag.has(key)) return;
                changedThisDrag.add(key);

                let turnOn;

                if (mode === "ON") {
                    // normal mode
                    turnOn = (button === 0);   // left → on, right → off
                } else {
                    // inverted mode
                    turnOn = (button === 2);   // right → on, left → off
                }

                moundData[row][col] = turnOn ? 1 : 0;
                draw();
            }

            function draw() {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ccc";

                const colWidth = WIDTH / COLS;
                const rowHeight = HEIGHT / ROWS;

                for (let r = 0; r < ROWS; r++) {
                    const baseY = r * rowHeight + rowHeight / 2;

                    ctx.beginPath();

                    for (let c = 0; c < COLS; c++) {

                        const h = moundData[r][c];
                        const hNext = (c < COLS - 1) ? moundData[r][c + 1] : null;

                        const x0 = c * colWidth;
                        const x1 = x0 + colWidth;
                        const midX = (x0 + x1) / 2;

                        const yPeak = baseY - (h * (rowHeight * 0.35));

                        if (c === 0)
                            ctx.moveTo(x0, baseY);

                        // plateau
                        if (h === 1 && hNext === 1) {
                            ctx.lineTo(x1, yPeak);
                            continue;
                        }

                        // mound segment (ON)
                        if (h === 1) {
                            ctx.lineTo(midX, yPeak);  // up the left slope
                            ctx.lineTo(x1, baseY);    // down the right slope
                        }

                        // flat segment (OFF)
                        if (h === 0) {
                            ctx.lineTo(x1, baseY);
                        }
                    }

                    ctx.stroke();
                }
            }

            function getCanvasCoords(evt) {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (evt.clientX - rect.left) * (canvas.width / rect.width),
                    y: (evt.clientY - rect.top) * (canvas.height / rect.height)
                };
            }

            canvas.addEventListener("contextmenu", e => e.preventDefault());

            canvas.addEventListener("mousedown", evt => {
                isDragging = true;
                dragButton = evt.button;
                changedThisDrag.clear();

                const { x, y } = getCanvasCoords(evt);
                const hit = getHitInfo(x, y);
                if (hit) applyAction(hit.row, hit.col, dragButton);
            });

            canvas.addEventListener("mousemove", evt => {
                if (!isDragging) return;
                const { x, y } = getCanvasCoords(evt);
                const hit = getHitInfo(x, y);
                if (hit) applyAction(hit.row, hit.col, dragButton);
            });

            canvas.addEventListener("mouseup", () => {
                isDragging = false;
                changedThisDrag.clear();
            });
            document.addEventListener("mouseup", () => {
                isDragging = false;
                changedThisDrag.clear();
            });

            // public API
            window.moundGrid = {
                getData: () => JSON.parse(JSON.stringify(moundData)),
                setData: (d) => {
                    moundData = JSON.parse(JSON.stringify(d));
                    draw();
                }
            };

            draw();

        })();
    </script> -->



    <footer class="shop-footer">
        <p>Porch Logic &copy; <span id="year"></span></p>
    </footer>

    <!-- No Stripe here anymore -->
    <script src="./cart.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const y = document.getElementById("year");
            if (y) y.textContent = new Date().getFullYear();

            const checkoutBtn = document.getElementById("go-to-checkout");
            if (checkoutBtn) {
                checkoutBtn.addEventListener("click", () => {
                    // Only navigate if there are items
                    const cartItems = getCartItems();
                    if (!cartItems || cartItems.length === 0) return;
                    window.location.href = "./checkout.html";
                });
            }
        });
    </script>
</body>

</html>
```

### cart.js
**Path:** `/shop/cart.js`

```javascript
// Cart data will be stored in Session Storage
const CART_STORAGE_KEY = 'porchlogic_cart';

// ---------- helpers: storage ----------

function getCartItems() {
    const cartItemsString = sessionStorage.getItem(CART_STORAGE_KEY);
    return cartItemsString ? JSON.parse(cartItemsString) : [];
}

function saveCartItems(cartItems) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

// Generate a stable per-line-item uid
function ensureItemUid(item) {
    if (!item.uid) {
        item.uid =
            'ci_' +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2, 8);
    }
    return item.uid;
}

// ---------- mound grid factory (multi-instance) ----------

const moundGridInstances = new Map(); // uid -> { getData, setData }

function createMoundGrid(canvas, controls, initialData, onChange) {
    const ROWS = 8;
    const COLS = 16;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height; // square

    let moundData = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => 0)
    );

    if (Array.isArray(initialData) && initialData.length === ROWS) {
        moundData = JSON.parse(JSON.stringify(initialData));
    }

    const ctx = canvas.getContext('2d');

    let isDragging = false;
    let dragButton = 0; // 0 = left, 2 = right
    let changedThisDrag = new Set();
    let mode = 'mound'; // 'mound' or 'flat'

    const flatBtn = controls?.flatBtn || null;
    const moundBtn = controls?.moundBtn || null;

    function setMode(newMode) {
        mode = newMode;
        if (flatBtn) {
            flatBtn.classList.toggle('active', mode === 'flat');
        }
        if (moundBtn) {
            moundBtn.classList.toggle('active', mode === 'mound');
        }
    }

    if (flatBtn) flatBtn.addEventListener('click', () => setMode('flat'));
    if (moundBtn) moundBtn.addEventListener('click', () => setMode('mound'));

    // default mode
    setMode('mound');

    function getHitInfo(x, y) {
        const colWidth = WIDTH / COLS;
        const rowHeight = HEIGHT / ROWS;

        const col = Math.floor(x / colWidth);
        const row = Math.floor(y / rowHeight);

        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
        return { row, col };
    }

    function applyAction(row, col, button) {
        const key = `${row}:${col}`;
        if (changedThisDrag.has(key)) return;
        changedThisDrag.add(key);

        let value;
        if (button === 2) {
            // right-click = erase (flat)
            value = 0;
        } else {
            // left-click obeys mode
            value = mode === 'mound' ? 1 : 0;
        }

        moundData[row][col] = value;
        draw();

        if (typeof onChange === 'function') {
            onChange(JSON.parse(JSON.stringify(moundData)));
        }
    }

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 9;         // thicker lines
        ctx.strokeStyle = '#ccc';

        const colWidth = WIDTH / COLS;
        const rowHeight = HEIGHT / ROWS;

        for (let r = 0; r < ROWS; r++) {
            const baseY = r * rowHeight + rowHeight / 2;

            ctx.beginPath();

            for (let c = 0; c < COLS; c++) {
                const h = moundData[r][c];
                const hNext = c < COLS - 1 ? moundData[r][c + 1] : null;

                const x0 = c * colWidth;
                const x1 = x0 + colWidth;
                const midX = (x0 + x1) / 2;

                const yPeak = baseY - h * (rowHeight * 0.35);

                if (c === 0) ctx.moveTo(x0, baseY);

                // plateau of ON cells
                if (h === 1 && hNext === 1) {
                    ctx.lineTo(x1, yPeak);
                    continue;
                }

                if (h === 1) {
                    // mound shape
                    ctx.lineTo(midX, yPeak);
                    ctx.lineTo(x1, baseY);
                }

                if (h === 0) {
                    // flat
                    ctx.lineTo(x1, baseY);
                }
            }

            ctx.stroke();
        }
    }

    function getCanvasCoords(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (canvas.height / rect.height),
        };
    }

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('mousedown', (evt) => {
        // allow left(0) + right(2)
        if (evt.button !== 0 && evt.button !== 2) return;

        isDragging = true;
        dragButton = evt.button;
        changedThisDrag.clear();

        const { x, y } = getCanvasCoords(evt);
        const hit = getHitInfo(x, y);
        if (hit) applyAction(hit.row, hit.col, dragButton);
    });

    canvas.addEventListener('mousemove', (evt) => {
        if (!isDragging) return;
        const { x, y } = getCanvasCoords(evt);
        const hit = getHitInfo(x, y);
        if (hit) applyAction(hit.row, hit.col, dragButton);
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        changedThisDrag.clear();
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        changedThisDrag.clear();
    });

    draw();

    return {
        getData: () => JSON.parse(JSON.stringify(moundData)),
        setData: (d) => {
            moundData = JSON.parse(JSON.stringify(d));
            draw();
        },
    };
}



// ---------- cart logic ----------

// Add an item to the cart
function addItemToCart(item) {
    const cartItems = getCartItems();

    // Special case: each M8 plate is its own line item
    if (item.id === 'm8_plate_1') {
        const qty = Math.max(1, Math.floor(item.quantity || 1));
        for (let i = 0; i < qty; i++) {
            const lineItem = {
                ...item,
                quantity: 1,
                customGlyphEnabled: false,
                glyphData: null,
            };
            ensureItemUid(lineItem);
            cartItems.push(lineItem);
        }
    } else {
        // Default behavior: merge by id
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += item.quantity || 1;
        } else {
            const lineItem = {
                ...item,
                quantity: item.quantity || 1,
                customGlyphEnabled: false,
                glyphData: null,
            };
            ensureItemUid(lineItem);
            cartItems.push(lineItem);
        }
    }

    saveCartItems(cartItems);
    updateCartIconCount();

    // If we're on the cart page, re-render
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
}

// Remove an item from the cart (by uid if present, fallback to id)
function removeItemFromCart(itemKey) {
    let cartItems = getCartItems();

    cartItems = cartItems.filter((item) => {
        const uid = item.uid || item.id;
        return uid !== itemKey;
    });

    saveCartItems(cartItems);
    updateCartIconCount();

    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
}

// Update the cart item count displayed in the header
function updateCartIconCount() {
    const cartItems = getCartItems();
    const totalItems = cartItems.reduce(
        (count, item) => count + (item.quantity || 0),
        0
    );
    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = totalItems;
    }
}

// Helper: toggle checkout button
function updateCheckoutButtonState() {
    const checkoutBtn = document.getElementById('go-to-checkout');
    if (!checkoutBtn) return;

    const cartItems = getCartItems();
    if (!cartItems.length) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('button-disabled');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('button-disabled');
    }
}

// Render cart items on the cart page
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    let cartItems = getCartItems();

    // Ensure all items have uids
    let mutated = false;
    cartItems.forEach((item) => {
        if (!item.uid) {
            ensureItemUid(item);
            mutated = true;
        }
        if (item.customGlyphEnabled === undefined) {
            item.customGlyphEnabled = false;
            item.glyphData = item.glyphData || null;
            mutated = true;
        }
    });
    if (mutated) saveCartItems(cartItems);

    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '$0.00';

        updateCheckoutButtonState();
        return;
    }

    const itemList = document.createElement('ul');
    itemList.className = 'cart-item-list';

    cartItems.forEach((item) => {
        const uid = ensureItemUid(item);

        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        listItem.setAttribute('data-cart-item-uid', uid);

        const lineTotal = (item.price * item.quantity).toFixed(2);

        // Header row (name, qty, price, remove)
        const headerRow = document.createElement('div');
        headerRow.className = 'cart-item-header';
        headerRow.innerHTML = `
			<span class="cart-item-name">${item.name}</span>
			<span class="cart-item-qty">Qty: ${item.quantity}</span>
			<span class="cart-item-price">$${lineTotal}</span>
		`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'button remove-item-small';
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';
        removeBtn.dataset.itemUid = uid;
        headerRow.appendChild(removeBtn);

        listItem.appendChild(headerRow);

        // Optional glyph row for M8 plates
        if (item.id === 'm8_plate_1') {
            const glyphRow = document.createElement('div');
            glyphRow.className = 'cart-glyph-row';

            const checkboxId = `glyph-checkbox-${uid}`;
            const editorId = `glyph-editor-${uid}`;

            glyphRow.innerHTML = `
				<label class="glyph-label" for="${checkboxId}">
					<input type="checkbox" id="${checkboxId}" class="glyph-checkbox" data-item-uid="${uid}">
					Add custom glyph
				</label>
				<div class="glyph-editor hidden" id="${editorId}"></div>
			`;

            listItem.appendChild(glyphRow);
        }

        itemList.appendChild(listItem);
    });

    cartItemsContainer.appendChild(itemList);
    updateCartTotal();
    updateCheckoutButtonState();

    // Wire remove buttons
    cartItemsContainer.querySelectorAll('.remove-item-small').forEach((button) => {
        button.addEventListener('click', (event) => {
            const uid = event.currentTarget.dataset.itemUid;
            removeItemFromCart(uid);
        });
    });

    // Wire glyph checkboxes + instantiate mound grids
    cartItemsContainer.querySelectorAll('.glyph-checkbox').forEach((checkbox) => {
        const uid = checkbox.dataset.itemUid;
        const editor = document.getElementById(`glyph-editor-${uid}`);
        const item = cartItems.find((i) => i.uid === uid);

        if (!item || !editor) return;

        // Restore state
        if (item.customGlyphEnabled) {
            checkbox.checked = true;
            editor.classList.remove('hidden');
            attachMoundGrid(uid, editor, item.glyphData);
        }

        checkbox.addEventListener('change', () => {
            const items = getCartItems();
            const it = items.find((i) => i.uid === uid);
            if (!it) return;

            it.customGlyphEnabled = checkbox.checked;
            saveCartItems(items);

            if (checkbox.checked) {
                editor.classList.remove('hidden');
                attachMoundGrid(uid, editor, it.glyphData);
            } else {
                editor.classList.add('hidden');
                // keep glyphData but no need to destroy instance
            }
        });
    });
}

// Create or reattach mound grid inside the editor container
function attachMoundGrid(uid, editorEl, existingData) {
    // Clear any existing DOM in editor
    editorEl.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = 640;   // square
    canvas.height = 640;  // square
    canvas.style.border = '1px solid #444';
    canvas.style.width = '100%';
    canvas.style.maxWidth = '640px';
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';

    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'glyph-mode-wrapper';

    const flatBtn = document.createElement('button');
    flatBtn.type = 'button';
    flatBtn.className = 'glyph-mode-btn';
    flatBtn.title = 'Flat line';
    flatBtn.innerHTML = '<span class="glyph-icon glyph-icon-flat"></span>';

    const moundBtn = document.createElement('button');
    moundBtn.type = 'button';
    moundBtn.className = 'glyph-mode-btn';
    moundBtn.title = 'Mound';
    moundBtn.innerHTML = '<span class="glyph-icon glyph-icon-mound"></span>';

    controlsWrapper.appendChild(flatBtn);
    controlsWrapper.appendChild(moundBtn);

    editorEl.appendChild(canvas);
    editorEl.appendChild(controlsWrapper);

    // When grid changes, persist to sessionStorage
    const instance = createMoundGrid(
        canvas,
        { flatBtn, moundBtn },
        existingData,
        (data) => {
            const items = getCartItems();
            const it = items.find((i) => i.uid === uid);
            if (!it) return;
            it.glyphData = data;
            saveCartItems(items);
        }
    );

    moundGridInstances.set(uid, instance);
}



// Calculate and display the cart total
function updateCartTotal() {
    const cartItems = getCartItems();
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Popup helpers

function showCartPopup(message) {
    const cartPopup = document.getElementById('cart-popup');
    const popupMessage = document.getElementById('popup-message');
    if (cartPopup && popupMessage) {
        popupMessage.textContent = message;
        cartPopup.classList.add('visible');
    }
}

function hideCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup) {
        cartPopup.classList.remove('visible');
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount();

    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    } else {
        updateCheckoutButtonState();
    }
});

```

### checkout.html
**Path:** `/shop/checkout.html`

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Porch Logic – Checkout</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="./shop.css" />
</head>

<body>
    <header class="shop-header">
        <a href="/" class="logo-link">Porch Logic</a>
        <nav class="shop-nav">
            <a href="./index.html" class="nav-link">Shop</a>
            <a href="./cart.html" class="cart-link">
                <span>Cart</span>
                <span class="cart-count">0</span>
            </a>
        </nav>
    </header>

    <main class="shop-main cart-main">
        <h1>Checkout</h1>

        <section class="cart-layout">
            <div class="checkout-panel card">
                <h2>Payment</h2>
                <p class="small-note">
                    All payments handled by Stripe. We don’t see your card details.
                </p>

                <form id="payment-form">
                    <div class="form-section">
                        <label for="email">Email</label>
                        <input id="email" type="email" autocomplete="email" required />
                        <div id="email-errors" class="field-error"></div>
                    </div>

                    <div class="form-section">
                        <label>
                            <input type="checkbox" id="subscribe-checkbox" />
                            <span>Keep me in the loop about future Porch Logic experiments.</span>
                        </label>
                    </div>

                    <div class="form-section">
                        <label>Shipping address</label>
                        <div id="shipping-address-element" class="stripe-element"></div>
                    </div>

                    <div class="form-section">
                        <label>Payment</label>
                        <div id="payment-element" class="stripe-element"></div>
                    </div>

                    <div id="payment-message" class="payment-message hidden"></div>

                    <button id="submit" class="button button-primary" type="submit">
                        <span id="spinner" class="spinner hidden"></span>
                        <span id="button-text">Pay</span>
                    </button>
                </form>

                <p class="small-note">
                    After payment, you’ll be redirected back to Porch Logic to confirm everything
                    worked.
                </p>
            </div>
        </section>
    </main>

    <footer class="shop-footer">
        <p>Porch Logic &copy; <span id="year"></span></p>
    </footer>

    <!-- Stripe.js v3 – Basil or newer -->
    <script src="https://js.stripe.com/basil/stripe.js"></script>

    <!-- Cart functions (getCartItems, etc.) -->
    <script src="./cart.js"></script>

    <!-- Your existing checkout logic, unchanged -->
    <script src="./checkout.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const y = document.getElementById("year");
            if (y) y.textContent = new Date().getFullYear();
        });
    </script>
</body>

</html>
```

### checkout.js
**Path:** `/shop/checkout.js`

```javascript
// Publishable Stripe API key (live)
const stripe = Stripe("pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr");

const THIS_API_BASE = "https://api.porchlogic.com";
let checkout = null;

// Kick off once this file is loaded (on cart page)
initialize().catch(err => {
    console.error("❌ Failed to initialize checkout:", err);
});

// ---- helpers that depend on checkout (guarded) ----

const validateEmail = async (email) => {
    if (!checkout) {
        return { isValid: false, message: "Checkout not initialized yet." };
    }
    const updateResult = await checkout.updateEmail(email);
    const isValid = updateResult.type !== "error";
    return { isValid, message: !isValid ? updateResult.error.message : null };
};

const paymentFormEl = document.querySelector("#payment-form");
if (paymentFormEl) {
    paymentFormEl.addEventListener("submit", handleSubmit);
}

// ---- main init ----

async function initialize() {
    console.log("🛒 Initializing checkout…");
    console.log("🛒 Cart items (from sessionStorage):", getCartItems());

    const cartItems = getCartItems(); // from cart.js

    // If cart is empty, don't try to talk to Stripe at all
    if (!cartItems || cartItems.length === 0) {
        console.warn("🛒 No cart items, skipping checkout init.");
        return;
    }

    // Hit your existing backend exactly like before
    console.log("➡️ Sending POST to /create-checkout-session:", JSON.stringify({ cartItems }, null, 2));

    const promise = fetch(`${THIS_API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems })
    }).then(async (res) => {
        let data = null;
        try {
            data = await res.json();
        } catch (e) {
            console.error("❌ Non-JSON response from /create-checkout-session:", e);
            throw new Error("Server returned non-JSON response.");
        }

        // If HTTP status is not OK, surface and throw
        if (!res.ok) {
            console.error("❌ /create-checkout-session HTTP error:", res.status, data);

            // Inventory special handling (matches your server.js)
            if (data && data.error === "InventoryError") {
                const msg = data.message || "Not enough inventory.";
                showInventoryError(data.itemId, msg);
                showMessage(msg);
                throw new Error(msg);
            }

            const msg =
                (data && (data.message || data.error)) ||
                "Checkout session failed. Please try again.";

            showMessage(msg);
            throw new Error(msg);
        }

        // Happy path: ensure clientSecret exists
        if (!data || typeof data.clientSecret !== "string") {
            console.error("❌ No clientSecret in successful response:", data);
            showMessage("Checkout session error. Please try again or contact support.");
            throw new Error("Missing clientSecret");
        }

        return data.clientSecret;
    });

    const appearance = { theme: "night" };

    // Hand the promise to Stripe's Custom Checkout
    checkout = await stripe.initCheckout({
        fetchClientSecret: () => promise,
        elementsOptions: { appearance }
    });

    // Update button label with Stripe’s computed total, if available
    const btnTextNode = document.querySelector("#button-text");
    if (btnTextNode) {
        try {
            const session = checkout.session();
            const amountCents = session?.total?.total?.amount;
            if (typeof amountCents === "number") {
                const amountDollars = (amountCents / 100).toFixed(2);
                btnTextNode.textContent = `Pay $${amountDollars}`;
            } else {
                btnTextNode.textContent = "Pay";
            }
        } catch (e) {
            console.warn("⚠️ Could not read checkout.session().total:", e);
            btnTextNode.textContent = "Pay";
        }
    }

    // Email validation wiring
    const emailInput = document.getElementById("email");
    const emailErrors = document.getElementById("email-errors");

    if (emailInput && emailErrors) {
        emailInput.addEventListener("input", () => {
            emailErrors.textContent = "";
        });

        emailInput.addEventListener("blur", async () => {
            const newEmail = emailInput.value;
            if (!newEmail) return;

            const { isValid, message } = await validateEmail(newEmail);
            if (!isValid && message) {
                emailErrors.textContent = message;
            }
        });
    }

    // Stripe UI elements
    const paymentElement = checkout.createPaymentElement();
    paymentElement.mount("#payment-element");

    const shippingAddressElement = checkout.createShippingAddressElement();
    shippingAddressElement.mount("#shipping-address-element");
}

// ---- submit handler ----

async function handleSubmit(e) {
    e.preventDefault();

    if (!checkout) {
        showMessage("Checkout is not ready yet. Please reload the page.");
        return;
    }

    setLoading(true);

    const emailInput = document.getElementById("email");
    const email = emailInput ? emailInput.value : "";

    const { isValid, message } = await validateEmail(email);
    if (!isValid) {
        if (message) showMessage(message);
        setLoading(false);
        return;
    }

    // Newsletter opt-in
    const subscribeCheckbox = document.getElementById("subscribe-checkbox");
    const subscribe = subscribeCheckbox ? subscribeCheckbox.checked : false;

    if (subscribe && email) {
        try {
            await fetch(`${THIS_API_BASE}/newsletter-signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
        } catch (err) {
            console.warn("Newsletter signup failed:", err);
        }
    }

    // Confirm with Stripe
    const { error } = await checkout.confirm();

    if (error) {
        showMessage(error.message);
        setLoading(false);
        return;
    }

    // On success, Stripe will redirect to YOUR_DOMAIN/stripe/return.html
}

// ---- inventory + UI helpers ----

function showInventoryError(itemId, message) {
    const itemRow = document.querySelector(`[data-cart-item-id="${itemId}"]`);
    if (itemRow) {
        const msg = document.createElement("div");
        msg.className = "item-error-message";
        msg.textContent = message;
        itemRow.appendChild(msg);
    }

    const submitBtn = document.querySelector("#submit");
    if (submitBtn) submitBtn.disabled = true;

    const spinner = document.querySelector("#spinner");
    if (spinner) spinner.classList.add("hidden");

    const btnText = document.querySelector("#button-text");
    if (btnText) {
        btnText.classList.remove("hidden");
        btnText.textContent = "Fix issues above";
    }
}

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    if (!messageContainer) return;
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;
    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

function setLoading(isLoading) {
    const submitBtn = document.querySelector("#submit");
    const spinner = document.querySelector("#spinner");
    const btnText = document.querySelector("#button-text");

    if (!submitBtn || !spinner || !btnText) return;

    if (isLoading) {
        submitBtn.disabled = true;
        spinner.classList.remove("hidden");
        btnText.classList.add("hidden");
    } else {
        submitBtn.disabled = false;
        spinner.classList.add("hidden");
        btnText.classList.remove("hidden");
    }
}

```

### index.html
**Path:** `/shop/index.html`

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Porch Logic – Shop</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="./shop.css" />
</head>

<body>
    <header class="shop-header">
        <a href="/" class="logo-link">Porch Logic</a>
        <nav class="shop-nav">
            <a href="./cart.html" class="cart-link">
                <span>Cart</span>
                <span class="cart-count">0</span>
            </a>
        </nav>
    </header>

    <main class="shop-main">
        <section class="hero">
            <h1>Porch Logic Shop</h1>
            <p>A minimal little storefront for things we’re building and iterating on.</p>
        </section>

        <section class="product-grid">
            <article class="card card-product">
                <header class="card-header">
                    <h2>M8 Plate</h2>
                    <p class="price">$32</p>
                </header>
                <div class="card-body">
                    <p>
                        Custom 3D-printed faceplate for the Dirtywave M8. Built to be used,
                        iterated, and upgraded.
                    </p>
                    <ul class="feature-list">
                        <li>Includes one future upgrade at 50% off</li>
                        <li>Designed and printed by Porch Logic</li>
                        <li>We are always iterating on this</li>
                    </ul>
                </div>
                <footer class="card-footer">
                    <button id="buy-m8-plate-1" class="button button-product">
                        Add to cart
                    </button>
                </footer>
            </article>

            <article class="card card-product coming-soon">
                <header class="card-header">
                    <h2>SMB1 Beta</h2>
                    <p class="price">Coming soon</p>
                </header>
                <div class="card-body">
                    <p>Experimental MIDI sync hardware for group performances and weird projects.</p>
                    <p class="small-note">Not available yet – watch this space.</p>
                </div>
                <footer class="card-footer">
                    <button class="button button-product" disabled>
                        Coming soon
                    </button>
                </footer>
            </article>
        </section>
    </main>

    <div id="cart-popup" class="cart-popup">
        <div class="cart-popup-inner card">
            <p id="popup-message"></p>
            <div class="cart-popup-actions">
                <button class="button" onclick="hideCartPopup()">Keep browsing</button>
                <a href="./cart.html" class="button button-primary">Go to cart</a>
            </div>
        </div>
    </div>

    <footer class="shop-footer">
        <p>Porch Logic &copy; <span id="year"></span></p>
    </footer>

    <script src="./cart.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Footer year
            const y = document.getElementById("year");
            if (y) y.textContent = new Date().getFullYear();

            // M8 Plate buy button
            const buyBtn = document.getElementById("buy-m8-plate-1");
            if (buyBtn) {
                buyBtn.addEventListener("click", () => {
                    const item = {
                        id: "m8_plate_1",       // MUST match PRICE_LOOKUP on the server
                        name: "M8 Plate",
                        price: 32.0,
                        quantity: 1
                    };
                    addItemToCart(item);
                    showCartPopup(`${item.name} added to cart.`);
                });
            }
        });
    </script>
</body>

</html>
```

### shop.css
**Path:** `/shop/shop.css`

```css
:root {
	/* Base palette (dark, neutral) */
	--bg: #0b1020;
	--bg-alt: #111827;
	--bg-elevated: #111827;
	--bg-elevated-soft: #1f2937;
	--border-subtle: #1f2937;
	--border-strong: #374151;

	/* Accent (blue primary, green as secondary “porch” accent) */
	--accent: #3b82f6; /* primary CTA */
	--accent-soft: rgba(59, 130, 246, 0.15);
	--accent-strong: #2563eb;
	--accent-secondary: #22c55e;

	/* Text */
	--text: #e5e7eb;
	--muted: #9ca3af;
	--muted-soft: #6b7280;
	--danger: #fb7185;

	/* Shape & motion */
	--radius-lg: 18px;
	--radius-md: 10px;
	--radius-pill: 999px;
	--shadow-soft: 0 22px 45px rgba(0, 0, 0, 0.6);
	--transition-fast: 0.16s ease-out;

	font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
		"Segoe UI", sans-serif;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

html {
	font-size: 16px;
}

body {
	margin: 0;
	min-height: 100vh;
	background:
		radial-gradient(circle at top, rgba(31, 41, 55, 0.7), transparent 60%),
		radial-gradient(circle at bottom, #020617, #020617 60%);
	color: var(--text);
	font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
		"Segoe UI", sans-serif;
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
}

a {
	color: inherit;
	text-decoration: none;
}

button {
	font-family: inherit;
}

/* ---------------- Header ---------------- */

.shop-header {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.9rem 1.75rem;
	background: rgba(15, 23, 42, 0.96);
	backdrop-filter: blur(18px);
	border-bottom: 1px solid rgba(31, 41, 55, 0.9);
}

.logo-link {
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
	font-weight: 600;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	font-size: 0.78rem;
	padding: 0.35rem 0.9rem;
	border-radius: var(--radius-pill);
	border: 1px solid rgba(148, 163, 184, 0.5);
	background: rgba(15, 23, 42, 0.95);
	color: #e5e7eb;
}

.shop-nav {
	display: flex;
	gap: 0.75rem;
	align-items: center;
}

.nav-link {
	padding: 0.45rem 0.95rem;
	border-radius: var(--radius-pill);
	font-size: 0.84rem;
	color: var(--muted-soft);
	border: 1px solid transparent;
	transition:
		background var(--transition-fast),
		color var(--transition-fast),
		border-color var(--transition-fast),
		transform var(--transition-fast);
}

.nav-link:hover {
	color: var(--text);
	border-color: rgba(148, 163, 184, 0.35);
	background: rgba(31, 41, 55, 0.95);
	transform: translateY(-0.5px);
}

.cart-link {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.35rem 0.9rem 0.35rem 0.7rem;
	border-radius: var(--radius-pill);
	background: #111827;
	border: 1px solid rgba(148, 163, 184, 0.55);
	font-size: 0.84rem;
	color: var(--text);
	transition:
		background var(--transition-fast),
		border-color var(--transition-fast),
		transform var(--transition-fast);
}

.cart-link:hover {
	background: #020617;
	border-color: rgba(148, 163, 184, 0.85);
	transform: translateY(-0.5px);
}

.cart-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.4rem;
	height: 1.4rem;
	border-radius: var(--radius-pill);
	background: var(--accent-secondary);
	color: #020617;
	font-weight: 600;
	font-size: 0.78rem;
}

/* ---------------- Main layout ---------------- */

.shop-main {
	max-width: 1060px;
	margin: 2rem auto 3rem;
	padding: 0 1.6rem;
}

.hero {
	margin-bottom: 1.8rem;
}

.hero h1 {
	margin: 0 0 0.35rem;
	font-size: 1.9rem;
	font-weight: 600;
	letter-spacing: -0.02em;
}

.hero p {
	margin: 0;
	color: var(--muted-soft);
	font-size: 0.96rem;
}

/* ---------------- Cards ---------------- */

.card {
	background: var(--bg-elevated);
	border-radius: var(--radius-lg);
	border: 1px solid var(--border-subtle);
	box-shadow: var(--shadow-soft);
	padding: 1.35rem 1.5rem;
}

.card-product {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 0.5rem;
	margin-bottom: 0.35rem;
}

.card-header h2 {
	margin: 0;
	font-size: 1.1rem;
	font-weight: 500;
}

.card-header .price {
	margin: 0;
	font-weight: 600;
	color: var(--accent-secondary);
	font-size: 0.98rem;
}

.card-body {
	font-size: 0.9rem;
	color: var(--muted);
}

.card-footer {
	margin-top: 0.9rem;
	display: flex;
	justify-content: flex-end;
}

.coming-soon {
	opacity: 0.78;
}

.feature-list {
	margin: 0.55rem 0 0;
	padding-left: 1.1rem;
	font-size: 0.85rem;
	color: var(--muted);
}

.small-note {
	font-size: 0.8rem;
	color: var(--muted-soft);
}

/* ---------------- Buttons ---------------- */

.button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.55rem 1.1rem;
	border-radius: var(--radius-pill);
	border: 1px solid rgba(148, 163, 184, 0.6);
	background: #111827;
	color: var(--text);
	font-size: 0.86rem;
	cursor: pointer;
	transition:
		background var(--transition-fast),
		transform var(--transition-fast),
		box-shadow var(--transition-fast),
		border-color var(--transition-fast),
		color var(--transition-fast);
}

.button:hover {
	background: #020617;
	transform: translateY(-1px);
	box-shadow: 0 14px 30px rgba(15, 23, 42, 0.9);
}

.button:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.button:disabled {
	opacity: 0.5;
	cursor: default;
	box-shadow: none;
	transform: none;
}

.button-primary {
	background: linear-gradient(to right, var(--accent), var(--accent-strong));
	border-color: transparent;
	color: #f9fafb;
	font-weight: 600;
}

.button-primary:hover {
	filter: brightness(1.03);
	box-shadow: 0 18px 36px rgba(37, 99, 235, 0.4);
}

/* Semantic variant */

.button-product {
	min-width: 8rem;
}

/* ---------------- Product grid ---------------- */

.product-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1.25rem;
}

@media (min-width: 720px) {
	.product-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

/* ---------------- Cart ---------------- */

.cart-main h1 {
	margin-top: 0.3rem;
	margin-bottom: 1.1rem;
	letter-spacing: -0.015em;
}

.cart-layout {
	display: grid;
	grid-template-columns: minmax(0, 1.15fr);
	gap: 1.4rem;
}

@media (min-width: 880px) {
	.cart-layout {
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.9fr);
		align-items: flex-start;
	}
}

.cart-items {
	min-height: 3rem;
	margin-top: 0.75rem;
}

/* Cart list: more like the reference – flat rows with separators */
.cart-item-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
}

.cart-item {
	padding: 0.75rem 0;
	font-size: 0.9rem;
	border-bottom: 1px solid rgba(55, 65, 81, 0.8);
	display: flex;
	flex-direction: column;
	row-gap: 0.5rem;
}

.cart-item:last-child {
	border-bottom: none;
}

.cart-item-header {
	display: grid;
	grid-template-columns: minmax(0, 2.4fr) auto auto auto;
	align-items: center;
	column-gap: 0.75rem;
	row-gap: 0.25rem;
}

.cart-item-name {
	font-weight: 500;
	color: #f9fafb;
}

.cart-item-price {
	text-align: right;
}

.remove-item-small {
	font-size: 0.78rem;
	padding: 0.25rem 0.6rem;
}

.cart-summary {
	margin-top: 1.1rem;
	padding-top: 0.85rem;
	border-top: 1px solid rgba(55, 65, 81, 0.9);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.94rem;
	color: var(--muted-soft);
}

.cart-summary strong {
	font-size: 1.02rem;
	color: #f9fafb;
}

.cart-actions {
	margin-top: 0.85rem;
	display: flex;
	justify-content: space-between;
	gap: 0.8rem;
}

/* ---------------- Checkout form ---------------- */

.checkout-panel {
	background: #111827;
	border-radius: 22px;
	border: 1px solid #1f2937;
	box-shadow: var(--shadow-soft);
}

.checkout-panel h2 {
	margin-top: 0;
	font-size: 1.02rem;
	font-weight: 500;
	margin-bottom: 0.75rem;
}

.form-section {
	margin-bottom: 0.9rem;
	font-size: 0.85rem;
}

.form-section label {
	display: block;
	margin-bottom: 0.3rem;
	color: var(--muted);
}

.form-section input[type="email"] {
	width: 100%;
	border-radius: 0.65rem;
	border: 1px solid rgba(148, 163, 184, 0.6);
	padding: 0.55rem 0.7rem;
	background: #020617;
	color: var(--text);
	font-size: 0.86rem;
}

.form-section input[type="email"]::placeholder {
	color: var(--muted-soft);
}

.form-section input[type="email"]:focus-visible {
	outline: none;
	border-color: var(--accent);
	box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.45);
}

.form-section input[type="checkbox"] {
	margin-right: 0.4rem;
}

.field-error {
	color: var(--danger);
	font-size: 0.8rem;
	margin-top: 0.2rem;
	min-height: 0.9rem;
}

/* Stripe elements – simple flat inputs */
.stripe-element {
	padding: 0.6rem 0.75rem;
	border-radius: 0.75rem;
	border: 1px solid rgba(148, 163, 184, 0.55);
	background: #020617;
}

/* ---------------- Payment message & spinner ---------------- */

.payment-message {
	margin: 0.5rem 0;
	font-size: 0.85rem;
	color: var(--danger);
}

.hidden {
	display: none !important;
}

.spinner {
	border: 2px solid rgba(15, 23, 42, 0.45);
	border-top-color: #f9fafb;
	border-right-color: #f9fafb;
	border-radius: 999px;
	width: 16px;
	height: 16px;
	margin-right: 0.5rem;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* ---------------- Item-level inventory error ---------------- */

.item-error-message {
	margin-top: 0.25rem;
	font-size: 0.8rem;
	color: var(--danger);
}

/* ---------------- Popup ---------------- */

.cart-popup {
	position: fixed;
	inset: 0;
	display: none;
	align-items: center;
	justify-content: center;
	background:
		radial-gradient(circle at top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.98));
	z-index: 20;
}

.cart-popup.visible {
	display: flex;
}

.cart-popup-inner {
	max-width: 360px;
	width: 100%;
}

/* Popup actions */

.cart-popup-actions {
	margin-top: 1rem;
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
}

/* ---------------- Glyph editor row ---------------- */

.cart-glyph-row {
	margin-top: 0.35rem;
	display: flex;
	flex-direction: column;
	row-gap: 0.45rem;
}

.glyph-label {
	font-size: 0.8rem;
	color: var(--muted-soft);
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
}

.glyph-editor {
	margin-top: 0.25rem;
}

/* Mode selector */

.glyph-mode-wrapper {
	text-align: center;
	margin-top: 10px;
	display: inline-flex;
	gap: 0.5rem;
	justify-content: center;
}

.glyph-mode-btn {
	padding: 6px 10px;
	cursor: pointer;
	border-radius: var(--radius-pill);
	border: 1px solid rgba(148, 163, 184, 0.6);
	background: #020617;
	color: var(--text);
	transition:
		background 0.15s ease-out,
		border-color 0.15s ease-out,
		transform 0.15s ease-out;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.glyph-mode-btn.active {
	background: var(--accent-soft);
	border-color: var(--accent);
	transform: translateY(-1px);
}

/* Glyph icons */

.glyph-icon {
	display: block;
	width: 32px;
	height: 16px;
	position: relative;
}

/* Flat: straight horizontal line */
.glyph-icon-flat::before {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	border-bottom: 2px solid var(--text);
	border-radius: 999px;
}

/* Mound: little arch/mound */
.glyph-icon-mound::before {
	content: "";
	position: absolute;
	left: 4px;
	right: 4px;
	bottom: 0;
	height: 100%;
	border: 2px solid var(--text);
	border-bottom: none;
	border-radius: 999px 999px 0 0;
}

/* ---------------- Footer ---------------- */

.shop-footer {
	border-top: 1px solid rgba(31, 41, 55, 0.95);
	padding: 1rem 1.75rem 1.7rem;
	text-align: center;
	color: var(--muted-soft);
	font-size: 0.8rem;
	margin-top: 2.4rem;
}

/* ---------------- Reduced motion ---------------- */

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		scroll-behavior: auto !important;
		animation-duration: 0.001ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.001ms !important;
	}
}

```

### shop.js
**Path:** `/shop/shop.js`

```javascript
(function () {
    "use strict";

    function formatMoney(amount) {
        return "$" + amount.toFixed(2);
    }

    function rebuildCartUI() {
        const items = window.ShopCart.getCartItems();
        const emptyEl = document.getElementById("cart-empty");
        const filledEl = document.getElementById("cart-filled");
        const tbody = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");
        const checkoutBtn = document.getElementById("checkout-button");
        const countEls = document.querySelectorAll("[data-cart-count]");

        const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        countEls.forEach((el) => (el.textContent = String(count)));

        if (!items.length) {
            if (emptyEl) emptyEl.hidden = false;
            if (filledEl) filledEl.hidden = true;
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (totalEl) totalEl.textContent = "$0.00";
            if (tbody) tbody.innerHTML = "";
            return;
        }

        if (emptyEl) emptyEl.hidden = true;
        if (filledEl) filledEl.hidden = false;
        if (checkoutBtn) checkoutBtn.disabled = false;

        if (tbody) {
            tbody.innerHTML = "";
            let total = 0;
            items.forEach((item) => {
                const price = Number(item.price || 0);
                const qty = item.quantity || 0;
                const subtotal = price * qty;
                total += subtotal;

                const tr = document.createElement("tr");

                const tdName = document.createElement("td");
                tdName.textContent = item.name || item.id;

                const tdQty = document.createElement("td");
                tdQty.className = "pl-cart-num";
                const qtyInput = document.createElement("input");
                qtyInput.type = "number";
                qtyInput.min = "1";
                qtyInput.value = String(qty);
                qtyInput.style.width = "3rem";
                qtyInput.addEventListener("change", () => {
                    const q = Math.max(1, Math.floor(Number(qtyInput.value) || 1));
                    window.ShopCart.setItemQuantity(item.id, q);
                    rebuildCartUI();
                });
                tdQty.appendChild(qtyInput);

                const tdPrice = document.createElement("td");
                tdPrice.className = "pl-cart-num";
                tdPrice.textContent = formatMoney(price);

                const tdSubtotal = document.createElement("td");
                tdSubtotal.className = "pl-cart-num";
                tdSubtotal.textContent = formatMoney(subtotal);

                const tdRemove = document.createElement("td");
                const btnRemove = document.createElement("button");
                btnRemove.className = "pl-remove-btn";
                btnRemove.type = "button";
                btnRemove.textContent = "Remove";
                btnRemove.addEventListener("click", () => {
                    window.ShopCart.removeItem(item.id);
                    rebuildCartUI();
                });
                tdRemove.appendChild(btnRemove);

                tr.appendChild(tdName);
                tr.appendChild(tdQty);
                tr.appendChild(tdPrice);
                tr.appendChild(tdSubtotal);
                tr.appendChild(tdRemove);

                tbody.appendChild(tr);
            });
            if (totalEl) totalEl.textContent = formatMoney(total);
        }
    }

    function wireAddToCartButtons() {
        const buttons = document.querySelectorAll("[data-add-to-cart]");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-product-id");
                const name = btn.getAttribute("data-product-name");
                const price = Number(btn.getAttribute("data-product-price") || "0");

                let qty = 1;
                if (id === "m8_plate_1") {
                    const input = document.getElementById("m8-qty");
                    if (input) {
                        const val = Number(input.value || "1");
                        qty = Math.max(1, Math.floor(val || 1));
                    }
                }

                window.ShopCart.addItemToCart({
                    id,
                    name,
                    price,
                    quantity: qty,
                });

                rebuildCartUI();
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        wireAddToCartButtons();
        rebuildCartUI();
    });
})();

```
