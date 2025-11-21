// Publishable Stripe API key (live)
const stripe = Stripe("pk_live_51J3mlbABTHjSuIhXgQq9s0XUfm1Fgnao9DnO29jF1hf4LpKh129cDDOpwiQRptEx7QlkcrnpHTfa3OQX30wHI4mB00NgdoLrSr");

const THIS_API_BASE = 'https://api.porchlogic.com';
let checkout;

// Kick off once this file is loaded (on cart page)
initialize();

const validateEmail = async (email) => {
    const updateResult = await checkout.updateEmail(email);
    const isValid = updateResult.type !== "error";
    return { isValid, message: !isValid ? updateResult.error.message : null };
};

const paymentForm = document.querySelector("#payment-form");
if (paymentForm) {
    paymentForm.addEventListener("submit", handleSubmit);
}

// Fetch Checkout Session and initialize Custom Checkout UI
async function initialize() {
    const cartItems = getCartItems(); // from cart.js

    // If cart is empty, don't hit Stripe
    if (!cartItems || cartItems.length === 0) {
        return;
    }

    const promise = fetch(`${THIS_API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems })
    })
        .then((r) => r.json())
        .then((r) => {
            if (r.error === "InventoryError") {
                showInventoryError(r.itemId, r.message);
                throw new Error("Inventory error");
            }
            return r.clientSecret;
        });

    const appearance = {
        theme: 'night',
    };

    checkout = await stripe.initCheckout({
        fetchClientSecret: async () => {
            const clientSecret = await promise;
            if (typeof clientSecret !== "string") {
                console.error("🚫 Missing or invalid clientSecret:", clientSecret);
                throw new Error("Checkout session creation failed");
            }
            return clientSecret;
        },
        elementsOptions: { appearance }
    });

    // Update button label with Stripe’s computed total
    const btnTextNode = document.querySelector("#button-text");
    if (btnTextNode) {
        const session = checkout.session();
        if (session && session.total && session.total.total && typeof session.total.total.amount === "number") {
            const amountCents = session.total.total.amount;
            const amountDollars = (amountCents / 100).toFixed(2);
            btnTextNode.textContent = `Pay $${amountDollars}`;
        } else {
            btnTextNode.textContent = "Pay";
        }
    }

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
            if (!isValid) {
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

async function handleSubmit(e) {
    e.preventDefault();
    if (!checkout) return;

    setLoading(true);

    const email = document.getElementById("email").value;
    const { isValid, message } = await validateEmail(email);
    if (!isValid) {
        showMessage(message);
        setLoading(false);
        return;
    }

    const subscribe = document.getElementById("subscribe-checkbox").checked;
    if (subscribe) {
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

    const { error } = await checkout.confirm();

    if (error) {
        showMessage(error.message);
        setLoading(false);
        return;
    }

    // Normal flow redirects to return_url handled by your existing /stripe/return.html
}

// Inventory error helper (same pattern as old version)
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

// ------- UI helpers -------

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
