(function () {
    "use strict";

    const API_BASE = "https://api.porchlogic.com";
    const STRIPE_PUBLISHABLE_KEY =
        "pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr";

    let checkoutActions = null;
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
        payButton.disabled = isLoading || !checkoutActions;
        payButtonLabel.textContent = isLoading ? "Processing…" : "Pay now";
    }

    async function setupStripe(cartItems) {
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

        const body = {
            cartItems: cartItems.map((item) => ({
                id: item.id,
                quantity: item.quantity || 1,
            })),
        };

        const clientSecretPromise = fetch(API_BASE + "/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then(async (res) => {
                if (!res.ok) {
                    let msg = "Failed to start checkout.";
                    try {
                        const data = await res.json();
                        if (data.error === "InventoryError" && data.message) {
                            msg = data.message;
                        } else if (data.error) {
                            msg = data.error;
                        }
                    } catch (e) {
                        /* ignore parse error */
                    }
                    throw new Error(msg);
                }
                const data = await res.json();
                if (!data.clientSecret) {
                    throw new Error("Missing client secret from server.");
                }
                return data.clientSecret;
            })
            .catch((err) => {
                console.error("Error creating checkout session", err);
                throw err;
            });

        let checkout;
        try {
            checkout = stripe.initCheckout({
                clientSecret: clientSecretPromise,
                elementsOptions: {
                    appearance: {
                        theme: "night",
                        variables: {
                            colorPrimary: "#22c55e",
                            colorBackground: "#050609",
                            colorText: "#f9fafb",
                            colorDanger: "#f97373",
                            borderRadius: "8px",
                        },
                    },
                },
            });
        } catch (e) {
            console.error("initCheckout failed", e);
            throw e;
        }

        const paymentElement = checkout.createPaymentElement();
        paymentElement.mount("#payment-element");

        const loadResult = await checkout.loadActions();
        if (loadResult.type !== "success") {
            console.error("loadActions error", loadResult.error);
            throw new Error(
                loadResult.error?.message || "Unable to load checkout actions."
            );
        }

        checkoutActions = loadResult.actions;
        if (loadingBox) loadingBox.style.display = "none";
        if (payButton) payButton.disabled = false;
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

    document.addEventListener("DOMContentLoaded", function () {
        const emptySection = document.getElementById("checkout-empty");
        const mainSection = document.getElementById("checkout-main");
        payButton = document.getElementById("pay-button");
        payButtonLabel = document.getElementById("pay-button-label");
        errorBox = document.getElementById("payment-error");
        loadingBox = document.getElementById("payment-loading");

        const cartItems = window.ShopCart.getCartItems();

        if (!cartItems.length) {
            if (emptySection) emptySection.hidden = false;
            if (mainSection) mainSection.hidden = true;
            return;
        }

        if (emptySection) emptySection.hidden = true;
        if (mainSection) mainSection.hidden = false;

        buildSummary(cartItems);

        // Initialize Stripe checkout
        (async function () {
            try {
                showError("");
                if (loadingBox) loadingBox.style.display = "block";
                if (payButton) payButton.disabled = true;
                await setupStripe(cartItems);
            } catch (err) {
                console.error("Stripe setup failed", err);
                showError(err.message || "Could not initialize payment.");
                if (loadingBox) loadingBox.style.display = "none";
                if (payButton) payButton.disabled = true;
            }
        })();

        const form = document.getElementById("payment-form");
        if (form) {
            form.addEventListener("submit", async function (evt) {
                evt.preventDefault();
                showError("");

                if (!checkoutActions) {
                    showError("Payment form is still loading. Please wait a moment.");
                    return;
                }

                setPayLoading(true);
                try {
                    const result = await checkoutActions.confirm();
                    if (result.type === "error") {
                        showError(result.error?.message || "Payment failed. Try again.");
                        setPayLoading(false);
                        return;
                    }
                    // For most payment methods, the browser will now redirect
                    // to the return_url defined on the Checkout Session.
                } catch (err) {
                    console.error("confirm() error", err);
                    showError(err.message || "Payment failed. Try again.");
                    setPayLoading(false);
                }
            });
        }
    });
})();
