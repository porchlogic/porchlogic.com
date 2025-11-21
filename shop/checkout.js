(function () {
    "use strict";

    const API_BASE = "https://api.porchlogic.com";
    const STRIPE_PUBLISHABLE_KEY =
        "pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr";

    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

    let checkout = null;       // like your old code
    let payButton = null;
    let payButtonLabel = null;
    let errorBox = null;
    let loadingBox = null;

    function formatMoney(amount) {
        return "$" + amount.toFixed(2);
    }

    function showError(message) {
        if (!errorBox) return;
        if (!message) {
            errorBox.style.display = "none";
            errorBox.textContent = "";
            return;
        }
        errorBox.textContent = message;
        errorBox.style.display = "block";
    }

    function setPayLoading(isLoading) {
        if (!payButton || !payButtonLabel) return;
        payButton.disabled = isLoading || !checkout;
        payButtonLabel.textContent = isLoading ? "Processing…" : "Pay now";
    }

    function buildSummary(cartItems) {
        const tableBody = document.getElementById("summary-items");
        const totalEl = document.getElementById("summary-total");
        const countEls = document.querySelectorAll("[data-cart-count]");

        if (!tableBody || !totalEl) return;

        tableBody.innerHTML = "";
        let total = 0;
        let count = 0;

        cartItems.forEach((item) => {
            const price = Number(item.price || 0);
            const qty = item.quantity || 0;
            const subtotal = price * qty;

            count += qty;
            total += subtotal;

            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = item.name || item.id;

            const tdQty = document.createElement("td");
            tdQty.className = "pl-cart-num";
            tdQty.textContent = String(qty);

            const tdPrice = document.createElement("td");
            tdPrice.className = "pl-cart-num";
            tdPrice.textContent = formatMoney(price);

            const tdSubtotal = document.createElement("td");
            tdSubtotal.className = "pl-cart-num";
            tdSubtotal.textContent = formatMoney(subtotal);

            tr.appendChild(tdName);
            tr.appendChild(tdQty);
            tr.appendChild(tdPrice);
            tr.appendChild(tdSubtotal);

            tableBody.appendChild(tr);
        });

        totalEl.textContent = formatMoney(total);
        countEls.forEach((el) => (el.textContent = String(count)));
    }

    /**
     * This mirrors your old `initialize()` function:
     * - builds a Promise that calls /create-checkout-session
     * - passes that to stripe.initCheckout via fetchClientSecret
     * - mounts Payment Element
     */
    async function initializeStripe(cartItems) {
        // Promise that fetches clientSecret from your API
        const clientSecretPromise = fetch(API_BASE + "/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cartItems: cartItems.map((item) => ({
                    id: item.id,
                    quantity: item.quantity || 1,
                })),
            }),
        })
            .then(async (res) => {
                const data = await res.json();

                // Handle inventory error the way you did before
                if (!res.ok || data.error === "InventoryError") {
                    const msg =
                        data?.message ||
                        "Inventory error – one of the items is no longer available in that quantity.";
                    // For this new UI, we just surface the message at the top.
                    showError(msg);
                    throw new Error(msg);
                }

                if (!data.clientSecret || typeof data.clientSecret !== "string") {
                    const msg = "Checkout session creation failed (no client secret).";
                    console.error("🚫 Missing or invalid clientSecret:", data);
                    throw new Error(msg);
                }

                return data.clientSecret;
            })
            .catch((err) => {
                console.error("Error creating checkout session", err);
                throw err;
            });

        const appearance = {
            theme: "night",
        };

        // OLD PATTERN: await stripe.initCheckout + fetchClientSecret
        checkout = await stripe.initCheckout({
            fetchClientSecret: async () => {
                const secret = await clientSecretPromise;
                return secret;
            },
            elementsOptions: { appearance },
        });

        // Mount Payment Element (no extra email/shipping widgets in this version)
        const paymentElement = checkout.createPaymentElement();
        paymentElement.mount("#payment-element");

        // Turn off "loading" banner and enable the button
        if (loadingBox) loadingBox.style.display = "none";
        if (payButton) payButton.disabled = false;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const emptySection = document.getElementById("checkout-empty");
        const mainSection = document.getElementById("checkout-main");

        payButton = document.getElementById("pay-button");
        payButtonLabel = document.getElementById("pay-button-label");
        errorBox = document.getElementById("payment-error");
        loadingBox = document.getElementById("payment-loading");

        const cartItems = window.ShopCart.getCartItems();

        // No items → show "empty cart" panel
        if (!cartItems.length) {
            if (emptySection) emptySection.hidden = false;
            if (mainSection) mainSection.hidden = true;
            return;
        }

        // Show main checkout UI
        if (emptySection) emptySection.hidden = true;
        if (mainSection) mainSection.hidden = false;

        // Build order summary (read-only)
        buildSummary(cartItems);

        // Start Stripe init in the background
        (async function () {
            try {
                showError("");
                if (loadingBox) loadingBox.style.display = "block";
                if (payButton) payButton.disabled = true;

                await initializeStripe(cartItems);
            } catch (err) {
                console.error("Stripe setup failed", err);
                showError(err.message || "Could not initialize payment.");
                if (loadingBox) loadingBox.style.display = "none";
                if (payButton) payButton.disabled = true;
            }
        })();

        // Submit handler – uses checkout.confirm() like your old code
        const form = document.getElementById("payment-form");
        if (form) {
            form.addEventListener("submit", async function (evt) {
                evt.preventDefault();
                showError("");

                if (!checkout) {
                    showError("Payment form is still loading. Please wait a moment.");
                    return;
                }

                setPayLoading(true);

                try {
                    const { error } = await checkout.confirm();
                    if (error) {
                        showError(error.message || "Payment failed. Try again.");
                        setPayLoading(false);
                        return;
                    }
                    // Normal flow: Stripe will redirect to return_url.
                } catch (err) {
                    console.error("checkout.confirm() error", err);
                    showError(err.message || "Payment failed. Try again.");
                    setPayLoading(false);
                }
            });
        }
    });
})();
