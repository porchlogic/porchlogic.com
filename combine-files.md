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


This seems to be working now. But we need the checkout experience to be more standard,

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
            <div class="cart-panel card">
                <h2>Items</h2>
                <div id="cart-items-container" class="cart-items"></div>
                <div class="cart-summary">
                    <span>Total</span>
                    <strong id="cart-total">$0.00</strong>
                </div>
                <div class="cart-actions">
                    <a href="./index.html" class="button">Continue shopping</a>
                </div>
            </div>

            <div class="checkout-panel card">
                <h2>Checkout</h2>
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

    <style>
        #pixel-grid {
            display: grid;
            grid-template-rows: repeat(8, 1fr);
            gap: 2px;
            width: 320px;
            padding: 8px;
            background: #222;
        }
    
        .pixel-row {
            display: grid;
            grid-template-columns: repeat(32, 1fr);
            gap: 2px;
        }
    
        .pixel {
            width: 10px;
            height: 10px;
            cursor: pointer;
            background: white;
            border-radius: 2px;
            transition: background 0.15s;
        }
    </style>
    
    <div id="pixel-grid"></div>
    
    <script>
        (function () {

            // Pixel states → background colors
            const COLORS = {
                0: "white",
                0.5: "gray",
                1: "black"
            };

            // Internal data: 8 rows × 32 columns
            let gridData = Array.from({ length: 8 }, () =>
                Array.from({ length: 32 }, () => 0)
            );

            function cycleValue(v) {
                if (v === 0) return 0.5;
                if (v === 0.5) return 1;
                return 0;
            }

            function renderGrid() {
                const container = document.getElementById("pixel-grid");
                container.innerHTML = "";

                gridData.forEach((row, rIdx) => {
                    const rowDiv = document.createElement("div");
                    rowDiv.className = "pixel-row";

                    row.forEach((value, cIdx) => {
                        const cell = document.createElement("div");
                        cell.className = "pixel";
                        cell.style.background = COLORS[value];

                        cell.addEventListener("click", () => {
                            gridData[rIdx][cIdx] = cycleValue(gridData[rIdx][cIdx]);
                            cell.style.background = COLORS[gridData[rIdx][cIdx]];
                        });

                        rowDiv.appendChild(cell);
                    });

                    container.appendChild(rowDiv);
                });
            }

            // Public API
            window.pixelGrid = {
                getData: () => JSON.parse(JSON.stringify(gridData)),
                setData: (newData) => {
                    gridData = JSON.parse(JSON.stringify(newData));
                    renderGrid();
                }
            };

            renderGrid();

        })();
    </script>


    <footer class="shop-footer">
        <p>Porch Logic &copy; <span id="year"></span></p>
    </footer>

    <!-- Stripe.js v3 – latest (Basil or newer) -->
    <script src="https://js.stripe.com/basil/stripe.js"></script>
    <script src="./cart.js"></script>
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

### cart.js
**Path:** `/shop/cart.js`

