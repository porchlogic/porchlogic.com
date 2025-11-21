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