```javascript
// Cart data will be stored in Session Storage
const CART_STORAGE_KEY = 'porchlogic_cart';

// Get cart items from Session Storage
function getCartItems() {
    const cartItemsString = sessionStorage.getItem(CART_STORAGE_KEY);
    return cartItemsString ? JSON.parse(cartItemsString) : [];
}

// Save cart items to Session Storage
function saveCartItems(cartItems) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

// Add an item to the cart
function addItemToCart(item) {
    const cartItems = getCartItems();
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity || 1;
    } else {
        cartItems.push({ ...item, quantity: item.quantity || 1 });
    }

    saveCartItems(cartItems);
    updateCartIconCount();
}

// Remove an item from the cart
function removeItemFromCart(itemId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCartItems(cartItems);
    updateCartIconCount();

    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
}

// Update the cart item count displayed in the header
function updateCartIconCount() {
    const cartItems = getCartItems();
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = totalItems;
    }
}

// Render cart items on the cart page
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    const cartItems = getCartItems();
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '$0.00';

        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.style.display = 'none';
        }
        return;
    }

    const itemList = document.createElement('ul');
    itemList.className = 'cart-item-list';

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';
        listItem.setAttribute('data-cart-item-id', item.id);

        listItem.innerHTML = `
			<span>${item.name}</span>
			<span>Qty: ${item.quantity}</span>
			<span>$${(item.price * item.quantity).toFixed(2)}</span>
			<button class="button remove-item" data-item-id="${item.id}">Remove</button>
		`;
        itemList.appendChild(listItem);
    });

    cartItemsContainer.appendChild(itemList);
    updateCartTotal();

    // Add event listeners to remove buttons
    cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.dataset.itemId;
            removeItemFromCart(itemId);
        });
    });

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'block';
    }
}

// Calculate and display the cart total
function updateCartTotal() {
    const cartItems = getCartItems();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    <title>Checkout · Porch Logic</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" href="./shop.css" />
    <script src="https://js.stripe.com/v3/basil"></script>
</head>

<body class="pl-body">
    <header class="pl-header">
        <div class="pl-header-left">
            <h1>Checkout</h1>
            <p class="pl-tagline">Secure payment powered by Stripe.</p>
        </div>
        <div class="pl-header-right">
            <button class="button pl-cart-button" type="button" onclick="window.location.href='./index.html'">
                <span>Back to shop</span>
            </button>
        </div>
    </header>

    <main class="pl-checkout-layout">
        <div class="pl-breadcrumb">
            <a href="./index.html">Shop</a> · <span>Checkout</span>
        </div>

        <section id="checkout-empty" class="pl-panel" hidden>
            <h2>Cart is empty</h2>
            <p>Add an item first, then come back here to pay.</p>
            <button class="button" type="button" onclick="window.location.href='./index.html'">
                Return to shop
            </button>
        </section>

        <section id="checkout-main" class="pl-checkout-grid" hidden>
            <!-- Cart summary (read-only here) -->
            <div class="pl-panel">
                <h2>Order summary</h2>
                <p>Review your items before payment.</p>

                <table class="pl-cart-table" id="summary-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="pl-cart-num">Qty</th>
                            <th class="pl-cart-num">Price</th>
                            <th class="pl-cart-num">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody id="summary-items"></tbody>
                </table>

                <div class="pl-cart-total">
                    <span>Items total (before tax & shipping)</span>
                    <strong id="summary-total">$0.00</strong>
                </div>

                <p class="pl-payment-meta">
                    Tax and shipping are calculated by Stripe after you enter your address.
                </p>
            </div>

            <!-- Payment panel -->
            <div class="pl-panel">
                <h2>Payment</h2>
                <p>Card details handled securely by Stripe. Porch Logic never sees your card number.</p>

                <form id="payment-form">
                    <div id="payment-element"></div>

                    <div id="payment-loading" class="pl-alert pl-alert-info" style="margin-top:0.75rem;">
                        <span class="pl-spinner" style="margin-right:0.4rem; vertical-align:middle;"></span>
                        <span>Initializing secure payment form…</span>
                    </div>

                    <div id="payment-error" class="pl-alert pl-alert-error" style="display:none;"></div>

                    <div class="pl-payment-footer">
                        <button class="button" id="pay-button" type="submit" disabled>
                            <span id="pay-button-label">Pay now</span>
                        </button>
                        <div class="pl-payment-meta">
                            Stripe will redirect you back here after payment.<br />
                            You’ll receive a receipt at the email you enter.
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </main>

    <footer class="pl-footer">
        <p>Porch Logic · porchlogic.com</p>
    </footer>

    <script src="./cart-utils.js"></script>
    <script src="./checkout.js"></script>
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
    --bg: #05070a;
    --bg-alt: #0c1118;
    --card-bg: #101722;
    --border-subtle: #232b3a;
    --accent: #4ade80;
    --accent-soft: rgba(74, 222, 128, 0.15);
    --accent-strong: #22c55e;
    --text: #e5e7eb;
    --muted: #9ca3af;
    --danger: #f97373;
    --radius-lg: 16px;
    --shadow-soft: 0 18px 40px rgba(0, 0, 0, 0.45);
    --transition-fast: 0.15s ease-out;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top, #040712 0, #020308 40%, #000 100%);
    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

a {
    color: inherit;
    text-decoration: none;
}

/* Header */

.shop-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(to bottom, rgba(1, 3, 8, 0.95), rgba(1, 3, 8, 0.85));
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.logo-link {
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.85rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.35), transparent);
}

.shop-nav {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.nav-link {
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    font-size: 0.85rem;
    color: var(--muted);
    border: 1px solid transparent;
    transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.nav-link:hover {
    color: var(--text);
    border-color: rgba(148, 163, 184, 0.4);
    background: rgba(15, 23, 42, 0.8);
}

.cart-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.8rem 0.35rem 0.5rem;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.5);
    font-size: 0.85rem;
}

.cart-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.4rem;
    border-radius: 999px;
    background: var(--accent);
    color: #020617;
    font-weight: 600;
    font-size: 0.8rem;
}

/* Main layout */

.shop-main {
    max-width: 960px;
    margin: 1.5rem auto 2.5rem;
    padding: 0 1rem;
}

.hero {
    margin-bottom: 1.75rem;
}

.hero h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
}

.hero p {
    margin: 0;
    color: var(--muted);
}

/* Cards & buttons */

.card {
    background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.15), transparent),
        radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.08), transparent);
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-soft);
    padding: 1.25rem 1.5rem;
}

.card-product {
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.card-header h2 {
    margin: 0;
    font-size: 1.1rem;
}

.card-header .price {
    margin: 0;
    font-weight: 600;
    color: var(--accent);
}

.card-body {
    font-size: 0.9rem;
    color: var(--muted);
}

.card-footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
}

.coming-soon {
    opacity: 0.75;
}

.feature-list {
    margin: 0.5rem 0 0;
    padding-left: 1.1rem;
    font-size: 0.85rem;
    color: var(--muted);
}

.small-note {
    font-size: 0.8rem;
    color: var(--muted);
}

/* Buttons */

.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.6);
    background: rgba(15, 23, 42, 0.95);
    color: var(--text);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast),
        border-color var(--transition-fast), color var(--transition-fast);
}

.button:hover {
    background: rgba(15, 23, 42, 1);
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.7);
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
    color: #020617;
    font-weight: 600;
}

.button-primary:hover {
    filter: brightness(1.05);
}

/* More explicit semantic variants */

.button-product {
    min-width: 8rem;
}

/* Product grid */

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

/* Cart */

.cart-main h1 {
    margin-top: 0.25rem;
    margin-bottom: 1rem;
}

.cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr);
    gap: 1.25rem;
}

@media (min-width: 880px) {
    .cart-layout {
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    }
}

.cart-items {
    min-height: 3rem;
    margin-top: 0.75rem;
}

.cart-item-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.cart-item {
    display: grid;
    grid-template-columns: minmax(0, 2fr) auto auto auto;
    align-items: center;
    column-gap: 0.5rem;
    row-gap: 0.25rem;
    font-size: 0.9rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.75rem;
    background: rgba(15, 23, 42, 0.8);
}

.cart-item span:nth-child(1) {
    font-weight: 500;
}

.cart-item span:nth-child(3) {
    text-align: right;
}

.cart-item .remove-item {
    font-size: 0.8rem;
    padding: 0.3rem 0.65rem;
}

.cart-summary {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px dashed rgba(148, 163, 184, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
}

.cart-summary strong {
    font-size: 1.05rem;
}

.cart-actions {
    margin-top: 0.75rem;
    text-align: right;
}

/* Checkout form */

.checkout-panel h2 {
    margin-top: 0;
}

.form-section {
    margin-bottom: 0.9rem;
    font-size: 0.85rem;
}

.form-section label {
    display: block;
    margin-bottom: 0.25rem;
}

.form-section input[type="email"] {
    width: 100%;
    border-radius: 0.6rem;
    border: 1px solid rgba(148, 163, 184, 0.6);
    padding: 0.5rem 0.6rem;
    background: rgba(15, 23, 42, 0.9);
    color: var(--text);
}

.form-section input[type="email"]:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
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

.stripe-element {
    padding: 0.6rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.5);
    background: rgba(15, 23, 42, 0.95);
}

/* Payment message & spinner */

.payment-message {
    margin: 0.5rem 0;
    font-size: 0.85rem;
    color: var(--danger);
}

.hidden {
    display: none !important;
}

.spinner {
    border: 2px solid rgba(15, 23, 42, 0.4);
    border-top-color: #020617;
    border-right-color: #020617;
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

/* Item-level inventory error */

.item-error-message {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--danger);
}

/* Popup */

.cart-popup {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.98));
    z-index: 20;
}

.cart-popup.visible {
    display: flex;
}

.cart-popup-inner {
    max-width: 360px;
    width: 100%;
}

.cart-popup-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Footer */

.shop-footer {
    border-top: 1px solid rgba(148, 163, 184, 0.25);
    padding: 1rem 1.25rem 1.5rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.8rem;
    margin-top: 2rem;
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
